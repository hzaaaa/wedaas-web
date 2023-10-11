// .stylelintrc.js
module.exports = {
	extends: ["stylelint-config-standard", "stylelint-config-standard-scss"],
	plugins: ["stylelint-order"],
	overrides: [
		// 不同格式的文件指定自定义语法（顺序不可变）。主要为了检查 html 中的 css，如果postcss-html写在extends 中会报错
		// Unknown word (CssSyntaxError)，这个问题主要是因为 stylelint 升级到 14 大版本造成的。
		{
			files: ["**/*.{html,vue}"],
			customSyntax: "postcss-html",
		},
		{
			files: ["**/*.{css,scss,sass}"],
			customSyntax: "postcss-scss",
		},
	],
	rules: {
		"no-descending-specificity": null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
		"function-url-quotes": "always", // 要求或禁止 URL 的引号 "always(必须加上引号)"|"never(没有引号)"
		// "string-quotes": "double", // 指定字符串使用单引号或双引号
		"unit-case": null, // 指定单位的大小写 "lower(全小写)"|"upper(全大写)"
		"color-hex-case": "lower", // 指定 16 进制颜色的大小写 "lower(全小写)"|"upper(全大写)"
		// "color-hex-length": "long", // 指定 16 进制颜色的简写或扩写 "short(16进制简写)"|"long(16进制扩写)"
		"rule-empty-line-before": "never", // 要求或禁止在规则之前的空行 "always(规则之前必须始终有一个空行)"|"never(规则前绝不能有空行)"|"always-multi-line(多行规则之前必须始终有一个空行)"|"never-multi-line(多行规则之前绝不能有空行。)"
		"font-family-no-missing-generic-family-keyword": null, // 禁止在字体族名称列表中缺少通用字体族关键字
		// "block-opening-brace-space-before": "always", // 要求在块的开大括号之前必须有一个空格或不能有空白符 "always(大括号前必须始终有一个空格)"|"never(左大括号之前绝不能有空格)"|"always-single-line(在单行块中的左大括号之前必须始终有一个空格)"|"never-single-line(在单行块中的左大括号之前绝不能有空格)"|"always-multi-line(在多行块中，左大括号之前必须始终有一个空格)"|"never-multi-line(多行块中的左大括号之前绝不能有空格)"
		"property-no-unknown": null, // 禁止未知的属性(true 为不允许)
		"no-empty-source": null, // 禁止空源码
		"declaration-block-trailing-semicolon": null, // 要求或不允许在声明块中使用尾随分号 string："always(必须始终有一个尾随分号)"|"never(不得有尾随分号)"
		"selector-class-pattern": null, // 强制选择器类名的格式
		// "scss/at-import-partial-extension": null, // 解决不能引入scss文件
		"value-no-vendor-prefix": null, // 关闭 vendor-prefix(为了解决多行省略 -webkit-box)
		"import-notation": "string",
		"selector-pseudo-class-no-unknown": [
			true,
			{
				ignorePseudoClasses: ["global", "v-deep", "deep"],
			},
		],
		"function-no-unknown": [
			true,
			{
				ignoreFunctions: ["v-bind"],
			},
		],
		"value-keyword-case": null,
		"media-feature-name-no-vendor-prefix": null,
		"media-feature-name-no-unknown": [
			true,
			{
				ignoreMediaFeatureNames: ["/^max--moz-/"],
			},
		],
		"order/properties-order": [
			// 布局属性
			"display",
			"visibility",
			"overflow",
			"overflow-x",
			"overflow-y",
			"overscroll-behavior",
			"scroll-behavior",
			"scroll-snap-type",
			"scroll-snap-align",
			// 布局属性：浮动
			"float",
			"clear",
			// 布局属性：定位
			"position",
			"left",
			"right",
			"top",
			"bottom",
			"z-index",
			// 布局属性：列表
			"list-style",
			"list-style-type",
			"list-style-position",
			"list-style-image",
			// 布局属性：表格
			"table-layout",
			"border-collapse",
			"border-spacing",
			"caption-side",
			"empty-cells",
			// 布局属性：弹性
			"flex-flow",
			"flex-direction",
			"flex-wrap",
			"justify-content",
			"align-content",
			"align-items",
			"align-self",
			"flex",
			"flex-grow",
			"flex-shrink",
			"flex-basis",
			"order",
			// 布局属性：多列
			"columns",
			"column-width",
			"column-count",
			"column-gap",
			"column-rule",
			"column-rule-width",
			"column-rule-style",
			"column-rule-color",
			"column-span",
			"column-fill",
			"column-break-before",
			"column-break-after",
			"column-break-inside",
			// 布局属性：格栅
			"grid-columns",
			"grid-rows",
			// 尺寸属性
			"box-sizing",
			"margin",
			"margin-left",
			"margin-right",
			"margin-top",
			"margin-bottom",
			"padding",
			"padding-left",
			"padding-right",
			"padding-top",
			"padding-bottom",
			"border",
			"border-width",
			"border-style",
			"border-color",
			"border-colors",
			"border-left",
			"border-left-width",
			"border-left-style",
			"border-left-color",
			"border-left-colors",
			"border-right",
			"border-right-width",
			"border-right-style",
			"border-right-color",
			"border-right-colors",
			"border-top",
			"border-top-width",
			"border-top-style",
			"border-top-color",
			"border-top-colors",
			"border-bottom",
			"border-bottom-width",
			"border-bottom-style",
			"border-bottom-color",
			"border-bottom-colors",
			"border-radius",
			"border-top-left-radius",
			"border-top-right-radius",
			"border-bottom-left-radius",
			"border-bottom-right-radius",
			"border-image",
			"border-image-source",
			"border-image-slice",
			"border-image-width",
			"border-image-outset",
			"border-image-repeat",
			"width",
			"min-width",
			"max-width",
			"height",
			"min-height",
			"max-height",
			// 界面属性
			"appearance",
			"outline",
			"outline-width",
			"outline-style",
			"outline-color",
			"outline-offset",
			"outline-radius",
			"outline-radius-topleft",
			"outline-radius-topright",
			"outline-radius-bottomleft",
			"outline-radius-bottomright",
			"background",
			"background-color",
			"background-image",
			"background-repeat",
			"background-repeat-x",
			"background-repeat-y",
			"background-position",
			"background-position-x",
			"background-position-y",
			"background-size",
			"background-origin",
			"background-clip",
			"background-attachment",
			"bakground-composite",
			"mask",
			"mask-mode",
			"mask-image",
			"mask-repeat",
			"mask-repeat-x",
			"mask-repeat-y",
			"mask-position",
			"mask-position-x",
			"mask-position-y",
			"mask-size",
			"mask-origin",
			"mask-clip",
			"mask-attachment",
			"mask-composite",
			"mask-box-image",
			"mask-box-image-source",
			"mask-box-image-width",
			"mask-box-image-outset",
			"mask-box-image-repeat",
			"mask-box-image-slice",
			"box-shadow",
			"box-reflect",
			"filter",
			"mix-blend-mode",
			"opacity",
			"object-fit",
			"clip",
			"clip-path",
			"resize",
			"zoom",
			"cursor",
			"pointer-events",
			"user-modify",
			"user-focus",
			"user-input",
			"user-select",
			"user-drag",
			// 文字属性
			"line-height",
			"line-clamp",
			"vertical-align",
			"direction",
			"unicode-bidi",
			"writing-mode",
			"ime-mode",
			"text-overflow",
			"text-decoration",
			"text-decoration-line",
			"text-decoration-style",
			"text-decoration-color",
			"text-decoration-skip",
			"text-underline-position",
			"text-align",
			"text-align-last",
			"text-justify",
			"text-indent",
			"text-stroke",
			"text-stroke-width",
			"text-stroke-color",
			"text-shadow",
			"text-transform",
			"text-size-adjust",
			"src",
			"font",
			"font-family",
			"font-style",
			"font-stretch",
			"font-weight",
			"font-variant",
			"font-size",
			"font-size-adjust",
			"color",
			// 内容属性
			"tab-size",
			"overflow-wrap",
			"word-wrap",
			"word-break",
			"word-spacing",
			"letter-spacing",
			"white-space",
			"caret-color",
			"quotes",
			"content",
			"content-visibility",
			"counter-reset",
			"counter-increment",
			"page",
			"page-break-before",
			"page-break-after",
			"page-break-inside",
			// 交互属性
			"will-change",
			"perspective",
			"perspective-origin",
			"backface-visibility",
			"transform",
			"transform-origin",
			"transform-style",
			"transition",
			"transition-property",
			"transition-duration",
			"transition-timing-function",
			"transition-delay",
			"animation",
			"animation-name",
			"animation-duration",
			"animation-timing-function",
			"animation-delay",
			"animation-iteration-count",
			"animation-direction",
			"animation-play-state",
			"animation-fill-mode",
			// Webkit专有属性
			"-webkit-overflow-scrolling",
			"-webkit-box-orient",
			"-webkit-line-clamp",
			"-webkit-text-fill-color",
			"-webkit-tap-highlight-color",
			"-webkit-touch-callout",
			"-webkit-font-smoothing",
			"-moz-osx-font-smoothing",
		],
	},
};
