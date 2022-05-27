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

		if(getCookie('hideTutorial')) {
			showingTutorial = false
		}

		await functions.setupWebGL(canvas)
		await functions.setupWhatToDraw()
		resize()
		await functions.setupHowToDraw()
		await Promise.all([Texture.loadAll(), Shader.loadAll()])
		canvas.parentElement.classList.remove('loading')

		onTutorialClose = () => {
			functions.draw()
		}

		if(getCookie('hideTutorial')) {
			onTutorialClose()
		}
	})

	let showingTutorial :boolean = true
	let onTutorialClose :() => void

	function getCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function closeTutorial(setCookie :boolean) {
		showingTutorial = false
		if(setCookie) {
			document.cookie = "hideTutorial=true; expires=" + new Date(new Date().getTime() + (365*24*60*60*1000)).toUTCString() + "; path=/";
		}
		onTutorialClose()
	}
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

	button.code {
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

	.tutorial {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 12px;
		color: #d0d0ff;
		border: solid 1px #d0d0ff7a;
		padding: 1.5rem;
		background: rgb(17, 24, 39);
		font-size: 1.1em;
	}

	.tutorial h2 {
		text-align: center;
		font-size: 1.5em;
		font-weight: bold;
		margin-bottom: 1.3em;
	}

	.tutorial .key {
		font-family: monospace;
		border: solid 1px #d0d0ff;
		background: rgb(31 41 55);
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 28px;
		height: 28px;
		margin: 2px;
	}

	.tutorial > table {
		width:600px;
		margin: 0 30px;
	}

	.tutorial > table > tr > td {
		width: 50%;
		border: 0px solid transparent;
		border-right-width: 50px;
	}

	.tutorial > table > tr > td + td {
		border-right-width: 0px;
		border-left-width: 50px;
	}

	.tutorial > table > tr + tr {
		border: 0px solid transparent;
		border-top-width: 30px;
	}

	.mouse {
		border: solid 1px #d0d0ff;
		background: rgb(31 41 55);
		border-radius: 15px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30px;
		height: 50px;
		margin: 2px;
		position: relative;
	}

	.mouse::after {
		content: '';
		position: absolute;
		top: 8px;
		border: solid 1px #d0d0ff;
		background: rgb(31 41 55);
		border-radius: 15px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 6px;
		height: 14px;
	}

	.mouse.wheel::after {
		background: #d0d0ff;
		border: none;
		width: 5px;
	}

	.mouse.left::before {
		content: '';
		position: absolute;
		left: -3px;
		top: -3px;
		border: solid 1px #d0d0ff;
		background: #d0d0ff;
		border-top-left-radius: 15px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 15px;
		height: 25px;
		margin: 2px;
	}

	.button-container > td {
		text-align: right;
	}
	.button-container > td + td {
		text-align: left;
	}

	.button-container button {
		border: solid 1px #d0d0ff;
		padding: .2em 1.3em;
		border-radius: 8px;
		background: #d0d0d0;
		color: rgb(17, 24, 39);
	}
	.button-container > td + td button {
		background: transparent;
		color: #d0d0d0;
	}

	:global(div.container.loading) .tutorial {
		display: none;
	}
</style>

<div>
	<div class="container">
		<canvas id="{example.replaceAll('/', '_')}" width="500" height="500"></canvas>
		<a
			href="{`https://github.com/LorenzoLeonardini/computer-graphics/blob/main/src/examples/project/${example}.ts`}"
			target="_blank"
			rel="noreferrer noopener"><button class="code bg-gray-800">&lt;/&gt;</button></a>

		{#if showingTutorial}
			<div class="tutorial">
				<h2>Controls</h2>
				<table>
					<tr>
						<td>
							<table>
								<tr>
									<td></td>
									<td><span class="key">W</span></td>
									<td></td>
									<td style="width: 30px;"></td>
									<td></td>
									<td><span class="key">&uarr;</span></td>
									<td></td>
								</tr>

								<tr>
									<td><span class="key">A</span></td>
									<td><span class="key">S</span></td>
									<td><span class="key">D</span></td>
									<td></td>
									<td><span class="key">&larr;</span></td>
									<td><span class="key">&darr;</span></td>
									<td><span class="key">&rarr;</span></td>
								</tr>
							</table>
						</td>
						<td>
							Move around
						</td>
					</tr>

					<tr>
						<td>
							<table>
								<tr>
									<td><span class="key">1</span></td>
									<td><span class="key">2</span></td>
									<td><span class="key">3</span></td>
									<td><span class="key">4</span></td>
								</tr>
							</table>
						</td>
						<td>
							Select different camera
						</td>
					</tr>

					<tr>
						<td>
							<div class="mouse wheel"></div>
						</td>
						<td>
							Camera zoom
						</td>
					</tr>

					<tr>
						<td>
							<div class="mouse left"></div>
						</td>
						<td>
							Camera pan
						</td>
					</tr>

					<tr class="button-container">
						<td>
							<button on:click={() => closeTutorial(false)}>Close</button>
						</td>
						<td>
							<button on:click={() => closeTutorial(true)}>Don't show again</button>
						</td>
					</tr>
				</table>
			</div>
		{/if}
	</div>
</div>
