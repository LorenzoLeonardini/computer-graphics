import { Shader } from './Shader'
import { Texture } from './Texture'

export class TerrainShader extends Shader {
	private blendMapTexture: Texture
	private base_Tex: Texture
	private r_Tex: Texture
	private g_Tex: Texture
	private b_Tex: Texture

	private base_NormalTex: Texture
	private r_NormalTex: Texture
	private g_NormalTex: Texture
	private b_NormalTex: Texture

	private base_RoughTex: Texture
	private r_RoughTex: Texture
	private g_RoughTex: Texture
	private b_RoughTex: Texture

	private __uBlendMapTexture: WebGLUniformLocation
	private __uBaseTexture: WebGLUniformLocation
	private __uRedTexture: WebGLUniformLocation
	private __uGreenTexture: WebGLUniformLocation
	private __uBlueTexture: WebGLUniformLocation

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
		baseRoughTex: Texture,
		redRoughTex: Texture,
		greenRoughTex: Texture,
		blueRoughTex: Texture
	) {
		const strippedDown = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) < 17
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
		this.base_Tex = baseTexture
		this.r_Tex = redTexture
		this.g_Tex = greenTexture
		this.b_Tex = blueTexture

		this.base_NormalTex = baseNormalTexture
		this.r_NormalTex = redNormalTexture
		this.g_NormalTex = greenNormalTexture
		this.b_NormalTex = blueNormalTexture

		this.base_RoughTex = baseRoughTex
		this.r_RoughTex = redRoughTex
		this.g_RoughTex = greenRoughTex
		this.b_RoughTex = blueRoughTex
	}

	protected async _init(): Promise<void> {
		await super._init()

		this.__uBlendMapTexture = this.getLocation('uBlendMapTexture')
		this.__uBaseTexture = this.getLocation('uBaseTexture')
		this.__uRedTexture = this.getLocation('uRedTexture')
		this.__uGreenTexture = this.getLocation('uGreenTexture')
		this.__uBlueTexture = this.getLocation('uBlueTexture')

		if (this.strippedDown) {
			this.gl.uniform1i(this.__uBlendMapTexture, 0)
			this.gl.uniform1i(this.__uBaseTexture, 1)
			this.gl.uniform1i(this.__uRedTexture, 2)
			this.gl.uniform1i(this.__uGreenTexture, 3)
			this.gl.uniform1i(this.__uBlueTexture, 4)
			this.textureCount = 5
		} else {
			this.gl.uniform1i(this.__uBlendMapTexture, 0)
			this.gl.uniform1iv(this.__uBaseTexture, [1, 5, 9])
			this.gl.uniform1iv(this.__uRedTexture, [2, 6, 10])
			this.gl.uniform1iv(this.__uGreenTexture, [3, 7, 11])
			this.gl.uniform1iv(this.__uBlueTexture, [4, 8, 12])
			this.textureCount = 13
		}
	}

	public loadParameters(): void {
		this.blendMapTexture.bind(this.gl, 0)
		this.base_Tex.bind(this.gl, 1)
		this.r_Tex.bind(this.gl, 2)
		this.g_Tex.bind(this.gl, 3)
		this.b_Tex.bind(this.gl, 4)
		if (!this.strippedDown) {
			this.base_NormalTex.bind(this.gl, 5)
			this.r_NormalTex.bind(this.gl, 6)
			this.g_NormalTex.bind(this.gl, 7)
			this.b_NormalTex.bind(this.gl, 8)
			this.base_RoughTex.bind(this.gl, 9)
			this.r_RoughTex.bind(this.gl, 10)
			this.g_RoughTex.bind(this.gl, 11)
			this.b_RoughTex.bind(this.gl, 12)
		}
	}
}
