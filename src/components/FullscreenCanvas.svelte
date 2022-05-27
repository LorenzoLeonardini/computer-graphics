<script lang="ts">
	import { onMount } from 'svelte'
	import { Shader } from '../examples/lib/Shader'
	import { Texture } from '../examples/lib/Texture'

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
		canvas.parentElement.classList.add('loading')

		document.body.onresize = resize

		functions = (await import(`../examples/project/${example}.ts`)) as any

		await functions.setupWebGL(canvas)
		await functions.setupWhatToDraw()
		resize()
		await functions.setupHowToDraw()
		await Promise.all([Texture.loadAll(), Shader.loadAll()])
		canvas.parentElement.classList.remove('loading')
		functions.draw()

		// var img = canvas.toDataURL('image/png')
		// document.write('<img src="' + img + '"/>')
	})
</script>

<style>
	div.container {
		width: 100vw !important;
		height: 100vh !important;
	}

	@keyframes rotating {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	:global(div.container.loading::after) {
		content: '';
		position: absolute;
		box-sizing: border-box;
		top: calc(50% - 50px);
		left: calc(50% - 50px);
		width: 100px;
		height: 100px;
		border-width: 10px;
		border-style: solid;
		border-color: #d0d0ff;
		border-radius: 100%;
		border-top-color: transparent;
		animation: rotating 1s linear infinite;
	}

	:global(div.container.loading::before) {
		content: 'Loading assets...';
		position: absolute;
		color: #d0d0ff;
		font-weight: 600;

		top: calc(50% + 70px);
		left: 50%;
		transform: translateX(-50%);
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
	<div class="container">
		<canvas id="{example.replaceAll('/', '_')}" width="500" height="500"></canvas>
		<a
			href="{`https://github.com/LorenzoLeonardini/computer-graphics/blob/main/src/examples/project/${example}.ts`}"
			target="_blank"
			rel="noreferrer noopener"><button class="bg-gray-800">&lt;/&gt;</button></a>
	</div>
</div>
