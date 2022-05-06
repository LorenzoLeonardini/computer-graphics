<script lang="ts">
	import { onMount } from 'svelte'
	import { Shader } from '../examples/lib/Shader'
	import { Texture } from '../examples/lib/Texture'

	export let example: string

	onMount(async () => {
		let canvas: HTMLCanvasElement = document.querySelector(
			`#${example.replaceAll('/', '_')}_stretched`
		)
		let width = canvas.parentElement?.parentElement?.clientWidth ?? 500
		if (width > 500) width = 500
		canvas.width = width / 10
		canvas.height = width / 10
		canvas.style.width = `${width}px`
		canvas.style.height = `${width}px`

		const { setupWebGL, setupWhatToDraw, changeAspectRatio, setupHowToDraw, draw } = (await import(
			`../examples/${example}.ts`
		)) as any

		await setupWebGL(canvas)
		await setupWhatToDraw()
		await changeAspectRatio(width / 10, width / 10)
		await setupHowToDraw()
		await Promise.all([Texture.loadAll(), Shader.loadAll()])
		draw()
	})
</script>

<style>
	div.container {
		position: relative;
		margin: 40px auto;
		width: fit-content;
	}

	canvas {
		display: block;
		border: solid 1px black;
		border-radius: 4px;
		overflow: hidden;
	}

	button {
		position: absolute;
		width: 34px;
		height: 34px;
		line-height: 17px;
		text-align: center;
		border-radius: 3px;
		left: 10px;
		top: 10px;
		font-weight: bold;
		opacity: 0.8;
		transition: opacity 100ms ease;
		color: white !important;
	}

	button:hover {
		opacity: 1;
	}
</style>

<div>
	<div class="container">
		<canvas id="{example.replaceAll('/', '_')}_stretched" width="500" height="500"></canvas>
		<a
			href="{`https://github.com/LorenzoLeonardini/computer-graphics/blob/main/src/examples/${example}.ts`}"
			target="_blank"
			rel="noreferrer noopener"><button class="bg-gray-800">&lt;/&gt;</button></a>
	</div>
</div>
