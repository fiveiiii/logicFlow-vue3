<script setup lang="ts">
import { computed, ref, watch } from "vue";
// import { useRoute } from "vue-router";
// import usePost from "@/hooks/usePost";
import { fieldType } from "../constants";
import { randomHex10 } from "../utils";
// import { http } from "@/hooks";

const props = defineProps(["lf", "globalFormData"]);
// const { runAsync: fetchElStr, loading: btnLoading } = usePost("POST", "/wms/v1/api/chain/getElStr");

// const { runAsync: fetchDtail } = usePost("POST", "/v1/metadata/business/query");

const testDialog = defineModel<boolean>();
const innerVisible = ref(false);
// const route = useRoute();
const form = ref({ elStr: "" });
const resultForm = ref({ stepStr: "", timeSpent: "" });
const tableData = ref<any>([]);
const resultTableData = ref<any>([]);
// 获取EL表达式
// const id = computed(() => route.query.id);
watch(
	() => testDialog.value,
	async (n) => {
		if (n) {
			try {
				const chainFlow = JSON.stringify(props.lf.getGraphRawData());
				const { ok, data } = await fetchElStr({ chainFlow });
				if (ok) {
					form.value.elStr = data || "";
				}
			} catch (error) {
				console.error(error);
			}
		}
	},
	{
		immediate: true,
	}
);
const changeDialog = (val) => {
	testDialog.value = val;
};
const onTest = async () => {
	console.log("[ tab ] >", tableData.value, props.globalFormData);
	const params = {};
	tableData.value.forEach((item) => {
		params[item.param_name] = item.param_value;
	});
	if (!props.globalFormData.chain_cd) return;
	const { ok, data }: any = await http.post(`/wms/v1/api/chain/mockTest/${props.globalFormData.chain_cd}`, params);
	if (!ok) return;
	resultTableData.value = data.executeStepList || [];
	resultForm.value.stepStr = data.stepStr || "";
	resultForm.value.timeSpent = data.timeSpent;
	innerVisible.value = true;
	console.log("%c [ data ]-51", "font-size:13px; background:pink; color:#bf2c9f;", data);
};
const onAdd = () => {
	tableData.value.push({
		id: randomHex10(),
		param_desc: "",
		param_name: "",
		param_type: "string",
		param_value: "",
	});
};
const handleDel = (row: any) => {
	tableData.value = tableData.value.filter((item) => item.id !== row.id);
};
const handleChange = (row) => {
	if (["string", "object", "array"].includes(row.param_type)) {
		row.param_value = "";
	}
	if (row.param_type === "number") {
		row.param_value = 0;
	}
	if (row.param_type === "boolean") {
		row.param_value = true;
	}
};
const getDtail = async () => {
	const { data, ok } = await fetchDtail({
		conditions: [
			{
				column: "parent_model_id",
				condition: "EQ",
				value: id.value,
			},
		],
		dataSource: "POSTGRESQL",
		tableName: "tbl_om_gen_liteflow_chain_param",
		dataBase: "momDb",
		schema: "momSchema",
		pageNum: 1,
		pageSize: 999,
	});
	if (ok) {
		tableData.value = data.records || [];
		console.log("[ data ] >", data);
	}
};
// 获取全局组件数据
getDtail();
</script>

<template>
	<el-dialog v-model="testDialog" title="模拟测试" width="80%" destroy-on-close>
		<el-form :model="form" label-width="auto" class="p-10" label-suffix="：">
			<el-form-item label="LiteFlow字符串 ">
				<el-input v-model="form.elStr" disabled />
			</el-form-item>
			<el-form-item label="变量">
				<el-button @click="onAdd" type="primary" class="mb-5">添加</el-button>
				<el-table :data="tableData" style="width: 100%" border>
					<el-table-column prop="param_desc" label="字段描述">
						<template #default="{ row }">
							<el-input v-model="row.param_desc" placeholder="请输入字段描述" />
						</template>
					</el-table-column>
					<el-table-column prop="param_name" label="字段名称">
						<template #default="{ row }">
							<el-input v-model="row.param_name" placeholder="请输入字段名称" />
						</template>
					</el-table-column>
					<el-table-column prop="param_type" label="字段类型">
						<template #default="{ row }">
							<el-select placeholder="Select" v-model="row.param_type" @change="handleChange(row)">
								<el-option v-for="item in fieldType" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="param_value" label="值">
						<template #default="{ row }">
							<el-input
								v-model="row.param_value"
								placeholder="请输入值"
								v-if="['string', 'object', 'array'].includes(row.param_type)"
							/>
							<el-input-number
								class="w-full"
								v-model="row.param_value"
								:min="0"
								controls-position="right"
								v-if="row.param_type === 'number'"
							/>
							<el-select placeholder="Select" v-model="row.param_value" v-if="row.param_type === 'boolean'">
								<el-option label="true" :value="true" />
								<el-option label="false" :value="false" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="100">
						<template #default="{ row }">
							<el-button type="primary" @click="handleDel(row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
		</el-form>
		<el-dialog v-model="innerVisible" width="80%" title="测试结果" append-to-body>
			<el-form :model="resultForm" label-width="auto" class="p-10" label-suffix="：">
				<el-form-item label="执行流">
					<el-input v-model="resultForm.stepStr" disabled autosize type="textarea">
						<template #append>ms</template>
					</el-input>
				</el-form-item>
				<el-form-item label="执行节点 ">
					<el-table :data="resultTableData" style="width: 100%" border>
						<el-table-column type="index" label="序号" width="100" />
						<el-table-column prop="nodeNm" label="执行组件名称" />
						<el-table-column prop="nodeCd" label="执行组件编码" />
						<el-table-column prop="success" label="状态">
							<template #default="{ row }">
								<el-tag :type="row.success ? 'success' : 'danger'">{{ row.success ? "成功" : "失败" }}</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="exception" label="异常">
							<template #default="{ row }">
								{{ row.exception || "无" }}
							</template>
						</el-table-column>
						<el-table-column prop="timeSpent" label="节点用时(ms)" />
					</el-table>
				</el-form-item>
				<el-form-item label="整体用时">
					<el-input v-model="resultForm.timeSpent" disabled />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="innerVisible = false">关闭</el-button>
			</template>
		</el-dialog>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="changeDialog(false)">关闭</el-button>
				<el-button type="primary" @click="onTest">测试</el-button>
			</div>
		</template>
	</el-dialog>
</template>
<style lang="scss" scoped></style>
