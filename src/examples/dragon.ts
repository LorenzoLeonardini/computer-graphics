import { Camera } from './lib/Camera'
import { Entity } from './lib/Entity'
import { Matrix4 } from './lib/Matrix'
import { NormalsShader } from './lib/NormalsShader'
import { loadObjModel } from './lib/ObjectLoader'
import { OBJModel } from './lib/OBJModel'
import { Renderer } from './lib/Renderer'
import { Vector3 } from './lib/Vector'

let gl: WebGL2RenderingContext = null
let shader: NormalsShader
let dragon: Entity = null
let renderer: Renderer

let camera: Camera

export function setupWebGL(canvas: HTMLCanvasElement) {
	gl = canvas.getContext('webgl2')
}

export async function setupWhatToDraw() {
	const obj = await (await fetch('/assets/dragon.obj')).text()
	const model = await loadObjModel(obj)

	shader = new NormalsShader(gl)
	dragon = new Entity(new OBJModel(gl, model), shader)
}

export async function changeAspectRatio(width: number, height: number) {
	camera = new Camera(3.14 / 4, height / width, 0.01, 50)
	camera.position(0, 5, 20)
	camera.lookAt(new Vector3(0, 5, 0))
	gl.viewport(0, 0, width, height)
}

export async function setupHowToDraw() {
	renderer = new Renderer(gl)
	renderer.addEntity(dragon)
}

export function draw() {
	dragon.rotateY(0.01)
	renderer.render(camera)

	window.requestAnimationFrame(draw)
}
