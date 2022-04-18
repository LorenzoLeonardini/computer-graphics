// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// @type-check enabled!
// VSCode and other TypeScript-enabled text editors will provide auto-completion,
// helpful tooltips, and warnings if your exported object is invalid.
// You can disable this by removing "@ts-check" and `@type` comments below.

import svelte from '@astrojs/svelte'

// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
	site: 'https://graphics.leonardini.dev',
	// Comment out "renderers: []" to enable Astro's default component support.
	integrations: [
		svelte()
	],
	markdown: {
		render: [
			'@astrojs/markdown-remark',
			{
				shikiConfig: {
					langs: ['ts'],
					wrap: false,
				},
				remarkPlugins: [
					'remark-gfm',
					'remark-math'
				],
				rehypePlugins: [
					'rehype-slug',
					'rehype-katex'
				]
			},
		],
	},
});
