<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import GlobalSet from "./globalSet.vue";
import ComponentsSet from "./componentsSet.vue";
import EdgeSet from "./edgeSet.vue";

const props = defineProps(["attributeProps", "edgeProps", "lf", "clickType", "globalFormData"]);
const activeName = ref("globalSet");
defineExpose({
	activeName
});
const isShow = computed(() => {
	const attributeProps = Object.keys(props.attributeProps);
	if (attributeProps.length) {
		return true;
	}
	return false;
});
</script>

<template>
	<div class="attributePanel">
		<el-tabs v-model="activeName">
			<el-tab-pane label="组件设置" name="componentsSet">
				<template v-if="isShow">
					<ComponentsSet :attributeProps="props.attributeProps" :lf="props.lf" v-if="props.clickType === 'node'" />
					<EdgeSet :edgeProps="props.edgeProps" :lf="props.lf" v-else />
				</template>
			</el-tab-pane>
			<el-tab-pane label="全局设置" name="globalSet">
				<GlobalSet :globalFormData="props.globalFormData" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<style lang="scss" scoped>
:deep(.el-tabs__item) {
	width: 125px;
}
.attributePanel {
	box-sizing: border-box;
	width: 270px;
	height: 100%;
	overflow: hidden;
	background-color: #fff;
}
</style>
