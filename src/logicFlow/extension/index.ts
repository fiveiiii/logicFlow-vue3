import { MiniMap } from "@logicflow/extension";

// 可通过css类名修改小地图样式
export const miniMapOption: MiniMap.MiniMapOption = {
	width: 200,
	height: 150,
	isShowCloseIcon: true,
	rightPosition: 0,
	topPosition: 0,
	showEdge: true
};

export const pluginsOptions = {
	miniMap: miniMapOption
};
