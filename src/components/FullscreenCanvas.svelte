<script lang="ts">
	import { onMount } from 'svelte'

	export let example: string
	let functions = {
		setupWebGL: null,
		setupWhatToDraw: null,
		setupHowToDraw: null,
		draw: null,
		changeAspectRatio: null
	}

	async function resize() {
		let canvas: HTMLCanvasElement = document.querySelector(`#${example.replaceAll('/', '_')}`)
		let width = canvas.parentElement?.parentElement?.clientWidth ?? 500
		let height = canvas.parentElement?.parentElement?.clientHeight ?? 500
		canvas.width = width
		canvas.height = height

		await functions.changeAspectRatio?.(width, height)
	}

	onMount(async () => {
		let canvas: HTMLCanvasElement = document.querySelector(`#${example.replaceAll('/', '_')}`)

		document.body.onresize = resize

		functions = (await import(`../examples/${example}.ts`)) as any

		await functions.setupWebGL(canvas)
		await functions.setupWhatToDraw()
		resize()
		await functions.setupHowToDraw()
		functions.draw()

		// var img = canvas.toDataURL('image/png')
		// document.write('<img src="' + img + '"/>')
	})
</script>

<style>
	div.container {
		position: relative;
		width: fit-content;
	}

	canvas {
		display: block;
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
	<div class="container h-screen w-screen">
		<canvas id="{example.replaceAll('/', '_')}" width="500" height="500"></canvas>
		<a
			href="{`https://github.com/LorenzoLeonardini/computer-graphics/blob/main/src/examples/${example}.ts`}"
			target="_blank"
			rel="noreferrer noopener"><button class="bg-gray-800">&lt;/&gt;</button></a>
	</div>
</div>
