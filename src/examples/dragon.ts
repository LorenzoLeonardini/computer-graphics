import { Matrix4 } from './lib/Matrix'
import { loadObjModel } from './lib/ObjectLoader'
import { OBJModel } from './lib/OBJModel'
import { loadImage } from './lib/Utils'
import { Vector3 } from './lib/Vector'

let gl: WebGLRenderingContext = null
let program: WebGLProgram
const slotPositions = 0
const slotTexCoords = 1
const slotNormals = 2
let dragon: OBJModel = null
let rotation = 0.1
let projectionMatrix: Matrix4

export function setupWebGL(canvas: HTMLCanvasElement) {
	gl = canvas.getContext('webgl')
}

export async function setupWhatToDraw() {
	const obj = await (await fetch('/assets/dragon.obj')).text()
	const model = await loadObjModel(obj)
	dragon = new OBJModel(gl, model)
}

export async function setupHowToDraw() {
	const vertexShaderSource = `
		attribute vec3 aPosition;
		attribute vec2 aTexCoords;
		attribute vec3 aNormal;

		uniform mat4 uProjectionMat;
		uniform mat4 uMat;

		varying vec2 vTexCoords;
		varying vec3 vNormal;
		
		void main(void) {
			vTexCoords = aTexCoords;
			vNormal = aNormal;
			gl_Position = uProjectionMat * uMat * vec4(aPosition, 1.0);
		}
	`
	const vertexShader = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertexShader, vertexShaderSource)
	gl.compileShader(vertexShader)

	const fragmentShaderSource = `
		precision lowp float;

		uniform sampler2D uTexture;
		
		varying vec2 vTexCoords;
		varying vec3 vNormal;

		void main(void) {
			gl_FragColor = vec4((vNormal.x + 1.0) / 2.0, (vNormal.y + 1.0) / 2.0, (vNormal.z + 1.0) / 2.0, 1.0);//texture2D(uTexture, vTexCoords);
		}
	`
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
	gl.shaderSource(fragmentShader, fragmentShaderSource)
	gl.compileShader(fragmentShader)

	const message_vs = gl.getShaderInfoLog(vertexShader)
	const message_fs = gl.getShaderInfoLog(fragmentShader)

	console.log(message_vs, message_fs)

	program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.bindAttribLocation(program, slotPositions, 'aPosition')
	gl.bindAttribLocation(program, slotTexCoords, 'aTexCoords')
	gl.bindAttribLocation(program, slotNormals, 'aNormal')
	gl.linkProgram(program)
	gl.useProgram(program)

	projectionMatrix = Matrix4.perspective(3.14 / 4, 1, 0.01, 50)
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjectionMat'), false, projectionMatrix)
}

export function draw() {
	gl.enable(gl.DEPTH_TEST)

	const mat = new Matrix4().rotate(new Vector3(0, rotation, 0)).translate(new Vector3(0, -5, -20))
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMat'), false, mat)

	gl.clearColor(0.2, 0.3, 0.4, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
	dragon.render(gl)

	rotation += 0.01
	window.requestAnimationFrame(draw)
}
