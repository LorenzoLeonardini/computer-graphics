import { Camera } from './lib/Camera'
import { Matrix4 } from './lib/Matrix'
import { NormalsMaterial } from './lib/NormalsMaterial'
import { loadObjModel } from './lib/ObjectLoader'
import { OBJModel } from './lib/OBJModel'
import { Shader } from './lib/Shader'
import { Vector3 } from './lib/Vector'

let gl: WebGLRenderingContext = null
let material: NormalsMaterial
const slotPositions = 0
const slotTexCoords = 1
const slotNormals = 2
let dragon: OBJModel = null
let rotation = 0.1

let camera: Camera

export function setupWebGL(canvas: HTMLCanvasElement) {
	gl = canvas.getContext('webgl')
}

export async function setupWhatToDraw() {
	const obj = await (await fetch('/assets/dragon.obj')).text()
	const model = await loadObjModel(obj)
	dragon = new OBJModel(gl, model)
}

export async function changeAspectRatio(width: number, height: number) {
	camera = new Camera(3.14 / 4, height / width, 0.01, 50)
	camera.position(0, 5, 20)
	camera.lookAt(0, 5, 0)
	gl.viewport(0, 0, width, height)
}

export async function setupHowToDraw() {
	material = new NormalsMaterial(gl)
}

export function draw() {
	gl.enable(gl.DEPTH_TEST)

	const mat = new Matrix4().translate(new Vector3(0, 0, 0)).rotate(new Vector3(0, rotation, 0))

	gl.clearColor(0.2, 0.3, 0.4, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
	dragon.bind(gl)
	camera.render(gl, dragon, material, mat)
	dragon.unbind(gl)

	rotation += 0.01
	window.requestAnimationFrame(draw)
}
