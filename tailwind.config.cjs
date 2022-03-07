module.exports = {
	content: [
		'./public/**/*.html',
		'./src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}',
	],
	plugins: [
		require('@tailwindcss/typography'),
		require('tailwind-scrollbar'),
	]
	// more options here
};