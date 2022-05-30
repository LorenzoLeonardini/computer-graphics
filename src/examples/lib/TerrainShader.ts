import { Shader } from './Shader'
import { Texture } from './Texture'

export class TerrainShader extends Shader {
	private blendMapTexture: Texture
	private baseTexture: Texture
	private redTexture: Texture
	private greenTexture: Texture
	private blueTexture: Texture

	private baseNormalTexture: Texture
	private redNormalTexture: Texture
	private greenNormalTexture: Texture
	private blueNormalTexture: Texture

	private baseRoughnessTexture: Texture
	private redRoughnessTexture: Texture
	private greenRoughnessTexture: Texture
	private blueRoughnessTexture: Texture

	private blendMapTexLocation: WebGLUniformLocation
	private baseTexLocation: WebGLUniformLocation
	private redTexLocation: WebGLUniformLocation
	private greenTexLocation: WebGLUniformLocation
	private blueTexLocation: WebGLUniformLocation

	private strippedDown: boolean

	constructor(
		gl: WebGL2RenderingContext,
		blendMapTexture: Texture,
		baseTexture: Texture,
		redTexture: Texture,
		greenTexture: Texture,
		blueTexture: Texture,
		baseNormalTexture: Texture,
		redNormalTexture: Texture,
		greenNormalTexture: Texture,
		blueNormalTexture: Texture,
		baseRoughnessTexture: Texture,
		redRoughnessTexture: Texture,
		greenRoughnessTexture: Texture,
		blueRoughnessTexture: Texture
	) {
		const strippedDown = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) < 16
		if (strippedDown) {
			console.log('GPU has not enough texture units, fallbacking to simpler terrain')
			super(
				gl,
				'/assets/shaders/terrainVertex.glsl',
				'/assets/shaders/terrainFragmentStripped.glsl'
			)
		} else {
			super(gl, '/assets/shaders/terrainVertex.glsl', '/assets/shaders/terrainFragment.glsl')
		}
		this.strippedDown = strippedDown

		this.blendMapTexture = blendMapTexture
		this.baseTexture = baseTexture
		this.redTexture = redTexture
		this.greenTexture = greenTexture
		this.blueTexture = blueTexture

		this.baseNormalTexture = baseNormalTexture
		this.redNormalTexture = redNormalTexture
		this.greenNormalTexture = greenNormalTexture
		this.blueNormalTexture = blueNormalTexture

		this.baseRoughnessTexture = baseRoughnessTexture
		this.redRoughnessTexture = redRoughnessTexture
		this.greenRoughnessTexture = greenRoughnessTexture
		this.blueRoughnessTexture = blueRoughnessTexture
	}

	protected async _init() {
		await super._init()

		this.blendMapTexLocation = this.gl.getUniformLocation(this.program, 'uBlendMapTexture')
		this.baseTexLocation = this.gl.getUniformLocation(this.program, 'uBaseTexture')
		this.redTexLocation = this.gl.getUniformLocation(this.program, 'uRedTexture')
		this.greenTexLocation = this.gl.getUniformLocation(this.program, 'uGreenTexture')
		this.blueTexLocation = this.gl.getUniformLocation(this.program, 'uBlueTexture')

		if (this.strippedDown) {
			this.gl.uniform1i(this.blendMapTexLocation, 0)
			this.gl.uniform1i(this.baseTexLocation, 1)
			this.gl.uniform1i(this.redTexLocation, 2)
			this.gl.uniform1i(this.greenTexLocation, 3)
			this.gl.uniform1i(this.blueTexLocation, 4)
			this.textureCount = 5
		} else {
			this.gl.uniform1i(this.blendMapTexLocation, 0)
			this.gl.uniform1iv(this.baseTexLocation, [1, 5, 9])
			this.gl.uniform1iv(this.redTexLocation, [2, 6, 10])
			this.gl.uniform1iv(this.greenTexLocation, [3, 7, 11])
			this.gl.uniform1iv(this.blueTexLocation, [4, 8, 12])
			this.textureCount = 13
		}
	}

	loadParameters(): void {
		this.blendMapTexture.bind(this.gl, 0)
		this.baseTexture.bind(this.gl, 1)
		this.redTexture.bind(this.gl, 2)
		this.greenTexture.bind(this.gl, 3)
		this.blueTexture.bind(this.gl, 4)
		if (!this.strippedDown) {
			this.baseNormalTexture.bind(this.gl, 5)
			this.redNormalTexture.bind(this.gl, 6)
			this.greenNormalTexture.bind(this.gl, 7)
			this.blueNormalTexture.bind(this.gl, 8)
			this.baseRoughnessTexture.bind(this.gl, 9)
			this.redRoughnessTexture.bind(this.gl, 10)
			this.greenRoughnessTexture.bind(this.gl, 11)
			this.blueRoughnessTexture.bind(this.gl, 12)
		}
	}
}
