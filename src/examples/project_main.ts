import { Entity } from './lib/Entity'
import { FlatShader } from './lib/FlatShader'
import { InputHandler } from './lib/InputHandler'
import { NormalsShader } from './lib/NormalsShader'
import { loadObjModel } from './lib/ObjectLoader'
import { OBJModel } from './lib/OBJModel'
import { Quad } from './lib/Quad'
import { Renderer } from './lib/Renderer'
import { TerrainShader } from './lib/TerrainShader'
import { Texture } from './lib/Texture'
import { Vector3 } from './lib/Vector'
import { CameraSwitcher } from './project/CameraSwitcher'
import { Car } from './project/Car'
import { FollowCamera } from './project/FollowCamera'
import { FreeCamera } from './project/FreeCamera'
import { TopDownCamera } from './project/TopDownCamera'

let gl: WebGL2RenderingContext = null
let shader: NormalsShader

let terrain: Entity
let terrainShader: TerrainShader

let sphere: Entity

let car: Car

let cameraSwitcher: CameraSwitcher
let camera: FreeCamera
let topDownCamera: TopDownCamera
let followCamera: FollowCamera

let renderer: Renderer
let inputHandler: InputHandler

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
	terrain.setScale(8)

	car = new Car(gl)

	const obj = await (await fetch('/assets/sphere.obj')).text()
	sphere = new Entity(new OBJModel(gl, loadObjModel(obj)), new FlatShader(gl, new Vector3(0, 1, 0)))
	sphere.setScale(0.05)
}

export async function changeAspectRatio(width: number, height: number) {
	camera = new FreeCamera(3.14 / 4, height / width, 0.01, 30)
	camera.position(0, 1.5, 2)
	camera.attachTo(car)

	topDownCamera = new TopDownCamera(3.14 / 4, height / width, 0.01, 30)
	topDownCamera.attachTo(car)

	followCamera = new FollowCamera(3.14 / 4, height / width, 0.01, 30)
	followCamera.attachTo(car)

	cameraSwitcher = new CameraSwitcher([
		{ camera: followCamera, key: 1 },
		{ camera: topDownCamera, key: 2 },
		{ camera: camera, key: 3 }
	])
	cameraSwitcher.setCamera(1)

	gl.viewport(0, 0, width, height)
	canvasWidth = width
	canvasHeight = height

	if (inputHandler) {
		inputHandler.canvasWidth = width
		inputHandler.canvasHeight = height
	}
}

export async function setupHowToDraw() {
	// material = new NormalsShader(gl)

	renderer = new Renderer(gl)
	renderer.addEntity(terrain)
	renderer.addEntity(car)
	renderer.addEntity(sphere)

	inputHandler = new InputHandler()
	inputHandler.registerAllHandlers()
	inputHandler.canvasWidth = canvasWidth
	inputHandler.canvasHeight = canvasHeight
}

const FRAME_DURATION = 1000 / 60
let lastTime: number = window.performance.now()

export function draw(time: number = window.performance.now()) {
	const delta = (time - lastTime) / FRAME_DURATION
	lastTime = time

	car.update(delta, inputHandler)
	let spherePosition = car.getSpherePosition()
	sphere.setPosition(spherePosition[0], spherePosition[1], spherePosition[2])
	cameraSwitcher.handleInput(inputHandler)
	cameraSwitcher.updateAllCameras(delta)

	// draw terrain
	renderer.render(cameraSwitcher.getCurrentCamera())

	inputHandler.reset()
	window.requestAnimationFrame(draw)
}
