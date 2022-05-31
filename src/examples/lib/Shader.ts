import { DirectionalLight } from './DirectionalLight'
import { showErrorModal } from './ErrorModal'
import { Matrix4 } from './Matrix'
import { Spotlight } from './Spotlight'
import { Texture } from './Texture'

export class Shader {
	protected gl: WebGL2RenderingContext

	protected vertexShader: WebGLShader
	protected fragmentShader: WebGLShader
	protected program: WebGLProgram

	protected vertexPath: string
	protected fragmentPath: string
	protected vertexSrc: string
	protected fragmentSrc: string

	private __uProjectionMat: WebGLUniformLocation
	private __uViewMat: WebGLUniformLocation
	private __uObjectMat: WebGLUniformLocation

	private __uDirectionalLightsCount: WebGLUniformLocation
	private __uDirectionalLightsDirection: WebGLUniformLocation
	private __uDirectionalLightsColor: WebGLUniformLocation

	private __uSpotlightsCount: WebGLUniformLocation
	private __uSpotlightsPosition: WebGLUniformLocation
	private __uSpotlightsDirection: WebGLUniformLocation
	private __uSpotlightsColor: WebGLUniformLocation

	private __uProjectingLightsMat: WebGLUniformLocation
	private __uProjectingLightTexture: WebGLUniformLocation
	private __uProjectingLightDepthTexture: WebGLUniformLocation

	private __uSunMat: WebGLUniformLocation
	private __uSunDepthTexture: WebGLUniformLocation

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

		this.__uProjectionMat = this.getLocation('uProjectionMat')
		this.__uViewMat = this.getLocation('uViewMat')
		this.__uObjectMat = this.getLocation('uObjectMat')

		this.__uDirectionalLightsCount = this.getLocation('uDirectionalLightsCount')
		this.__uDirectionalLightsDirection = this.getLocation('uDirectionalLightsDirection')
		this.__uDirectionalLightsColor = this.getLocation('uDirectionalLightsColor')
		if (this.__uDirectionalLightsCount) {
			this.gl.uniform1i(this.__uDirectionalLightsCount, 0)
		}

		this.__uSpotlightsCount = this.getLocation('uSpotlightsCount')
		this.__uSpotlightsPosition = this.getLocation('uSpotlightsPosition')
		this.__uSpotlightsDirection = this.getLocation('uSpotlightsDirection')
		this.__uSpotlightsColor = this.getLocation('uSpotlightsColor')
		if (this.__uSpotlightsCount) {
			this.gl.uniform1i(this.__uSpotlightsCount, 0)
		}

		this.__uProjectingLightsMat = this.getLocation('uProjectingLightsMat')
		this.__uProjectingLightTexture = this.getLocation('uProjectingLightTexture')
		this.__uProjectingLightDepthTexture = this.getLocation('uProjectingLightDepthTexture')

		this.__uSunMat = this.getLocation('uSunMat')
		this.__uSunDepthTexture = this.getLocation('uSunDepthTexture')
	}

	protected getLocation(name: string): WebGLUniformLocation {
		return this.gl.getUniformLocation(this.program, name)
	}

	public bind() {
		if (!this.program) {
			throw new Error("Don't forget to init the shader")
		}
		this.gl.useProgram(this.program)
	}

	public loadParameters() {}

	public loadPerspectiveMatrix(perspective: Matrix4) {
		this.gl.uniformMatrix4fv(this.__uProjectionMat, false, perspective)
	}

	public loadViewMatrix(viewMatrix: Matrix4) {
		this.gl.uniformMatrix4fv(this.__uViewMat, false, viewMatrix)
	}

	public loadObjectMatrix(objectMatrix: Matrix4) {
		this.gl.uniformMatrix4fv(this.__uObjectMat, false, objectMatrix)
	}

	public loadDirectionalLights(lights: DirectionalLight[]) {
		if (this.__uDirectionalLightsCount === null) {
			return
		}
		this.gl.uniform1i(this.__uDirectionalLightsCount, lights.length)
		if (lights.length === 0) {
			return
		}
		const directions = []
		const colors = []
		lights.forEach((light) => {
			directions.push(...light.getDirection())
			colors.push(...light.getColor())
		})
		this.gl.uniform3fv(this.__uDirectionalLightsDirection, new Float32Array(directions))
		this.gl.uniform3fv(this.__uDirectionalLightsColor, new Float32Array(colors))
	}

	public loadSpotlights(lights: Spotlight[]) {
		if (this.__uSpotlightsCount === null) {
			return
		}
		this.gl.uniform1i(this.__uSpotlightsCount, lights.length)
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
		this.gl.uniform3fv(this.__uSpotlightsPosition, new Float32Array(positions))
		this.gl.uniform3fv(this.__uSpotlightsDirection, new Float32Array(directions))
		this.gl.uniform3fv(this.__uSpotlightsColor, new Float32Array(colors))
	}

	public loadProjectingLights(matrices: Matrix4[], texture: Texture) {
		if (
			this.__uProjectingLightsMat === null ||
			this.__uProjectingLightTexture === null ||
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
		this.gl.uniformMatrix4fv(this.__uProjectingLightsMat, false, m)
		this.gl.uniform1i(this.__uProjectingLightTexture, this.textureCount)
		texture.bind(this.gl, this.textureCount)
	}

	public loadProjectingLightsDepthTextures(depthTextures: Texture[]) {
		if (this.__uProjectingLightDepthTexture === null) {
			return
		}
		if (depthTextures.length > 2) {
			throw new Error('Maximum two projecting lights')
		}

		let baseTextureUnit = this.textureCount
		if (this.__uProjectingLightsMat !== null && this.__uProjectingLightTexture !== null) {
			baseTextureUnit += 1
		}

		this.gl.uniform1iv(this.__uProjectingLightDepthTexture, [baseTextureUnit, baseTextureUnit + 1])
		depthTextures.forEach((texture, i) => texture.bind(this.gl, baseTextureUnit + i))
	}

	public loadSun(matrix: Matrix4, depthTexture: Texture) {
		if (this.__uSunMat === null || this.__uSunDepthTexture === null) {
			return
		}

		let baseTextureUnit = this.textureCount
		if (this.__uProjectingLightsMat !== null && this.__uProjectingLightTexture !== null) {
			baseTextureUnit += 1
		}
		if (this.__uProjectingLightDepthTexture !== null) {
			baseTextureUnit += 2
		}

		this.gl.uniformMatrix4fv(this.__uSunMat, false, matrix)

		this.gl.uniform1i(this.__uSunDepthTexture, baseTextureUnit)
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
