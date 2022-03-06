module.exports = {
	content: [
		'./public/**/*.html',
		'./src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}',
	],
	plugins: [
		require('@tailwindcss/typography'),
	]
	// more options here
};