import { DynamicGroup, dynamicGroup } from "@logicflow/extension";

// 自定义分组
class CustomGroup extends dynamicGroup.view {}

class CustomGroupModel extends dynamicGroup.model {
	initNodeData(data) {
		super.initNodeData(data);

		// 设置默认样式
		this.properties = {
			...this.properties,
			transformWithContainer: true,
			collapsible: true,
			autoToFront: true
		};
	}

	// 自定义分组样式
	getNodeStyle() {
		const style = super.getNodeStyle();
		style.stroke = "#1890ff";
		style.strokeWidth = 5;
		style.fill = "#1890ff1a";

		return style;
	}

	// 自定义拖入高亮样式
	getAddableOutlineStyle() {
		const style = super.getAddableOutlineStyle();
		style.stroke = "#52c41a";
		style.strokeDasharray = "4 4";
		style.strokeWidth = 2;
		return style;
	}
}
export default {
	type: "GROUP",
	view: CustomGroup,
	model: CustomGroupModel
};
