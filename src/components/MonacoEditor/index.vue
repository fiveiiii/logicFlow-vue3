<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from "vue";

import { setPrettierAction, setupJavaCodeCompletion } from "./EditorConfig";
import { useMonacoEditor } from "@/hooks";
import * as monaco from "monaco-editor";

const props = defineProps({
	data: {
		type: Object,
		default: () => ({}),
	},
});

const code = defineModel({ default: "" });
console.log("[ props ] >", props);

const theme = computed(() => props.data.config.theme);
const language = computed(() => props.data.config.language);
const width = computed(() => props.data.config.width);
const height = computed(() => props.data.config.height);

const monacoEditorStyle = computed(() => {
	return {
		width: width.value,
		height: height.value,
	};
});

//  补全注册标识
let flagCompletion = false;
let monacoEditor: any = null;
const { monacoEditorRef, createEditor, updateVal, updateOptions, getEditor, updateLanguage } = useMonacoEditor({
	language: language.value,
	theme: theme.value,
});

const setCodeCompletion = () => {
	// java 语言代码补全
	if (language.value === "java") {
		setupJavaCodeCompletion();
		flagCompletion = true;
	}
};
function updateMonacoVal(val: string) {
	if (val !== getEditor()?.getValue()) {
		updateVal(val);
	}
}
watch(
	() => code.value,
	() => {
		updateMonacoVal(code.value);
	},
	{
		immediate: true,
	}
);
watch(
	() => theme.value,
	() => {
		monaco.editor.setTheme(theme.value);
	}
);
watch(
	() => language.value,
	(newVal) => {
		updateLanguage(newVal);

		if (newVal === "java") {
			setJavaOption();
		}
	}
);

const setJavaOption = () => {
	nextTick(() => {
		setPrettierAction(monacoEditor, language.value, updateMonacoVal);
		setCodeCompletion();
	});
};

onMounted(() => {
	if (monacoEditorRef.value) {
		monacoEditor = createEditor(props.data.editorOption || {});
		monacoEditor?.onDidChangeModelContent(() => {
			code.value = monacoEditor!.getValue();
		});
		if (language.value === "java") {
			setJavaOption();
		}
	}
});
</script>

<template>
	<div class="flex flex-1 flex-col monaco-editor">
		<div ref="monacoEditorRef" :style="monacoEditorStyle"></div>
	</div>
</template>
<style lang="scss" scoped></style>
