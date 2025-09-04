import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";
import parseCss from "prettier/parser-postcss";
import parserBabel from "prettier/parser-babel";
import java from "prettier-plugin-java";

export const prettierConfig: any = {
	semi: false,
	singleQuote: true,
	printWidth: 120,
	trailingComma: "none",
	endOfLine: "auto",
	tabWidth: 2
};

const formatJavaScript = string =>
	prettier.format(string, {
		parser: "javascript",
		plugins: [parserBabel],
		trailingComma: "es5",
		...prettierConfig
	});
const formatJson = string =>
	prettier.format(string, {
		parser: "json",
		plugins: [parserBabel],
		trailingComma: "es5",
		...prettierConfig
	});

const formatHtml = string =>
	prettier.format(string, {
		parser: "html",
		plugins: [parserBabel, parserHtml],
		...prettierConfig
	});

const formatCss = string =>
	prettier.format(string, {
		parser: "css",
		plugins: [parseCss],
		...prettierConfig
	});

/**
 * @description 格式化代码工具
 * @created 2025/07/21 09:22:42
 * @param code 编辑器内容数据
 */

const formatCode = async (code: any) => {
	const formattedCode = await prettier.format(code, {
		parser: "java",
		plugins: [java]
	});

	return formattedCode;
};
const formatterMap = {
	json: formatJson,
	typescript: formatJavaScript,
	javascript: formatJavaScript,
	html: formatHtml,
	css: formatCss,
	java: formatCode
};

/**
 *
 * @description 自定义java语言代码补全
 * @created 2025/07/21 09:25:50
 */

export function setupJavaCodeCompletion() {
	monaco.languages.registerCompletionItemProvider("java", {
		triggerCharacters: [".", "("],
		provideCompletionItems: async (model, position) => {
			const word = model.getWordUntilPosition(position);
			const code = model.getValue();
			const range = {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: word.startColumn,
				endColumn: word.endColumn
			};

			return { suggestions: getDefaultSuggestions(range) };
		}
	});
}

// 辅助函数：生成默认补全建议
function getDefaultSuggestions(range) {
	const keywords = [
		"public",
		"private",
		"protected",
		"static",
		"void",
		"int",
		"String",
		"boolean",
		"char",
		"double",
		"float",
		"if",
		"else",
		"for",
		"while",
		"return",
		"class",
		"interface",
		"extends"
	];

	const commonClasses = ["ArrayList", "HashMap", "System", "String", "Integer", "Boolean", "List", "Map", "Set", "Collections"];
	const JavaSinppet1 = `
			import cn.hutool.core.date.DateUtil;
			import com.yomahub.liteflow.core.NodeComponent;

			public class Node extends NodeComponent {

				@Override
				public void process() throws Exception {
					System.out.println(DateUtil.now());
				}
			}
			`;
	const snippets = [
		{
			label: "import",
			kind: monaco.languages.CompletionItemKind.Method,
			insertText: JavaSinppet1,
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			documentation: "import cn.hutool.core.date.DateUtil"
		},
		{
			label: "System.out.println",
			kind: monaco.languages.CompletionItemKind.Method,
			insertText: "System.out.println(${1:text});",
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			documentation: "Prints a string to the console"
		},
		{
			label: "public static void main",
			kind: monaco.languages.CompletionItemKind.Function,
			insertText: "public static void main(String[] args) {\n\t${1:statement};\n}",
			insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			documentation: "Main method entry point"
		},
		{
			label: "if-else",
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: ["if (${1:condition}) {", "\t${2:statement}", "} else {", "\t${3:statement}", "}"].join("\n"),
			documentation: "Conditional statement"
		},
		{
			label: "for-i",
			kind: monaco.languages.CompletionItemKind.Snippet,
			insertText: ["for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {", "\t${3:statement}", "}"].join("\n"),
			documentation: "For loop with index"
		}
	];

	return [
		...keywords.map(keyword => ({
			label: keyword,
			kind: monaco.languages.CompletionItemKind.Keyword,
			insertText: keyword,
			range
		})),
		...commonClasses.map(cls => ({
			label: cls,
			kind: monaco.languages.CompletionItemKind.Class,
			insertText: cls,
			range
		})),
		...snippets.map(snippet => ({ ...snippet, range }))
	];
}

export const formatString = (str, language) => {
	const formatter = formatterMap[language] || formatJson;
	let result = str;
	try {
		result = formatter(str);
	} catch (error) {
		const printer = console;
		printer.log(error);
	}

	return result;
};
/**
 *
 * @description 添加格式化prettier动作
 * @param editorRef 编辑器实例
 * @param cb 回调函数
 */

export function setPrettierAction(editorRef, language, cb) {
	editorRef?.addAction({
		id: "prettier",
		label: "Prettier",
		precondition: null,
		contextMenuGroupId: "navigation",
		async run(editor: { getValue: () => any; setValue: (arg0: any) => void }) {
			const currentValue = editor.getValue();
			const newValue = await formatString(currentValue, language);

			if (newValue !== currentValue) {
				cb(newValue);
			}
		}
	});
}
