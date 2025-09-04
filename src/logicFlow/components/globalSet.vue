<script setup lang="ts">
import { ref } from "vue";
const props = defineProps(["globalFormData"]);
const activeNames = ref(["1"]);
</script>

<template>
	<div class="panel">
		<el-collapse v-model="activeNames">
			<el-collapse-item title="基本信息" name="1">
				<el-form label-width="auto" label-position="top" size="small" :disabled="true">
					<el-form-item label="组件名称">
						<el-input v-model="props.globalFormData.chain_nm" />
					</el-form-item>
					<el-form-item label="组件编码">
						<el-input v-model="props.globalFormData.chain_cd" />
					</el-form-item>
					<el-form-item label="版本号">
						<el-input />
					</el-form-item>
					<el-form-item label="备注">
						<el-input type="textarea" v-model="props.globalFormData.remark" />
					</el-form-item>
				</el-form>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>
<style lang="scss" scoped>
@import "./common.scss";
</style>
