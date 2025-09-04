import { fieldsToCheck, type Properties, groupFields } from "../constants";
import { ElMessage } from "element-plus";
export function randomHex10() {
	return Array.from({ length: 10 }, () => {
		return ((Math.random() * 16) | 0).toString(16);
	}).join("");
}

/**
 * 校验组件数组中是否存在空值（仅针对 isDisable=false 的组件）
 * @param components 组件数组
 * @returns boolean：true 表示没有空值；false 表示至少有一个空值
 */
export function hasEmptyValues(components: Properties[]): boolean {
	for (const comp of components) {
		const fields = comp.cmpType === "group" ? groupFields : fieldsToCheck;
		const isDisabled = comp.isDisable === true;
		if (isDisabled) {
			// 如果 isDisable=true，跳过校验
			continue;
		}

		// 只校验 isDisable=false 的组件
		for (const field of fields) {
			const value = comp[field];
			// 判断是否为空：空字符串、null、undefined
			if (!value) {
				ElMessage.warning(`⚠️【${comp.value}】 组件存在空值：字段【${String(field)}】为空。`);
				return false; // 发现空值，直接返回 false
			}
		}
	}

	// 所有 isDisable=false 的组件都通过了校验
	return true;
}
