import { DirectionalLight } from './DirectionalLight'
import { showErrorModal } from './ErrorModal'
import { Matrix4 } from './Matrix'
import { Spotlight } from './Spotlight'

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

	directionalLightsCountLocation: WebGLUniformLocation
	directionalLightsDirectionLocation: WebGLUniformLocation
	directionalLightsColorLocation: WebGLUniformLocation

	spotlightsCountLocation: WebGLUniformLocation
	spotlightsPositionLocation: WebGLUniformLocation
	spotlightsDirectionLocation: WebGLUniformLocation
	spotlightsColorLocation: WebGLUniformLocation

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
				this.vertexSrc = await parseShaderInclude(this.vertexSrc)
				this.fragmentSrc = await (await fetch(this.fragmentPath)).text()
				this.fragmentSrc = await parseShaderInclude(this.fragmentSrc)

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

				const message_link = gl.getProgramInfoLog(program)
				if (message_link.length > 0) {
					console.error('%cERROR LINKING PROGRAM', 'font-weight: bold;')
					console.log(message_link)
					showErrorModal('Error linking program', message_link, -1)
				}

				gl.useProgram(program)

				resolve(program)
			})
			Shader.programCache.set(shaderName, promise)
		}
		this.program = await Shader.programCache.get(shaderName)

		this.projectionMatUniformLocation = this.getLocation('uProjectionMat')
		this.viewMatUniformLocation = this.getLocation('uViewMat')
		this.objMatUniformLocation = this.getLocation('uObjectMat')

		this.directionalLightsCountLocation = this.getLocation('uDirectionalLightsCount')
		this.directionalLightsDirectionLocation = this.getLocation('uDirectionalLightsDirection')
		this.directionalLightsColorLocation = this.getLocation('uDirectionalLightsColor')
		if (this.directionalLightsCountLocation) {
			this.gl.uniform1i(this.directionalLightsCountLocation, 0)
		}

		this.spotlightsCountLocation = this.getLocation('uSpotlightsCount')
		this.spotlightsPositionLocation = this.getLocation('uSpotlightsPosition')
		this.spotlightsDirectionLocation = this.getLocation('uSpotlightsDirection')
		this.spotlightsColorLocation = this.getLocation('uSpotlightsColor')
		if (this.spotlightsCountLocation) {
			this.gl.uniform1i(this.spotlightsCountLocation, 0)
		}
	}

	getLocation(name: string): WebGLUniformLocation {
		return this.gl.getUniformLocation(this.program, name)
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

	loadDirectionalLights(lights: DirectionalLight[]) {
		if (this.directionalLightsCountLocation === null) {
			return
		}
		this.gl.uniform1i(this.directionalLightsCountLocation, lights.length)
		if (lights.length === 0) {
			return
		}
		const directions = []
		const colors = []
		lights.forEach((light) => {
			directions.push(...light.getDirection())
			colors.push(...light.getColor())
		})
		this.gl.uniform3fv(this.directionalLightsDirectionLocation, new Float32Array(directions))
		this.gl.uniform4fv(this.directionalLightsColorLocation, new Float32Array(colors))
	}

	loadSpotlights(lights: Spotlight[]) {
		if (this.spotlightsCountLocation === null) {
			return
		}
		this.gl.uniform1i(this.spotlightsCountLocation, lights.length)
		if (lights.length === 0) {
			return
		}
		const positions = []
		const directions = []
		const colors = []
		lights.forEach((light) => {
			positions.push(...light.getPosition())
			directions.push(...light.getDirection())
			colors.push(...light.getColor())
		})
		this.gl.uniform3fv(this.spotlightsPositionLocation, new Float32Array(positions))
		this.gl.uniform3fv(this.spotlightsDirectionLocation, new Float32Array(directions))
		this.gl.uniform4fv(this.spotlightsColorLocation, new Float32Array(colors))
	}

	static async loadAll() {
		await Promise.all(Shader.shaderPromises)
	}
}

const includeCache: Map<string, string> = new Map()

async function parseShaderInclude(shaderSrc: string): Promise<string> {
	const lines = shaderSrc.split('\n')
	for (let i in lines) {
		let line = lines[i].trim()
		if (line.startsWith('#include')) {
			const fileName = line.match(/#include "([(A-Za-z0-9-_\.)]+)"/)[1]
			if (!includeCache.has(fileName)) {
				includeCache.set(fileName, await (await fetch(`/assets/shaders/${fileName}`)).text())
			}
			lines[i] = includeCache.get(fileName)
		}
	}
	return lines.join('\n')
}
