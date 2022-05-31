import { DirectionalLight } from '../lib/DirectionalLight'
import { Entity } from '../lib/Entity'
import { FlatShader } from '../lib/FlatShader'
import { InputHandler } from '../lib/InputHandler'
import { loadObjModel, loadObj } from '../lib/ObjectLoader'
import { OBJModel } from '../lib/OBJModel'
import { Renderer } from '../lib/Renderer'
import { TerrainShader } from '../lib/TerrainShader'
import { Texture } from '../lib/Texture'
import { TexturedShader } from '../lib/TexturedShader'
import { Vector3 } from '../lib/Vector'
import { CameraSwitcher } from './CameraSwitcher'
import { Car } from './Car'
import { FollowCamera } from './FollowCamera'
import { CinematicCamera } from './CinematicCamera'
import { TopDownCamera } from './TopDownCamera'
import { FreeCamera } from './FreeCamera'
import { StreetLamp } from './StreetLamp'
import { ShadowPassShader } from '../lib/ShadowPassShader'

let gl: WebGL2RenderingContext = null

let car: Car

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

const textures: Map<string, Texture> = new Map()
const objects: Map<string, OBJModel> = new Map()

export async function setupWhatToDraw() {
	// terrain
	textures.set('blendMapTexture', new Texture(gl, '/assets/project/terrainBlendMap.png'))
	textures.set('grassTexture', new Texture(gl, '/assets/grass.png'))
	textures.set('grassNormal', new Texture(gl, '/assets/grass_normal.png'))
	textures.set('grassRoughness', new Texture(gl, '/assets/grass_roughness.png'))
	textures.set('asphaltTexture', new Texture(gl, '/assets/asphalt.jpg'))
	textures.set('asphaltNormal', new Texture(gl, '/assets/asphalt_normal.jpg'))
	textures.set('asphaltRoughness', new Texture(gl, '/assets/asphalt_roughness.jpg'))
	textures.set('groundTexture', new Texture(gl, '/assets/ground.png'))
	textures.set('groundNormal', new Texture(gl, '/assets/ground_normal.png'))
	textures.set('groundRoughness', new Texture(gl, '/assets/ground_roughness.png'))
	textures.set('gravelTexture', new Texture(gl, '/assets/gravel.png'))
	textures.set('gravelNormal', new Texture(gl, '/assets/gravel_normal.png'))
	textures.set('gravelRoughness', new Texture(gl, '/assets/gravel_roughness.png'))

	objects.set('plane', new OBJModel(gl, await loadObj('/assets/plane.obj')))

	// car
	textures.set('carHeadlight', new Texture(gl, '/assets/car_headlight.png'))
	textures.set('car', new Texture(gl, '/assets/car.png', false))

	objects.set('car', new OBJModel(gl, await loadObj('/assets/car.obj')))
	objects.set('wheel', new OBJModel(gl, await loadObj('/assets/wheel.obj')))
	objects.set('tire', new OBJModel(gl, await loadObj('/assets/tire.obj')))

	car = new Car(
		gl,
		objects.get('car'),
		new TexturedShader(gl, textures.get('car')),
		objects.get('wheel'),
		new FlatShader(gl, new Vector3(0.7, 0.7, 0.7)),
		objects.get('tire'),
		new FlatShader(gl, new Vector3(0.2, 0.2, 0.2))
	)

	// buildings
	textures.set('building', new Texture(gl, '/assets/building.jpg'))

	objects.set('building', new OBJModel(gl, await loadObj('/assets/building.obj')))

	// lamp setup
	const lampObj = new OBJModel(gl, await loadObj('/assets/lamp.obj'))
	const lampShader = new FlatShader(gl, new Vector3(0.4, 0.4, 0.4))
	StreetLamp.setUpModel(lampObj, lampShader, new Vector3(0.44, 1.03, 0))
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
	// Setup renderer
	renderer = new Renderer(gl, new ShadowPassShader(gl))

	// terrain
	const terrainShader = new TerrainShader(
		gl,
		textures.get('blendMapTexture'),
		textures.get('grassTexture'),
		textures.get('asphaltTexture'),
		textures.get('groundTexture'),
		textures.get('gravelTexture'),
		textures.get('grassNormal'),
		textures.get('asphaltNormal'),
		textures.get('groundNormal'),
		textures.get('gravelNormal'),
		textures.get('grassRoughness'),
		textures.get('asphaltRoughness'),
		textures.get('groundRoughness'),
		textures.get('gravelRoughness')
	)

	const terrain = new Entity(objects.get('plane'), terrainShader)
	terrain.rotateX(-Math.PI / 2)
	terrain.setScale(16)
	renderer.addEntity(terrain)

	// car
	renderer.addEntity(car)

	// buildings
	const buildingCoords = [
		[-2.828125, -6.03125],
		[5.328125, 1.578125],
		[-7.53125, 8.0625]
	]

	const buildingShader = new TexturedShader(gl, textures.get('building'))
	buildingCoords.forEach((coords) => {
		const building = new Entity(objects.get('building'), buildingShader)
		building.setPosition(coords[0], 0, coords[1])
		building.rotateYAroundOrigin(Math.random() * 3.14)
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

	renderer.setLightProjectorTexture(textures.get('carHeadlight'))

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
