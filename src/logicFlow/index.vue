<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, useTemplateRef, computed, nextTick } from "vue";

import { ElMessage, ElMessageBox } from "element-plus";
import { Document, View, CircleClose, Pointer } from "@element-plus/icons-vue";
import AttributePanel from "./components/attributePanel.vue";
import TestDialog from "./components/testDialog.vue";

import LogicFlow from "@logicflow/core";
import "@logicflow/core/lib/style/index.css";
import { Menu, MiniMap } from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";
// logicflow 拓展属性
import { pluginsOptions } from "./extension";
import registerNode from "./nodes";

// import usePost from "@/hooks/usePost";
import { defaultProperties, ComponentType, Properties, ClickType, PanelType } from "./constants";
import { hasEmptyValues } from "./utils";

// 加载插件
LogicFlow.use(Menu);
LogicFlow.use(MiniMap);

// const { runAsync: fetchLists } = usePost("GET", "/les/v1/api/componentRegister/list");
// // 获取EL表达式
// const { runAsync: fetchElStr, loading: btnLoading } = usePost("POST", "/wms/v1/api/chain/getElStr");
// // 保存
// const { runAsync: fetchSaveChain, loading } = usePost("POST", "/wms/v1/api/chain/saveChain");
// // 获取流程详情
// const { runAsync: fetchFlowChain, loading: pageLoading } = usePost("POST", "/wms/v1/api/chain/getFlowChain");
// // 全局配置数据
// const { runAsync: fetchDtail } = usePost("POST", "/v1/metadata/business/detail");

// 容器
const container = ref<HTMLElement | null>(null);
// 逻辑画布实例
let lf: LogicFlow;

const globalFormData = ref<any>({});
const flowData = ref<any>({});
// 属性面板数据传参
const attributeProps = ref<Partial<Properties>>({});
// 线段数据传参
const edgeProps = reactive<any>({});
// 属性面板ref
const attributePanelRef = useTemplateRef("attributePanelRef");
// 点击类型
const clickType = ref<ClickType>("node");

const testDialog = ref(false);
// 基础组件
const Basic = [
	{ name: "普通组件", type: "COMMON", properties: { ...defaultProperties, cmpType: "common" } },
	{ name: "选择组件", type: "SWITCH", properties: { ...defaultProperties, cmpType: "switch" } },
	{ name: "布尔组件", type: "IF", properties: { ...defaultProperties, cmpType: "boolean" } },
];

const dragForm = reactive({
	Basic: {
		title: "基础组件",
		type: "Basic",
		list: Basic,
	},
	Business: {
		title: "业务组件",
		type: "Business",
		list: [],
	},
});

onMounted(() => {
	nextTick(async () => {
		if (container.value) {
			// 初始化实例
			lf = new LogicFlow({
				container: container.value,
				grid: true,
				plugins: [MiniMap],
				pluginsOptions,
				// 其他配置
			});
			try {
				await getFlowChain();
			} catch (error) {
				console.log(error);
			}
			registerNode(lf);
			lf.render(flowData.value);
			// 定义导出数据转换函数
			lf.adapterOut = (data) => {
				const { nodes, edges } = data;
				return {
					nodes: nodes.map((node) => {
						const { properties, text } = node;
						return {
							...properties,
							...text,
						};
					}),
					edges: edges.map((edge) => {
						const { properties, sourceNodeId, targetNodeId } = edge;
						return {
							properties,
							sourceNodeId,
							targetNodeId,
						};
					}),
				};
			};
			//节点点击事件
			lf.on("node:click", ({ data }: any) => {
				const clickNodeData = { ...defaultProperties };
				Object.keys(clickNodeData).forEach((key) => {
					clickNodeData[key] = data.properties[key];
				});
				clickNodeData.id = data.id;
				clickNodeData.type = data.type;
				clickNodeData.text = data.text.value;

				Object.assign(attributeProps.value, clickNodeData);

				changeTabs("componentsSet", "node");
			});
			lf.on("blank:click", (e) => {
				changeTabs("globalSet");
			});

			//线点击事件
			lf.on("edge:click", ({ data }) => {
				Object.assign(edgeProps, data);
				if (!edgeProps.text) {
					edgeProps.text = { value: "" };
				}
				changeTabs("componentsSet", "edge");
			});

			lfDelete(lf);
		}
	});
});
const lfDelete = (lf) => {
	lf.on("node:delete", (data) => {
		attributeProps.value = {};
	});
};
const changeTabs = (val: PanelType, type?: ClickType) => {
	if (attributePanelRef.value) {
		attributePanelRef.value.activeName = val;
	}
	if (type) {
		clickType.value = type;
	}
};
//  拖拽动作
const startDrag = (item) => {
	lf.dnd.startDrag({
		type: item.type,
		text: `${item.name}节点`,
		properties: {
			...item.properties,
		},
	});
};

const previewEl = async () => {
	const flowData = lf.getGraphRawData();

	if (!flowData.nodes.length) {
		ElMessage.warning("请添加节点");
		return;
	}
	const { ok, data } = await fetchElStr({ chainFlow: JSON.stringify(flowData) });

	if (ok) {
		ElMessage.success(data);
	}
};

const onTest = () => {
	const currentData = JSON.stringify(lf.getGraphRawData());
	const initData = JSON.stringify(flowData.value);
	if (currentData !== initData) {
		ElMessageBox.confirm("逻辑流模型改变了，是否保存并测试？", "提示", {
			confirmButtonText: "确认",
			cancelButtonText: "取消",
			type: "warning",
		})
			.then(async () => {
				await onSave(false);
				testDialog.value = true;
			})
			.catch(() => {
				console.error("取消");
			});
	} else {
		testDialog.value = true;
	}
};
const onSave = async (isBack: boolean = true) => {
	// 原始数据格式
	const data = lf.getGraphRawData();
	// 校验的数据格式
	const verifyData: any = lf.getGraphData();
	const flag = hasEmptyValues(verifyData.nodes);
	if (!flag) return;

	const { ok } = await fetchSaveChain({ chainFlow: JSON.stringify(data), id: 1 });
	if (ok) {
		ElMessage.success("保存成功!");
		isBack && onBack();
	}
};
//  节点注册,获取业务组件
const initComponets = async () => {
	const { ok, data } = await fetchLists();
	if (ok) {
		const BusinessLists = data.map((item: Properties) => {
			const properties = { ...defaultProperties };
			Object.keys(properties).forEach((key) => {
				properties[key] = item[key];
			});
			properties.isDisable = true;
			return {
				name: item.cmpNm || "组件名称",
				type: ComponentType[item.cmpType] || "COMMON",
				properties: properties,
			};
		});
		dragForm.Business.list = BusinessLists;
	}
};

// 获取流程数据
const getFlowChain = async () => {
	const { ok, data } = await fetchFlowChain({ id: id.value });
	if (ok) {
		try {
			flowData.value = JSON.parse(data.chainFlow || "{}");
		} catch (error) {
			console.error(error);
		}
	}
};
const getDtail = async () => {
	const { data, ok } = await fetchDtail({
		id: id.value,
		dataSource: "POSTGRESQL",
		tableName: "tbl_om_gen_liteflow_chain",
		dataBase: "momDb",
		schema: "momSchema",
	});
	if (ok) {
		globalFormData.value = data || {};
	}
};
// 获取全局组件数据
getDtail();
initComponets();
const onBack = () => {};
onUnmounted(() => {
	// 销毁lf
	lf.destroy();
});
</script>

<template>
	<div class="flowHome" v-loading="false">
		<div class="control">
			<el-button type="primary" :icon="CircleClose" @click="onBack">返回</el-button>
			<el-button type="primary" :icon="Document" @click="onSave">保存</el-button>
			<el-button type="primary" :icon="Pointer" @click="onTest">模拟测试</el-button>
			<el-button :icon="View" @click="previewEl" :loading="false">查看逻辑流模型</el-button>
		</div>
		<div class="flowContainer">
			<!-- 拖拽面板 -->
			<div class="dragPanel">
				<div v-for="comp in dragForm" :key="comp.title">
					<div class="title">{{ comp.title }}</div>
					<div class="palette-node">
						<div
							v-for="item in comp.list"
							class="node-item sle"
							:title="item.name"
							:class="{
								'base-node': comp.type === 'Basic',
								'business-node': comp.type === 'Business',
								[item.properties.cmpType + '-node']: true,
							}"
							@mousedown="startDrag(item)"
						>
							{{ item.name }}
						</div>
					</div>
				</div>
			</div>
			<!-- 画布 -->
			<div id="container" ref="container" class="container w-80vw h-80vh"></div>
			<!-- 属性面板 -->
			<AttributePanel
				:attributeProps="attributeProps"
				:lf="lf"
				:clickType="clickType"
				:edgeProps="edgeProps"
				:globalFormData="globalFormData"
				ref="attributePanelRef"
			/>
		</div>
		<TestDialog v-model="testDialog" :lf="lf" :globalFormData="globalFormData" v-if="testDialog" />
	</div>
</template>
<style lang="scss" scoped>
.sle {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.flowHome {
	width: 100%;
	height: calc(100% - 50px);
}
.control {
	height: 50px;
	width: 100%;
	padding: 0 10px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	border-bottom: 1px solid #e8e8e8;
}
.flowContainer {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: calc(100% - 50px);
	background-color: #f2f3f5;
	user-select: none;
}
.dragPanel {
	box-sizing: border-box;
	width: 270px;
	height: 100%;
	padding: 0 4px;
	overflow: auto;
	background-color: #fff;
	.title {
		font-size: 16px;
		font-weight: bold;
		padding-left: 12px;
		margin: 1em 0;
	}
	.palette-node {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		.node-item {
			width: 127px;
			height: 32px;
			border-radius: 5px;
			text-align: center;
			line-height: 25px;
			padding: 2px 10px;
			cursor: move;
		}
	}
}
.container {
	box-sizing: border-box;
	flex: 1;
	height: 100%;
	padding: 8px;
	margin: 10px;
}

.base-node {
	border: 1px solid #ffa940;
	background-color: #fff7e6;
}

.business-node {
	background-color: #e7f7fe;
	border: 1px solid #1890ff;
}
.boolean-node {
	background-color: #fce6e9 !important;
	border: 1px solid #f6606b !important;
}
.switch-node {
	background-color: #e6fff7 !important;
	border: 1px solid #13c2c2 !important;
}
</style>
