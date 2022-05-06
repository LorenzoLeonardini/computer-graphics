import { Cube } from './lib/Cube'
import { Cylinder } from './lib/Cylinder'
import { Matrix4 } from './lib/Matrix'
import { Vector3 } from './lib/Vector'

let gl: WebGL2RenderingContext = null
let program: WebGLProgram
const slotPositions = 0

let body: Cube
let top: Cube
let frontRightWheel: Cylinder
let frontLeftWheel: Cylinder
let backRightWheel: Cylinder
let backLeftWheel: Cylinder

let rotation = 0.1
let projectionMatrix: Matrix4

export function setupWebGL(canvas: HTMLCanvasElement) {
	gl = canvas.getContext('webgl2')
}

export function setupWhatToDraw() {
	body = new Cube(gl)
	top = new Cube(gl)
	frontRightWheel = new Cylinder(gl)
	frontLeftWheel = new Cylinder(gl)
	backRightWheel = new Cylinder(gl)
	backLeftWheel = new Cylinder(gl)
}

export async function changeAspectRatio(width: number, height: number) {
	gl.viewport(0, 0, width, height)
}

export function setupHowToDraw() {
	const vertexShaderSource = `
		attribute vec3 aPosition;

		uniform mat4 uProjectionMat;
		uniform mat4 uMat;
		uniform vec3 uColor;

		varying vec3 color;
		
		void main(void) {
			color = uColor;
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
		.translate(new Vector3(0, -0.5, -4.6))

	gl.clearColor(0.2, 0.3, 0.4, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)

	gl.uniform3fv(gl.getUniformLocation(program, 'uColor'), new Vector3(0.784, 0, 0))

	Cube.bind(gl)
	const bodyMat = new Matrix4().scale(new Vector3(0.8, 0.25, 0.5))
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMat'), false, mat.mul(bodyMat))
	body.render(gl)

	const topMat = new Matrix4()
		.scale(new Vector3(0.625, 0.2, 0.5))
		.translate(new Vector3(0.175, 0.45, 0))
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMat'), false, mat.mul(topMat))
	top.render(gl)
	Cube.unbind(gl)

	gl.uniform3fv(gl.getUniformLocation(program, 'uColor'), new Vector3(0.133, 0.133, 0.133))

	Cylinder.bind(gl)
	const wheelsMat = new Matrix4()
		.rotate(new Vector3(Math.PI / 2, 0, 0))
		.scale(new Vector3(0.2, 0.2, 0.1))
		.translate(new Vector3(0, -0.15, 0))

	const frontRightMat = wheelsMat.translate(new Vector3(-0.5, 0, 0.5))
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMat'), false, mat.mul(frontRightMat))
	frontRightWheel.render(gl)

	const frontLeftMat = wheelsMat.translate(new Vector3(-0.5, 0, -0.5))
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMat'), false, mat.mul(frontLeftMat))
	frontLeftWheel.render(gl)

	const backRightMat = wheelsMat.translate(new Vector3(0.5, 0, 0.5))
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMat'), false, mat.mul(backRightMat))
	backRightWheel.render(gl)

	const backLeftMat = wheelsMat.translate(new Vector3(0.5, 0, -0.5))
	gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMat'), false, mat.mul(backLeftMat))
	backLeftWheel.render(gl)
	Cylinder.unbind(gl)

	// const backWheelMat = new Matrix4()
	// 	.rotate(new Vector3(Math.PI / 2, 0, 0))
	// 	.scale(new Vector3(0.2, 0.2, 0.6))
	// 	.translate(new Vector3(0.5, -0.15, 0))
	// gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMat'), false, mat.mul(backWheelMat))
	// backWheel.render(gl)

	rotation += 0.01
	window.requestAnimationFrame(draw)
}
