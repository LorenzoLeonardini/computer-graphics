import { DirectionalLight } from '../lib/DirectionalLight'
import { Entity } from '../lib/Entity'
import { FlatShader } from '../lib/FlatShader'
import { InputHandler } from '../lib/InputHandler'
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
import { ShadowPassShader } from '../lib/ShadowPassShader'

let gl: WebGL2RenderingContext = null

let terrain: Entity
let terrainShader: TerrainShader

let carHeadlightTexture: Texture

let car: Car
let buildings: Entity[] = []

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
	const gravelTexture = new Texture(gl, '/assets/gravel.png')
	const gravelNormal = new Texture(gl, '/assets/gravel_normal.png')
	const gravelRoughness = new Texture(gl, '/assets/gravel_roughness.png')
	terrainShader = new TerrainShader(
		gl,
		blendMapTexture,
		grassTexture,
		asphaltTexture,
		groundTexture,
		gravelTexture,
		grassNormal,
		asphaltNormal,
		groundNormal,
		gravelNormal,
		grassRoughness,
		asphaltRoughness,
		groundRoughness,
		gravelRoughness
	)

	terrain = new Entity(
		new OBJModel(gl, loadObjModel(await (await fetch('/assets/plane.obj')).text())),
		terrainShader
	)
	terrain.rotateX(-Math.PI / 2)
	terrain.setScale(16)

	car = new Car(
		gl,
		new OBJModel(gl, loadObjModel(await (await fetch('/assets/cube.obj')).text())),
		new OBJModel(gl, loadObjModel(await (await fetch('/assets/wheel.obj')).text())),
		new TexturedShader(gl, new Texture(gl, '/assets/wheel.jpg'))
	)

	const lampObj = new OBJModel(gl, loadObjModel(await (await fetch('/assets/lamp.obj')).text()))
	const lampShader = new FlatShader(gl, new Vector3(0.4, 0.4, 0.4))
	StreetLamp.setUpModel(lampObj, lampShader, new Vector3(0.44, 1.03, 0))

	const buildingCoords = [
		[-2.828125, -6.03125],
		[5.328125, 1.578125],
		[-7.53125, 8.0625]
	]
	const buildingModel = new OBJModel(
		gl,
		loadObjModel(await (await fetch('/assets/building.obj')).text())
	)
	const buildingShader = new TexturedShader(gl, new Texture(gl, '/assets/building.jpg'))
	buildingCoords.forEach((coords) => {
		const building = new Entity(buildingModel, buildingShader)
		building.setPosition(coords[0], 0, coords[1])
		// building.setScale(0.5)
		building.rotateYAroundOrigin(Math.random() * 3.14)
		buildings.push(building)
	})

	carHeadlightTexture = new Texture(gl, '/assets/car_headlight.png')
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

function makeLamp(x: number, y: number, rot: number = 0) {
	const lamp = new StreetLamp()
	lamp.setPosition(x, 0, y)
	lamp.rotateYAroundOrigin(rot)
	renderer.addEntity(lamp)
	renderer.addSpotlight(lamp.getLight())
}

export async function setupHowToDraw() {
	// material = new NormalsShader(gl)

	renderer = new Renderer(gl, new ShadowPassShader(gl))
	renderer.addEntity(terrain)
	renderer.addEntity(car)
	buildings.forEach((building) => {
		renderer.addEntity(building)
	})

	makeLamp(-5.765625, -12.828125, 3.14 / 3.8)
	makeLamp(-8.390625, -7.0, 3.14)
	makeLamp(-10.328125, -1.65625)
	makeLamp(-10.28125, 6.453125, 3.14)
	makeLamp(-7.328125, 12.875, -3.14 / 2.3)
	makeLamp(1.21875, 10.34375, 3.14 / 3.8)
	makeLamp(6.078125, 8.21875, -3.14 * 0.8)
	makeLamp(9.3125, 0.140625)
	makeLamp(11.453125, -7.8125, 3.14 * 0.8)
	makeLamp(4.890625, -11.453125, -3.14 / 3.8)

	// SUN
	renderer.addSun(new DirectionalLight(new Vector3(-1, -1, 1), new Vector3(1, 1, 1)))

	renderer.setLightProjectorTexture(carHeadlightTexture)

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
	cameraSwitcher.handleInput(inputHandler)
	cameraSwitcher.updateAllCameras(delta)

	renderer.setLightProjectors(car.getProjectorsMatrix())
	renderer.render(cameraSwitcher.getCurrentCamera())

	inputHandler.reset()
	window.requestAnimationFrame(draw)
}
