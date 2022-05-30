import { DirectionalLight } from './DirectionalLight'
import { showErrorModal } from './ErrorModal'
import { Matrix4 } from './Matrix'
import { Spotlight } from './Spotlight'
import { Texture } from './Texture'

export class Shader {
	protected vertexShader: WebGLShader
	protected fragmentShader: WebGLShader
	protected program: WebGLProgram
	protected vertexPath: string
	protected fragmentPath: string
	protected vertexSrc: string
	protected fragmentSrc: string
	protected gl: WebGL2RenderingContext

	private projectionMatUniformLocation: WebGLUniformLocation
	private viewMatUniformLocation: WebGLUniformLocation
	private objMatUniformLocation: WebGLUniformLocation

	private directionalLightsCountLocation: WebGLUniformLocation
	private directionalLightsDirectionLocation: WebGLUniformLocation
	private directionalLightsColorLocation: WebGLUniformLocation

	private spotlightsCountLocation: WebGLUniformLocation
	private spotlightsPositionLocation: WebGLUniformLocation
	private spotlightsDirectionLocation: WebGLUniformLocation
	private spotlightsColorLocation: WebGLUniformLocation

	private projectingLightsMatLocation: WebGLUniformLocation
	private projectingLightTextureLocation: WebGLUniformLocation
	private projectingLightsDepthTextureLocation: WebGLUniformLocation

	private sunMatLocation: WebGLUniformLocation
	private sunDepthTextureLocation: WebGLUniformLocation

	public lastFrameUniformLoaded: number = 0

	protected textureCount: number = 0

	private static shaderPromises = []
	private static programCache: Map<string, Promise<WebGLProgram>> = new Map()

	protected constructor(gl: WebGL2RenderingContext, vertexPath: string, fragmentPath: string) {
		this.gl = gl
		this.vertexPath = vertexPath
		this.fragmentPath = fragmentPath

		Shader.shaderPromises.push(this._init())
	}

	protected async _init(): Promise<void> {
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
				if (message_link.length > 0 && message_vs.length == 0 && message_fs.length == 0) {
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

		this.projectingLightsMatLocation = this.getLocation('uProjectingLightsMat')
		this.projectingLightTextureLocation = this.getLocation('uProjectingLightTexture')
		this.projectingLightsDepthTextureLocation = this.getLocation('uProjectingLightDepthTexture')

		this.sunMatLocation = this.getLocation('uSunMat')
		this.sunDepthTextureLocation = this.getLocation('uSunDepthTexture')
	}

	public getLocation(name: string): WebGLUniformLocation {
		return this.gl.getUniformLocation(this.program, name)
	}

	public bind() {
		if (!this.program) {
			throw new Error("Don't forget to init the shader")
		}
		this.gl.useProgram(this.program)
	}

	public loadParameters() {}

	public loadPerspective(perspective: Matrix4) {
		this.gl.uniformMatrix4fv(this.projectionMatUniformLocation, false, perspective)
	}

	public loadView(viewMatrix: Matrix4) {
		this.gl.uniformMatrix4fv(this.viewMatUniformLocation, false, viewMatrix)
	}

	public loadObjectMatrix(objectMatrix: Matrix4) {
		this.gl.uniformMatrix4fv(this.objMatUniformLocation, false, objectMatrix)
	}

	public loadDirectionalLights(lights: DirectionalLight[]) {
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
		this.gl.uniform3fv(this.directionalLightsColorLocation, new Float32Array(colors))
	}

	public loadSpotlights(lights: Spotlight[]) {
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
		this.gl.uniform3fv(this.spotlightsColorLocation, new Float32Array(colors))
	}

	public loadProjectingLights(matrices: Matrix4[], texture: Texture) {
		if (
			this.projectingLightsMatLocation === null ||
			this.projectingLightTextureLocation === null ||
			!texture
		) {
			return
		}
		if (matrices.length > 2) {
			throw new Error('Maximum two projecting lights')
		}
		const m = []
		matrices.forEach((mat) => {
			m.push(...mat)
		})
		this.gl.uniformMatrix4fv(this.projectingLightsMatLocation, false, m)
		this.gl.uniform1i(this.projectingLightTextureLocation, this.textureCount)
		texture.bind(this.gl, this.textureCount)
	}

	public loadProjectingLightsDepthTextures(depthTextures: Texture[]) {
		if (this.projectingLightsDepthTextureLocation === null) {
			return
		}
		if (depthTextures.length > 2) {
			throw new Error('Maximum two projecting lights')
		}

		let baseTextureUnit = this.textureCount
		if (this.projectingLightsMatLocation !== null && this.projectingLightTextureLocation !== null) {
			baseTextureUnit += 1
		}

		this.gl.uniform1iv(this.projectingLightsDepthTextureLocation, [
			baseTextureUnit,
			baseTextureUnit + 1
		])
		depthTextures.forEach((texture, i) => texture.bind(this.gl, baseTextureUnit + i))
	}

	public loadSun(matrix: Matrix4, depthTexture: Texture) {
		if (this.sunMatLocation === null || this.sunDepthTextureLocation === null) {
			return
		}

		let baseTextureUnit = this.textureCount
		if (this.projectingLightsMatLocation !== null && this.projectingLightTextureLocation !== null) {
			baseTextureUnit += 1
		}
		if (this.projectingLightsDepthTextureLocation !== null) {
			baseTextureUnit += 2
		}

		this.gl.uniformMatrix4fv(this.sunMatLocation, false, matrix)

		this.gl.uniform1i(this.sunDepthTextureLocation, baseTextureUnit)
		depthTexture.bind(this.gl, baseTextureUnit)
	}

	public static async loadAll() {
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
