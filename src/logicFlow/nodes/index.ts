import { LogicFlow } from "@logicflow/core";

// 动态导入 nodes 文件夹下所有 .ts 文件（排除 index.ts）
const nodeModules = import.meta.glob("./**/!(index).ts", { eager: true });

// 存储所有节点的数组
const nodes: any[] = [];

// 遍历所有导入的模块，提取节点类
for (const path in nodeModules) {
	const module: any = nodeModules[path];
	// 假设每个文件默认导出一个节点类（如 `export default CommonNode`）
	if (module.default) {
		nodes.push(module.default);
	}
}
export const registerNode = (lf: LogicFlow) => {
	nodes.forEach(node => {
		lf.register(node);
	});
};
export default registerNode;
