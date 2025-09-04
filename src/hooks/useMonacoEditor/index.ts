import * as monaco from "monaco-editor";
import { ref, nextTick, onBeforeUnmount } from "vue";
export const languageEnums = monaco.languages
	.getLanguages()
	.map(item => {
		return { label: item.id, value: item.id };
	})
	.sort((a, b) => a.label.localeCompare(b.label));
export default function useMonacoEditor({ language = "json", theme = "vs" }) {
	// 编辑器示例
	let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;
	// 目标元素
	const monacoEditorRef = ref<HTMLElement | null>(null);

	// 创建实例
	function createEditor(editorOption: monaco.editor.IStandaloneEditorConstructionOptions = {}) {
		if (!monacoEditorRef.value) return;
		monacoEditor = monaco.editor.create(monacoEditorRef.value, {
			// 初始模型
			model: monaco.editor.createModel("", language),
			// 是否启用预览图
			minimap: { enabled: false },
			// 圆角
			roundedSelection: true,
			// 主题
			theme: theme,
			// 主键
			multiCursorModifier: "ctrlCmd",
			// 滚动条
			scrollbar: {
				verticalScrollbarSize: 8,
				horizontalScrollbarSize: 8
			},
			// 行号
			lineNumbers: "on",
			// tab大小
			tabSize: 2,
			//字体大小
			fontSize: 14,
			// 控制编辑器在用户键入、粘贴、移动或缩进行时是否应自动调整缩进
			autoIndent: "advanced",
			// 自动布局
			automaticLayout: true,
			...editorOption
		});
		return monacoEditor;
	}

	// 格式化
	async function formatDoc() {
		await monacoEditor?.getAction("editor.action.formatDocument")?.run();
	}

	// 数据更新
	function updateVal(val: string) {
		nextTick(() => {
			if (getOption(monaco.editor.EditorOption.readOnly)) {
				updateOptions({ readOnly: false });
			}
			monacoEditor?.setValue(val);
			setTimeout(async () => {
				await formatDoc();
			}, 10);
		});
	}

	// 配置更新
	function updateOptions(opt: monaco.editor.IStandaloneEditorConstructionOptions) {
		monacoEditor?.updateOptions(opt);
	}
	// 修改语言
	function updateLanguage(language: string) {
		const model = monacoEditor?.getModel();
		if (model) {
			monaco.editor.setModelLanguage(model, language);
		}
	}
	// 获取配置
	function getOption(name: monaco.editor.EditorOption) {
		return monacoEditor?.getOption(name);
	}

	// 获取实例
	function getEditor() {
		return monacoEditor;
	}

	// 页面离开 销毁
	onBeforeUnmount(() => {
		if (monacoEditor) {
			monacoEditor.dispose();
		}
	});

	return {
		monacoEditorRef,
		createEditor,
		getEditor,
		updateVal,
		updateOptions,
		updateLanguage,
		getOption,
		formatDoc
	};
}
