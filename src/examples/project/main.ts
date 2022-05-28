import { DirectionalLight } from '../lib/DirectionalLight'
import { Entity } from '../lib/Entity'
import { FlatShader } from '../lib/FlatShader'
import { InputHandler } from '../lib/InputHandler'
import { NormalsShader } from '../lib/NormalsShader'
import { loadObjModel } from '../lib/ObjectLoader'
import { OBJModel } from '../lib/OBJModel'
import { Renderer } from '../lib/Renderer'
import { TerrainShader } from '../lib/TerrainShader'
import { Texture } from '../lib/Texture'
import { TexturedShader } from '../lib/TexturedShader'
import { Vector3, Vector4 } from '../lib/Vector'
import { CameraSwitcher } from './CameraSwitcher'
import { Car } from './Car'
import { FollowCamera } from './FollowCamera'
import { CinematicCamera } from './CinematicCamera'
import { TopDownCamera } from './TopDownCamera'
import { FreeCamera } from './FreeCamera'
import { StreetLamp } from './StreetLamp'

let gl: WebGL2RenderingContext = null
let shader: NormalsShader

let terrain: Entity
let terrainShader: TerrainShader

let carHeadlightTexture: Texture

let sphere: Entity
let car: Car
let building: Entity

let cameraSwitcher: CameraSwitcher
let camera: CinematicCamera
let freeCamera: FreeCamera
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
	const grassTexture = new Texture(gl, '/assets/grass.png')
	const grassNormal = new Texture(gl, '/assets/grass_normal.png')
	const grassRoughness = new Texture(gl, '/assets/grass_roughness.png')
	const asphaltTexture = new Texture(gl, '/assets/asphalt.jpg')
	const asphaltNormal = new Texture(gl, '/assets/asphalt_normal.jpg')
	const asphaltRoughness = new Texture(gl, '/assets/asphalt_roughness.jpg')
	const groundTexture = new Texture(gl, '/assets/ground.png')
	const groundNormal = new Texture(gl, '/assets/ground_normal.png')
	const groundRoughness = new Texture(gl, '/assets/ground_roughness.png')
	terrainShader = new TerrainShader(
		gl,
		blendMapTexture,
		grassTexture,
		asphaltTexture,
		groundTexture,
		blendMapTexture,
		grassNormal,
		asphaltNormal,
		groundNormal,
		blendMapTexture,
		grassRoughness,
		asphaltRoughness,
		groundRoughness,
		blendMapTexture
	)

	terrain = new Entity(
		new OBJModel(gl, loadObjModel(await (await fetch('/assets/plane.obj')).text())),
		terrainShader
	)
	terrain.rotateX(-Math.PI / 2)
	terrain.setScale(32)

	car = new Car(
		gl,
		new OBJModel(gl, loadObjModel(await (await fetch('/assets/cube.obj')).text())),
		new OBJModel(gl, loadObjModel(await (await fetch('/assets/wheel.obj')).text())),
		new TexturedShader(
			gl,
			new Texture(gl, '/assets/wheel.jpg'),
			new Texture(gl, '/assets/wheel_normal.jpg'),
			new Texture(gl, '/assets/wheel_roughness.jpg')
		)
	)

	const obj = await (await fetch('/assets/sphere.obj')).text()
	sphere = new Entity(new OBJModel(gl, loadObjModel(obj)), new FlatShader(gl, new Vector3(0, 1, 0)))
	sphere.setScale(0.05)

	const lampObj = new OBJModel(gl, loadObjModel(await (await fetch('/assets/lamp.obj')).text()))
	const lampShader = new FlatShader(gl, new Vector3(0.4, 0.4, 0.4))
	StreetLamp.setUpModel(lampObj, lampShader, new Vector3(0.65, 1, 0))

	building = new Entity(
		new OBJModel(gl, loadObjModel(await (await fetch('/assets/cube.obj')).text())),
		new FlatShader(gl, new Vector3(0.5, 0.5, 0.5))
	)
	building.setPosition(0, 0.5, -8)
	// building.rotateY(0.1)
	building.setScale(0.5)

	carHeadlightTexture = new Texture(gl, '/assets/car_headlight.png')
	Renderer.setLightProjectorTexture(carHeadlightTexture)
}

export async function changeAspectRatio(width: number, height: number) {
	camera = new CinematicCamera(3.14 / 4, height / width, 0.01, 60)
	camera.position(0, 1.5, 2)
	camera.attachTo(car)

	topDownCamera = new TopDownCamera(3.14 / 4, height / width, 0.01, 60)
	topDownCamera.attachTo(car)

	followCamera = new FollowCamera(3.14 / 4, height / width, 0.01, 60)
	followCamera.attachTo(car)

	freeCamera = new FreeCamera(3.14 / 4, height / width, 0.01, 60)
	freeCamera.position(0, 1.5, 2)

	cameraSwitcher = new CameraSwitcher([
		{ camera: followCamera, key: 1 },
		{ camera: topDownCamera, key: 2 },
		{ camera: freeCamera, key: 3 },
		{ camera: camera, key: 4 }
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
	renderer.addEntity(building)

	const lamp = new StreetLamp()
	renderer.addEntity(lamp)
	renderer.addSpotlight(lamp.getLight())

	const lamp2 = new StreetLamp()
	lamp2.setPosition(4, 0, 0)
	lamp2.rotateY(Math.PI / 4)
	renderer.addEntity(lamp2)
	renderer.addSpotlight(lamp2.getLight())

	// SUN
	renderer.addDirectionalLight(
		new DirectionalLight(new Vector3(-1, -1, 1), new Vector4(1, 1, 1, 1))
	)

	inputHandler = new InputHandler()
	inputHandler.registerAllHandlers()
	inputHandler.canvasWidth = canvasWidth
	inputHandler.canvasHeight = canvasHeight
}

const FRAME_DURATION = 1000 / 60
let lastTime: number

export function draw(time: number = window.performance.now()) {
	if (!lastTime || time - lastTime < 0) {
		lastTime = time
		window.requestAnimationFrame(draw)
		return
	}
	const delta = (time - lastTime) / FRAME_DURATION
	lastTime = time

	if (!cameraSwitcher.getCurrentCamera().consumesInput()) {
		car.update(delta, inputHandler)
	}
	let spherePosition = car.getSpherePosition()
	sphere.setPosition(spherePosition[0], spherePosition[1], spherePosition[2])
	cameraSwitcher.handleInput(inputHandler)
	cameraSwitcher.updateAllCameras(delta)

	renderer.setLightProjectors(car.getProjectorsMatrix())
	renderer.render(cameraSwitcher.getCurrentCamera())

	inputHandler.reset()
	window.requestAnimationFrame(draw)
}
