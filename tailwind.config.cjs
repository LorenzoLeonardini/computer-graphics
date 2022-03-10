module.exports = {
	content: [
		'./public/**/*.html',
		'./src/**/*.{astro,js,jsx,svelte,ts,tsx,vue,md}',
	],
	plugins: [
		require('@tailwindcss/typography'),
		require('tailwind-scrollbar'),
	]
	// more options here
};