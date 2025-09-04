import LogicFlow, { RectNode, RectNodeModel } from "@logicflow/core";

class CustomRectNode extends RectNode {}

class CustomRectModel extends RectNodeModel {
	// 设置矩形的形状属性：大小和圆角
	setAttributes() {
		this.properties.name = this.properties.name || "id";
		this.width = 100;
		this.height = 50;
		this.radius = 10;
	}

	// 设置矩形的样式属性：边框颜色
	getNodeStyle() {
		const style = super.getNodeStyle();
		style.stroke = "#1890ff";
		style.fill = "#e7f7fe";
		return style;
	}
	// 设置文本的样式属性：自动换行
	getTextStyle() {
		const style = super.getTextStyle();
		style.overflowMode = "autoWrap";
		return style;
	}
}

export default {
	type: "COMMON",
	view: CustomRectNode,
	model: CustomRectModel
};
