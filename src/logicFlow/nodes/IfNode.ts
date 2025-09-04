import LogicFlow, { DiamondNode, DiamondNodeModel } from "@logicflow/core";

class CustomDiamondNode extends DiamondNode {}

class CustomDiamondModel extends DiamondNodeModel {
	// 设置矩形的形状属性：大小和圆角
	setAttributes() {
		this.rx = 50;
		this.ry = 40;
	}

	// 设置矩形的样式属性：边框颜色
	getNodeStyle() {
		const style = super.getNodeStyle();
		style.stroke = "#f6606b";
		style.fill = "#fce6e9";

		return style;
	}
	getTextStyle() {
		const style = super.getTextStyle();
		style.overflowMode = "autoWrap";
		return style;
	}
}

export default {
	type: "IF",
	view: CustomDiamondNode,
	model: CustomDiamondModel
};
