import { showErrorModal } from './ErrorModal'

export class Shader {
	vertexShader: WebGLShader
	fragmentShader: WebGLShader
	program: WebGLProgram

	constructor(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string) {
		this.vertexShader = gl.createShader(gl.VERTEX_SHADER)
		gl.shaderSource(this.vertexShader, vertexSrc)
		gl.compileShader(this.vertexShader)

		this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
		gl.shaderSource(this.fragmentShader, fragmentSrc)
		gl.compileShader(this.fragmentShader)

		const message_vs = gl.getShaderInfoLog(this.vertexShader)
		const message_fs = gl.getShaderInfoLog(this.fragmentShader)

		if (message_vs.length > 0) {
			console.error('%cERROR COMPILING VERTEX SHADER', 'font-weight: bold;')
			console.log(vertexSrc)
			console.error(message_vs)
			const errorLine = parseInt(message_vs.split('ERROR: ')[1].split(':')[1])
			showErrorModal('Error compiling vertex shader', vertexSrc, errorLine)
		}
		if (message_fs.length > 0) {
			console.error('%cERROR COMPILING FRAGMENT SHADER', 'font-weight: bold;')
			console.log(fragmentSrc)
			console.error(message_fs)
			const errorLine = parseInt(message_fs.split('ERROR: ')[1].split(':')[1])
			showErrorModal('Error compiling fragment shader', fragmentSrc, errorLine)
		}

		this.program = gl.createProgram()
		gl.attachShader(this.program, this.vertexShader)
		gl.attachShader(this.program, this.fragmentShader)
		gl.linkProgram(this.program)
		gl.useProgram(this.program)
	}

	bindAttribLocation(gl: WebGLRenderingContext, index: number, name: string) {
		gl.bindAttribLocation(this.program, index, name)
	}
}
