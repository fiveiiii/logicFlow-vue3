import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetTypography,
	presetWind3,
	presetWebFonts,
	transformerDirectives,
	transformerVariantGroup
} from "unocss";

export default defineConfig({
	shortcuts: [],
	presets: [
		presetWind3(), // 默认wind预设
		presetAttributify(), // class拆分属性预设
		presetTypography(), // 排版预设
		presetIcons({
			// 图标库预设
			scale: 1.2,
			warn: true
		}),
		presetWebFonts({
			// 网络字体预设
			fonts: {}
		})
	],
	transformers: [
		transformerVariantGroup(), // windi CSS的变体组功能
		transformerDirectives() //  @apply @screen theme()转换器
	]
});
