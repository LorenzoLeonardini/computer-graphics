<script lang="ts">
	import { onMount } from 'svelte'

	export let example: string

	onMount(async () => {
		let canvas: HTMLCanvasElement = document.querySelector(`#${example}`)
		let width = canvas.parentElement?.parentElement?.clientWidth ?? 500
		if (width > 500) width = 500
		canvas.width = width
		canvas.height = width

		const { setupWebGL, setupWhatToDraw, changeAspectRatio, setupHowToDraw, draw } = (await import(
			`../examples/${example}.ts`
		)) as any

		await setupWebGL(canvas)
		await setupWhatToDraw()
		await changeAspectRatio(width, width)
		await setupHowToDraw()
		draw()

		// var img = canvas.toDataURL('image/png')
		// document.write('<img src="' + img + '"/>')
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
		<canvas id="{example}" width="500" height="500"></canvas>
		<a
			href="{`https://github.com/LorenzoLeonardini/computer-graphics/blob/main/src/examples/${example}.ts`}"
			target="_blank"
			rel="noreferrer noopener"><button class="bg-gray-800">&lt;/&gt;</button></a>
	</div>
</div>
