import { MiniMap, type SelectionConfig } from "@logicflow/extension";

// 可通过css类名修改小地图样式
export const miniMapOption: MiniMap.MiniMapOption = {
	width: 200,
	height: 150,
	isShowCloseIcon: true,
	rightPosition: 0,
	topPosition: 0,
	showEdge: true,
};

export const selectionSelectOption: SelectionConfig = {
	exclusiveMode: false,
};
export const pluginsOptions = {
	miniMap: miniMapOption,
	selectionSelect: selectionSelectOption,
};

// 初始化画布配置
export const config = {
	// 允许调整组件大小
	allowResize: true,
	// style: {
	// 	anchor: { stroke: "red", fill: "#FFFFFF" } // 锚点样式
	// }
};

// 添加控制面板自定义功能
export const controlAddItem = (lf) => {
	lf.extension.control.addItem({
		key: "SelectionSelect",
		text: "单次框选",
		iconClass: "custom-select",
		title: "框选",
		onClick: (lf, ev) => {
			lf.extension.selectionSelect.openSelectionSelect();
			lf.once("selection:selected", () => {
				lf.extension.selectionSelect.closeSelectionSelect();
			});
		},
	});
};

export const setlFTheme = (lf) => {
	lf.setTheme({
		anchor: {
			stroke: "#187dffff",
			fill: "#FFFFFF",
			r: 5,
			hover: {
				fill: "#ff7f0e",
				fillOpacity: 0.5,
				stroke: "#949494",
				r: 10,
			},
		},
	});
};
