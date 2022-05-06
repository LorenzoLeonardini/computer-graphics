import { Cube } from './lib/Cube'
import { Matrix4 } from './lib/Matrix'
import { Vector3 } from './lib/Vector'

let gl: WebGL2RenderingContext = null
let program: WebGLProgram
const slotPositions = 0
let cube: Cube = null
let rotation = 0.1
let projectionMatrix: Matrix4

export function setupWebGL(canvas: HTMLCanvasElement) {
	gl = canvas.getContext('webgl2')
}

export function setupWhatToDraw() {
	cube = new Cube(gl)
}

export async function changeAspectRatio(width: number, height: number) {
	gl.viewport(0, 0, width, height)
}

export function setupHowToDraw() {
	const vertexShaderSource = `
		attribute vec3 aPosition;

		uniform mat4 uProjectionMat;
		uniform mat4 uMat;

		varying vec3 color;
		
		void main(void) {
			color = (aPosition + vec3(1.0, 1.0, 1.0)) / 2.0;
			gl_Position = uProjectionMat * uMat * vec4(aPosition, 1.0);
		}
	`
	const vertexShader = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertexShader, vertexShaderSource)
	gl.compileShader(vertexShader)

	const fragmentShaderSource = `
		precision lowp float;

		varying vec3 color;

		void main(void) {
			gl_FragColor = vec4(color, 1.0);
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
	gl.linkProgram(program)
	gl.useProgram(program)

	projectionMatrix = Matrix4.perspective(3.14 / 4, 1, 0.01, 15)
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjectionMat'), false, projectionMatrix)
}

export function draw() {
	gl.enable(gl.DEPTH_TEST)

	const mat = new Matrix4()
		.rotate(new Vector3(0, rotation, 0))
		.rotate(new Vector3(0, 0, rotation / 2))
		.translate(new Vector3(0, 0, -4.6))
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMat'), false, mat)

	gl.clearColor(0.2, 0.3, 0.4, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
	cube.render(gl)

	rotation += 0.01
	window.requestAnimationFrame(draw)
}
