import { Shader } from './Shader'
import { Texture } from './Texture'

export class TerrainShader extends Shader {
	blendMapTexture: Texture
	baseTexture: Texture
	redTexture: Texture
	greenTexture: Texture
	blueTexture: Texture

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
		blueTexture: Texture
	) {
		super(gl, '/assets/shaders/terrainVertex.glsl', '/assets/shaders/terrainFragment.glsl')
		this.blendMapTexture = blendMapTexture
		this.baseTexture = baseTexture
		this.redTexture = redTexture
		this.greenTexture = greenTexture
		this.blueTexture = blueTexture
	}

	protected async _init() {
		await super._init()

		this.blendMapTexLocation = this.gl.getUniformLocation(this.program, 'uBlendMapTexture')
		this.baseTexLocation = this.gl.getUniformLocation(this.program, 'uBaseTexture')
		this.redTexLocation = this.gl.getUniformLocation(this.program, 'uRedTexture')
		this.greenTexLocation = this.gl.getUniformLocation(this.program, 'uGreenTexture')
		this.blueTexLocation = this.gl.getUniformLocation(this.program, 'uBlueTexture')
	}

	bind() {
		super.bind()

		this.gl.uniform1i(this.blendMapTexLocation, 0)
		this.gl.uniform1i(this.baseTexLocation, 1)
		this.gl.uniform1i(this.redTexLocation, 2)
		this.gl.uniform1i(this.greenTexLocation, 3)
		this.gl.uniform1i(this.blueTexLocation, 4)
	}

	loadParameters(): void {
		this.blendMapTexture.bind(this.gl, 0)
		this.baseTexture.bind(this.gl, 1)
		this.redTexture.bind(this.gl, 2)
		this.greenTexture.bind(this.gl, 3)
		this.blueTexture.bind(this.gl, 4)
	}
}
