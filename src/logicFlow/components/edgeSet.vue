<script setup lang="ts">
import { ref, inject } from "vue";
const props = defineProps({
	edgeProps: {
		type: Object,
		default: () => {}
	},
	lf: {
		type: Object,
		default: () => {}
	}
});

const activeNames = ref(["1"]);

const handleInput = (val: string, type: string) => {
	if (props.lf) {
		if (type === "text") {
			props.lf.updateText(props.edgeProps.id, val);
			return;
		}
		props.lf.setProperties(props.edgeProps.id, {
			[type]: val
		});
	}
};
</script>

<template>
	<div class="panel">
		<el-collapse v-model="activeNames">
			<el-collapse-item title="基本信息" name="1">
				<el-form label-width="auto" label-position="top" size="small">
					<el-form-item label="线段文字">
						<el-input placeholder="输入线段文字" v-model="props.edgeProps.text.value" @input="val => handleInput(val, 'text')" />
					</el-form-item>
					<el-form-item label="标记">
						<el-input
							placeholder="输入线标记"
							v-model="props.edgeProps.properties.tag"
							@change="val => handleInput(val, 'tag')"
						/>
					</el-form-item>
				</el-form>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>
<style lang="scss" scoped>
@import "./common.scss";
</style>
