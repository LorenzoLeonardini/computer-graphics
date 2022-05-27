import { Shader } from './Shader'
import { Texture } from './Texture'

export class TexturedShader extends Shader {
	texture: Texture
	normalMap: Texture
	roughnessMap: Texture

	textureSamplerLocation: WebGLUniformLocation
	normalSamplerLocation: WebGLUniformLocation | undefined
	roughnessSamplerLocation: WebGLUniformLocation | undefined

	hasNormalMap: WebGLUniformLocation
	hasRoughnessMap: WebGLUniformLocation

	constructor(
		gl: WebGL2RenderingContext,
		texture: Texture,
		normalMap?: Texture,
		roughnessMap?: Texture
	) {
		super(gl, '/assets/shaders/texturedVertex.glsl', '/assets/shaders/texturedFragment.glsl')
		this.texture = texture
		this.normalMap = normalMap
		this.roughnessMap = roughnessMap
	}

	protected async _init() {
		await super._init()

		this.textureSamplerLocation = this.gl.getUniformLocation(this.program, 'uTexture')
		this.normalSamplerLocation = this.gl.getUniformLocation(this.program, 'uNormalMap')
		this.roughnessSamplerLocation = this.gl.getUniformLocation(this.program, 'uRoughnessMap')

		this.hasNormalMap = this.gl.getUniformLocation(this.program, 'uHasNormalMap')
		this.hasRoughnessMap = this.gl.getUniformLocation(this.program, 'uHasRoughnessMap')

		this.gl.uniform1i(this.hasNormalMap, this.normalMap !== undefined ? 1 : 0)
		this.gl.uniform1i(this.hasRoughnessMap, this.roughnessMap !== undefined ? 1 : 0)

		this.gl.uniform1i(this.textureSamplerLocation, 0)
		this.textureCount++
		if (this.normalMap) {
			this.gl.uniform1i(this.normalSamplerLocation, 1)
			this.textureCount++
		}
		if (this.roughnessMap) {
			this.gl.uniform1i(this.roughnessSamplerLocation, 2)
			this.textureCount++
		}
	}

	loadParameters(): void {
		this.texture.bind(this.gl, 0)
		this.normalMap?.bind(this.gl, 1)
		this.roughnessMap?.bind(this.gl, 2)
	}
}
