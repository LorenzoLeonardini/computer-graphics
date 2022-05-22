import { showErrorModal } from './ErrorModal'
import { Matrix4 } from './Matrix'

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
		const gl = this.gl

		if (!Shader.programCache.has(shaderName)) {
			const promise = new Promise<WebGLProgram>(async (resolve) => {
				this.vertexSrc = await (await fetch(this.vertexPath)).text()
				this.fragmentSrc = await (await fetch(this.fragmentPath)).text()

				this.vertexShader = gl.createShader(gl.VERTEX_SHADER)
				gl.shaderSource(this.vertexShader, this.vertexSrc)
				gl.compileShader(this.vertexShader)

				this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
				gl.shaderSource(this.fragmentShader, this.fragmentSrc)
				gl.compileShader(this.fragmentShader)

				const message_vs = gl.getShaderInfoLog(this.vertexShader)
				const message_fs = gl.getShaderInfoLog(this.fragmentShader)

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

				const program = gl.createProgram()
				gl.attachShader(program, this.vertexShader)
				gl.attachShader(program, this.fragmentShader)
				gl.linkProgram(program)
				gl.useProgram(program)

				resolve(program)
			})
			Shader.programCache.set(shaderName, promise)
		}
		this.program = await Shader.programCache.get(shaderName)

		this.projectionMatUniformLocation = gl.getUniformLocation(this.program, 'uProjectionMat')
		this.viewMatUniformLocation = gl.getUniformLocation(this.program, 'uViewMat')
		this.objMatUniformLocation = gl.getUniformLocation(this.program, 'uObjectMat')
	}

	bind() {
		if (!this.program) {
			throw new Error("Don't forget to init the shader")
		}
		this.gl.useProgram(this.program)
	}

	loadParameters() {}

	loadPerspective(perspective: Matrix4) {
		this.gl.uniformMatrix4fv(this.projectionMatUniformLocation, false, perspective)
	}

	loadView(viewMatrix: Matrix4) {
		this.gl.uniformMatrix4fv(this.viewMatUniformLocation, false, viewMatrix)
	}

	loadObjectMatrix(objectMatrix: Matrix4) {
		this.gl.uniformMatrix4fv(this.objMatUniformLocation, false, objectMatrix)
	}

	static async loadAll() {
		await Promise.all(Shader.shaderPromises)
	}
}
