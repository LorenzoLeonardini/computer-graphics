// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// @type-check enabled!
// VSCode and other TypeScript-enabled text editors will provide auto-completion,
// helpful tooltips, and warnings if your exported object is invalid.
// You can disable this by removing "@ts-check" and `@type` comments below.

// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
	// Comment out "renderers: []" to enable Astro's default component support.
	renderers: ['@astrojs/renderer-svelte'],
	markdownOptions: {
		render: [
			'@astrojs/markdown-remark',
			{
				// Pick a syntax highlighter. Can be 'prism' (default), 'shiki' or false to disable any highlighting.
				syntaxHighlight: 'shiki',
				// If you are using shiki, here you can define a global theme and
				// add custom languages.
				shikiConfig: {
					theme: 'github-dark',
					langs: ['ts'],
					wrap: false,
				},
			},
		],
	},
});
