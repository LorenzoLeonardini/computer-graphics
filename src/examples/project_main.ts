import { Camera } from './lib/Camera'
import { Entity } from './lib/Entity'
import { InputHandler, MouseButton } from './lib/InputHandler'
import { NormalsShader } from './lib/NormalsShader'
import { loadObjModel } from './lib/ObjectLoader'
import { OBJModel } from './lib/OBJModel'
import { Quad } from './lib/Quad'
import { Renderer } from './lib/Renderer'
import { TerrainShader } from './lib/TerrainShader'
import { Texture } from './lib/Texture'
import { Vector3 } from './lib/Vector'
import { Car } from './project/Car'

let gl: WebGL2RenderingContext = null
let shader: NormalsShader

let terrain: Entity
let terrainShader: TerrainShader

let sphere: OBJModel

let car: Car

let camera: Camera
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

	inputHandler = new InputHandler()
	inputHandler.registerAllHandlers()
}

const FRAME_DURATION = 1000 / 60
let lastTime: number = window.performance.now()

let spherePosition = new Vector3(0, 0, 0)

export function draw(time: number = window.performance.now()) {
	const delta = (time - lastTime) / FRAME_DURATION
	lastTime = time

	if (inputHandler.mouseWheelY() !== 0) {
		camera.zoom(2 * delta * (inputHandler.mouseWheelY() / canvasHeight))
	}
	if (inputHandler.isKeyPressed('KeyW')) {
		spherePosition[2] -= 0.05 * delta
	}
	if (inputHandler.isKeyPressed('KeyA')) {
		spherePosition[0] -= 0.05 * delta
	}
	if (inputHandler.isKeyPressed('KeyS')) {
		spherePosition[2] += 0.05 * delta
	}
	if (inputHandler.isKeyPressed('KeyD')) {
		spherePosition[0] += 0.05 * delta
	}

	if (inputHandler.isMouseButtonClicked(MouseButton.LEFT)) {
		const [xMouse, yMouse] = inputHandler.getMousePositionDelta()
		const xMove = xMouse / canvasWidth
		camera.rotateYAround(new Vector3(0, 0, 0), xMove * delta * 2)
		const yMove = yMouse / canvasHeight
		camera.rotateXAround(new Vector3(0, 0, 0), -yMove * delta * 2)
	}
	camera.lookAt(spherePosition)

	// draw terrain
	renderer.render(camera)

	inputHandler.reset()
	window.requestAnimationFrame(draw)
}
