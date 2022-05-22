import { showErrorModal } from './ErrorModal'
import { Matrix4 } from './Matrix'
import { glCall } from './Utils'

export class Shader {
	vertexShader: WebGLShader
	fragmentShader: WebGLShader
	program: WebGLProgram
	vertexPath: string
	fragmentPath: string
	vertexSrc: string
	fragmentSrc: string
	gl: WebGL2RenderingContext

	projectionMatUniformLocation: WebGLUniformLocation
	viewMatUniformLocation: WebGLUniformLocation
	objMatUniformLocation: WebGLUniformLocation

	lastFrameUniformLoaded: number = 0

	static shaderPromises = []
	static programCache: Map<string, Promise<WebGLProgram>> = new Map()

	protected constructor(gl: WebGL2RenderingContext, vertexPath: string, fragmentPath: string) {
		this.gl = gl
		this.vertexPath = vertexPath
		this.fragmentPath = fragmentPath

		Shader.shaderPromises.push(this._init())
	}

	protected async _init() {
		const shaderName = this.constructor.name
		if (!Shader.programCache.has(shaderName)) {
			const promise = new Promise<WebGLProgram>(async (resolve) => {
				const gl = this.gl
				this.vertexSrc = await (await fetch(this.vertexPath)).text()
				this.fragmentSrc = await (await fetch(this.fragmentPath)).text()

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

				console.log(`Compiling ${shaderName}...`)

				const program = glCall(gl, gl.createProgram)
				glCall(gl, gl.attachShader, program, this.vertexShader)
				glCall(gl, gl.attachShader, program, this.fragmentShader)
				glCall(gl, gl.linkProgram, program)
				glCall(gl, gl.useProgram, program)

				resolve(program)
			})
			Shader.programCache.set(shaderName, promise)
		}
		this.program = await Shader.programCache.get(shaderName)

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
		this.objMatUniformLocation = glCall(
			this.gl,
			this.gl.getUniformLocation,
			this.program,
			'uObjectMat'
		)
	}

	bind() {
		if (!this.program) {
			throw new Error("Don't forget to init the shader")
		}
		glCall(this.gl, this.gl.useProgram, this.program)
	}

	loadParameters() {}

	loadPerspective(perspective: Matrix4) {
		glCall(this.gl, this.gl.uniformMatrix4fv, this.projectionMatUniformLocation, false, perspective)
	}

	loadView(viewMatrix: Matrix4) {
		glCall(this.gl, this.gl.uniformMatrix4fv, this.viewMatUniformLocation, false, viewMatrix)
	}

	loadObjectMatrix(objectMatrix: Matrix4) {
		glCall(this.gl, this.gl.uniformMatrix4fv, this.objMatUniformLocation, false, objectMatrix)
	}

	static async loadAll() {
		await Promise.all(Shader.shaderPromises)
	}
}
