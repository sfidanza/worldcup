/** @type {import('stylelint').Config} */
export default {
    extends: ["stylelint-config-standard"],
	rules: {
		"comment-whitespace-inside": null,
		"color-hex-length": null,
		"rule-empty-line-before": null,
		"media-feature-range-notation": "prefix",
		"length-zero-no-unit": null,
		"selector-class-pattern": null,
		"no-descending-specificity": null,
		"function-url-quotes": "never",
		"no-duplicate-selectors": null,
		"comment-empty-line-before": null,
		"selector-id-pattern": null,
		"custom-property-empty-line-before": ["always", { "except": ["after-comment", "after-custom-property", "first-nested"] }]
	}
};