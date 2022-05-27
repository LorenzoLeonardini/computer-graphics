import { Shader } from './Shader'
import { Texture } from './Texture'

export class TerrainShader extends Shader {
	blendMapTexture: Texture
	baseTexture: Texture
	redTexture: Texture
	greenTexture: Texture
	blueTexture: Texture

	baseNormalTexture: Texture
	redNormalTexture: Texture
	greenNormalTexture: Texture
	blueNormalTexture: Texture

	baseRoughnessTexture: Texture
	redRoughnessTexture: Texture
	greenRoughnessTexture: Texture
	blueRoughnessTexture: Texture

	blendMapTexLocation: WebGLUniformLocation
	baseTexLocation: WebGLUniformLocation
	redTexLocation: WebGLUniformLocation
	greenTexLocation: WebGLUniformLocation
	blueTexLocation: WebGLUniformLocation

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
		super(gl, '/assets/shaders/terrainVertex.glsl', '/assets/shaders/terrainFragment.glsl')
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

		this.gl.uniform1i(this.blendMapTexLocation, 0)
		this.gl.uniform1iv(this.baseTexLocation, [1, 5, 9])
		this.gl.uniform1iv(this.redTexLocation, [2, 6, 10])
		this.gl.uniform1iv(this.greenTexLocation, [3, 7, 11])
		this.gl.uniform1iv(this.blueTexLocation, [4, 8, 12])
		this.textureCount = 13
	}

	loadParameters(): void {
		this.blendMapTexture.bind(this.gl, 0)
		this.baseTexture.bind(this.gl, 1)
		this.redTexture.bind(this.gl, 2)
		this.greenTexture.bind(this.gl, 3)
		this.blueTexture.bind(this.gl, 4)
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
