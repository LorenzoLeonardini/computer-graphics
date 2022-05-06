import { showErrorModal } from './ErrorModal'
import { Matrix4 } from './Matrix'
import { glCall } from './Utils'

export class Shader {
	vertexShader: WebGLShader
	fragmentShader: WebGLShader
	program: WebGLProgram
	vertexSrc: string
	fragmentSrc: string
	gl: WebGL2RenderingContext

	projectionMatUniformLocation: WebGLUniformLocation
	viewMatUniformLocation: WebGLUniformLocation

	protected async _init(gl: WebGL2RenderingContext): Promise<Shader> {
		this.gl = gl

		this.vertexShader = glCall(gl, gl.createShader, gl.VERTEX_SHADER)
		glCall(gl, gl.shaderSource, this.vertexShader, this.vertexSrc)
		glCall(gl, gl.compileShader, this.vertexShader)

		this.fragmentShader = glCall(gl, gl.createShader, gl.FRAGMENT_SHADER)
		glCall(gl, gl.shaderSource, this.fragmentShader, this.fragmentSrc)
		glCall(gl, gl.compileShader, this.fragmentShader)

		const message_vs = glCall(gl, gl.getShaderInfoLog, this.vertexShader)
		const message_fs = glCall(gl, gl.getShaderInfoLog, this.fragmentShader)

		if (message_vs.length > 0) {
			console.error('%cERROR COMPILING VERTEX SHADER', 'font-weight: bold;')
			console.log(this.vertexSrc)
			console.error(message_vs)
			const errorLine = parseInt(message_vs.split('ERROR: ')[1].split(':')[1])
			showErrorModal('Error compiling vertex shader', this.vertexSrc, errorLine)
		}
		if (message_fs.length > 0) {
			console.error('%cERROR COMPILING FRAGMENT SHADER', 'font-weight: bold;')
			console.log(this.fragmentSrc)
			console.error(message_fs)
			const errorLine = parseInt(message_fs.split('ERROR: ')[1].split(':')[1])
			showErrorModal('Error compiling fragment shader', this.fragmentSrc, errorLine)
		}

		this.program = glCall(gl, gl.createProgram)
		glCall(gl, gl.attachShader, this.program, this.vertexShader)
		glCall(gl, gl.attachShader, this.program, this.fragmentShader)
		glCall(gl, gl.linkProgram, this.program)
		glCall(gl, gl.useProgram, this.program)

		this.bindAttribLocation(0, 'aPosition')
		this.bindAttribLocation(1, 'aTexCoords')
		this.bindAttribLocation(2, 'aNormal')

		this.projectionMatUniformLocation = glCall(
			this.gl,
			this.gl.getUniformLocation,
			this.program,
			'uProjectionMat'
		)
		this.viewMatUniformLocation = glCall(
			this.gl,
			this.gl.getUniformLocation,
			this.program,
			'uViewMat'
		)

		return this
	}

	bindAttribLocation(index: number, name: string) {
		glCall(this.gl, this.gl.bindAttribLocation, this.program, index, name)
	}

	bind() {
		if (!this.vertexShader) {
			throw new Error("Don't forget to init the shader")
		}
		glCall(this.gl, this.gl.useProgram, this.program)
	}

	loadPerspective(perspective: Matrix4) {
		glCall(this.gl, this.gl.uniformMatrix4fv, this.projectionMatUniformLocation, false, perspective)
	}

	loadView(viewMatrix: Matrix4) {
		glCall(this.gl, this.gl.uniformMatrix4fv, this.viewMatUniformLocation, false, viewMatrix)
	}
}
