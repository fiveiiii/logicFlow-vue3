<script setup lang="ts">
import { ref } from "vue";
import { languageType, Properties, MonacoEditorConfig } from "../constants";
import { Document } from "@element-plus/icons-vue";
import MonacoEditor from "@/components/MonacoEditor/index.vue";

const props = withDefaults(defineProps<{ attributeProps: Properties; lf: any }>(), {});
const activeNames = ref(["1", "2"]);
const scriptDialog = ref(false);
const code = ref("");
// 监听属性值变化,更新lf节点属性
const updateLfValue = (val: string, type: string) => {
	if (props.lf) {
		if (type === "text") {
			props.lf.updateText(props.attributeProps.id, val);
			return;
		}
		props.lf.setProperties(props.attributeProps.id, {
			[type]: val,
		});
	}
};

// 更新 编辑器内容
const codeConfirm = () => {
	props.attributeProps.cmpModel = code.value;
	updateLfValue(code.value, "cmpModel");
	changeScriptDialog(false);
};
const changeScriptDialog = (val) => {
	if (val) {
		code.value = props.attributeProps.cmpModel;
	}
	scriptDialog.value = val;
};
</script>

<template>
	<div class="panel">
		<el-collapse v-model="activeNames">
			<el-collapse-item title="基本信息" name="1">
				<el-form label-width="auto" label-position="top" size="small">
					<el-form-item label="节点文字">
						<el-input
							placeholder="请输入节点文字"
							v-model="props.attributeProps.text"
							@input="(val) => updateLfValue(val, 'text')"
						/>
					</el-form-item>
					<el-form-item label="组件名称">
						<el-input
							placeholder="请输入组件名称"
							v-model="props.attributeProps.cmpNm"
							:disabled="props.attributeProps.isDisable"
							@change="(val) => updateLfValue(val, 'cmpNm')"
						/>
					</el-form-item>
					<el-form-item label="语言类型">
						<el-select
							placeholder="请选择语言类型"
							v-model="props.attributeProps.languageType"
							:disabled="props.attributeProps.isDisable"
							@change="(val) => updateLfValue(val, 'languageType')"
						>
							<el-option :label="item.label" :value="item.value" v-for="item in languageType" :key="item.value" />
						</el-select>
					</el-form-item>

					<el-form-item :label="props.attributeProps.languageType === 'Java' ? 'Bean名称' : '组件编码'">
						<el-input
							v-model="props.attributeProps.cmpCd"
							:disabled="props.attributeProps.isDisable"
							@change="(val) => updateLfValue(val, 'cmpCd')"
						/>
					</el-form-item>
					<el-form-item :label="props.attributeProps.languageType === 'Java' ? 'Java类' : '脚本'">
						<el-input
							v-model="props.attributeProps.cmpModel"
							:disabled="props.attributeProps.isDisable"
							v-if="props.attributeProps.languageType === 'Java'"
							placeholder="请输入Java类"
							@change="(val) => updateLfValue(val, 'cmpModel')"
						/>
						<el-button type="primary" :icon="Document" v-else @click="changeScriptDialog(true)">脚本</el-button>
					</el-form-item>
					<el-form-item label="备注">
						<el-input
							type="textarea"
							placeholder="请输入备注"
							v-model="props.attributeProps.remark"
							:disabled="props.attributeProps.isDisable"
							@change="(val) => updateLfValue(val, 'remark')"
						/>
					</el-form-item>
				</el-form>
			</el-collapse-item>
			<el-collapse-item title="出参入参" name="2">
				<div class="text-[14px] text-center py-3">入参变量</div>
				<el-table :data="props.attributeProps.inParamList" style="width: 100%" border>
					<el-table-column prop="paramDesc" label="字段描述" show-overflow-tooltip />
					<el-table-column prop="paramNm" label="字段名称" show-overflow-tooltip />
					<el-table-column prop="paramType" label="字段类型" show-overflow-tooltip />
				</el-table>

				<div class="text-[14px] text-center py-3">出参变量</div>
				<el-table :data="props.attributeProps.outParamList" style="width: 100%" border>
					<el-table-column prop="paramDesc" label="字段描述" show-overflow-tooltip />
					<el-table-column prop="paramNm" label="字段名称" show-overflow-tooltip />
					<el-table-column prop="paramType" label="字段类型" show-overflow-tooltip />
				</el-table>
			</el-collapse-item>
		</el-collapse>
		<el-dialog v-model="scriptDialog" title="脚本" width="80%">
			<MonacoEditor v-model="code" :data="{ config: MonacoEditorConfig }" v-if="scriptDialog" />
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="changeScriptDialog(false)">关闭</el-button>
					<el-button type="primary" @click="codeConfirm" v-if="!props.attributeProps.isDisable">确定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<style lang="scss" scoped>
@import "./common.scss";

.monaco-editor {
	border: 1px solid lightgrey;
}
</style>
