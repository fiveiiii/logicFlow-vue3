export enum ComponentType {
	boolean = "IF",
	switch = "SWITCH",
	common = "COMMON",
	script = "COMMON",
	switch_script = "SWITCH",
	boolean_script = "IF",
	group = "GROUP"
}
export type ClickType = "node" | "edge";

export type PanelType = "componentsSet" | "globalSet";
export interface Properties {
	[key: string]: any;
	cmpNm: string;
	cmpCd: string;
	cmpType: keyof typeof ComponentType | string;
	cmpModel: string;
	languageType: string;
	remark: string;
	inParamList: any[];
	outParamList: any[];
	isDisable: boolean;
	basic: boolean; // 	基础组件
	extendType: string; // 分组拓展的类型字段
}

// 语言类型
export const languageType = [
	{ label: "Java类", value: "javabean" },
	{ label: "Java脚本", value: "java" }
];

/**
 *
 * @description 自定义节点属性
 * @param {string} cmpNm 组件名称 / 节点名称
 * @param {string} cmpCd 节点编码
 * @param {string} cmpModel 节点模型 js 对应脚本 / java 对应java类
 * @param {string} cmpType 节点类型 	ComponentType
 * @param {string} languageType  语言类型
 * @param {string} remark 节点描述
 * @param {Array} inParamList 入参
 * @param {Array} outParamList 出参
 */

export const defaultProperties: Properties = {
	cmpNm: "",
	cmpCd: "",
	cmpType: "",
	cmpModel: "",
	languageType: "java",
	remark: "",
	inParamList: [],
	outParamList: [],
	isDisable: false,
	basic: true,
	extendType: "GROUP"
};

// 要校验的字段列表
export const fieldsToCheck: (keyof Properties)[] = ["cmpNm", "cmpCd", "cmpType", "cmpModel", "languageType"];
// group 校验
export const groupFields = ["cmpCd", "cmpNm", "cmpType", "extendType"];

export const MonacoEditorConfig = {
	language: "java",
	height: "370px",
	width: "100%",
	theme: "vs",
	runSwitch: false
};

export const fieldType = [
	{ label: "string", value: "string" },
	{ label: "number", value: "number" },
	{ label: "boolean", value: "boolean" },
	{ label: "object", value: "object" },
	{ label: "array", value: "array" }
];
