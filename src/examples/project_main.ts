import { Camera } from './lib/Camera'
import { Cube } from './lib/Cube'
import { Cylinder } from './lib/Cylinder'
import { Entity, EntityTree } from './lib/Entity'
import { FlatShader } from './lib/FlatShader'
import { Matrix4 } from './lib/Matrix'
import { NormalsShader } from './lib/NormalsShader'
import { loadObjModel } from './lib/ObjectLoader'
import { OBJModel } from './lib/OBJModel'
import { Quad } from './lib/Quad'
import { Renderer } from './lib/Renderer'
import { TerrainShader } from './lib/TerrainShader'
import { Texture } from './lib/Texture'
import { Vector2, Vector3 } from './lib/Vector'
import { Car } from './project/Car'

let gl: WebGL2RenderingContext = null
let shader: NormalsShader

let terrain: Entity
let terrainShader: TerrainShader

let sphere: OBJModel

let car: Car

let camera: Camera
let renderer: Renderer

let canvasWidth, canvasHeight

export function setupWebGL(canvas: HTMLCanvasElement) {
	gl = canvas.getContext('webgl2')
	console.log(gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS))
}

export async function setupWhatToDraw() {
	const blendMapTexture = new Texture(gl, '/assets/project/terrainBlendMap.png')
	const grassTexture = new Texture(gl, '/assets/grass.jpg')
	const asphaltTexture = new Texture(gl, '/assets/asphalt.jpg')
	terrainShader = new TerrainShader(
		gl,
		blendMapTexture,
		grassTexture,
		asphaltTexture,
		blendMapTexture,
		blendMapTexture
	)

	terrain = new Entity(new Quad(gl), terrainShader)
	terrain.rotateX(-Math.PI / 2)
	terrain.setScale(3)

	car = new Car(gl)

	const obj = await (await fetch('/assets/sphere.obj')).text()
	sphere = new OBJModel(gl, loadObjModel(obj))
}

export async function changeAspectRatio(width: number, height: number) {
	camera = new Camera(3.14 / 4, height / width, 0.01, 30)
	camera.position(0, 1.5, 2)
	camera.lookAt(new Vector3(0, 0, 0))
	gl.viewport(0, 0, width, height)
	canvasWidth = width
	canvasHeight = height
}

export async function setupHowToDraw() {
	// material = new NormalsShader(gl)

	renderer = new Renderer(gl)
	renderer.addEntity(terrain)
	renderer.addEntity(car)
}

const FRAME_DURATION = 1000 / 60
let lastTime: number = window.performance.now()

let spherePosition = new Vector3(0, 0, 0)

export function draw(time: number = window.performance.now()) {
	const delta = (time - lastTime) / FRAME_DURATION
	lastTime = time

	if (mouseWheel.deltaY !== 0) {
		camera.zoom(2 * delta * (mouseWheel.deltaY / canvasHeight))
	}
	if (keyStatus.KeyW) {
		spherePosition[2] -= 0.05 * delta
	}
	if (keyStatus.KeyA) {
		spherePosition[0] -= 0.05 * delta
	}
	if (keyStatus.KeyS) {
		spherePosition[2] += 0.05 * delta
	}
	if (keyStatus.KeyD) {
		spherePosition[0] += 0.05 * delta
	}

	if (mouseButtonStatus.Left) {
		const move = (mousePosition.current.x - mousePosition.last.x) / canvasWidth
		camera.rotateYAround(new Vector3(0, 0, 0), move * delta * 2)
	}

	if (mouseButtonStatus.Left) {
		const move = (mousePosition.current.y - mousePosition.last.y) / canvasHeight
		camera.rotateXAround(new Vector3(0, 0, 0), -move * delta * 2)
	}
	camera.lookAt(spherePosition)

	// draw terrain
	renderer.render(camera)

	mouseWheel.deltaX = 0
	mouseWheel.deltaY = 0
	window.requestAnimationFrame(draw)
}

const keyStatus = {
	KeyW: false,
	KeyA: false,
	KeyS: false,
	KeyD: false
}

const mouseButtonStatus = {
	Left: false,
	Middle: false,
	Right: false
}

const mousePosition = {
	last: {
		x: 0,
		y: 0
	},
	current: {
		x: 0,
		y: 0
	}
}

const mouseWheel = {
	deltaX: 0,
	deltaY: 0
}

document.body.onkeydown = function (e: KeyboardEvent) {
	if (e.code in keyStatus) {
		keyStatus[e.code] = true
	}
}

document.body.onkeyup = function (e: KeyboardEvent) {
	if (e.code in keyStatus) {
		keyStatus[e.code] = false
	}
}

document.body.oncontextmenu = () => false

document.body.onmousedown = function (e: MouseEvent) {
	if (e.button === 0) {
		mouseButtonStatus.Left = true
	} else if (e.button === 1) {
		mouseButtonStatus.Middle = true
	} else if (e.button === 2) {
		mouseButtonStatus.Right = true
	}
	e.preventDefault()
}

document.body.onmouseup = function (e: MouseEvent) {
	if (e.button === 0) {
		mouseButtonStatus.Left = false
	} else if (e.button === 1) {
		mouseButtonStatus.Middle = false
	} else if (e.button === 2) {
		mouseButtonStatus.Right = false
	}
	e.preventDefault()
}

document.body.onmousemove = function (e: MouseEvent) {
	mousePosition.last.x = mousePosition.current.x
	mousePosition.last.y = mousePosition.current.y
	mousePosition.current.x = e.clientX
	mousePosition.current.y = e.clientY
}

document.body.onwheel = function (e: WheelEvent) {
	mouseWheel.deltaX = e.deltaX
	mouseWheel.deltaY = e.deltaY
}
