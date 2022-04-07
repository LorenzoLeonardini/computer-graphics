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
		}
		if (message_fs.length > 0) {
			console.error('%cERROR COMPILING FRAGMENT SHADER', 'font-weight: bold;')
			console.log(fragmentSrc)
			console.error(message_fs)
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
