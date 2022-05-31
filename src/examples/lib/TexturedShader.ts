import { Shader } from './Shader'
import { Texture } from './Texture'

export class TexturedShader extends Shader {
	private texture: Texture
	private normalMap: Texture
	private roughnessMap: Texture

	private __uTexture: WebGLUniformLocation
	private __uNormalMap: WebGLUniformLocation | undefined
	private __uRoughnessMap: WebGLUniformLocation | undefined

	private __uHasNormalMap: WebGLUniformLocation
	private __uHasRoughnessMap: WebGLUniformLocation

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

	protected async _init(): Promise<void> {
		await super._init()

		this.__uTexture = this.getLocation('uTexture')
		this.__uNormalMap = this.getLocation('uNormalMap')
		this.__uRoughnessMap = this.getLocation('uRoughnessMap')

		this.__uHasNormalMap = this.getLocation('uHasNormalMap')
		this.__uHasRoughnessMap = this.getLocation('uHasRoughnessMap')

		this.gl.uniform1i(this.__uHasNormalMap, this.normalMap !== undefined ? 1 : 0)
		this.gl.uniform1i(this.__uHasRoughnessMap, this.roughnessMap !== undefined ? 1 : 0)

		this.gl.uniform1i(this.__uTexture, 0)
		this.textureCount++
		if (this.normalMap) {
			this.gl.uniform1i(this.__uNormalMap, 1)
			this.textureCount++
		}
		if (this.roughnessMap) {
			this.gl.uniform1i(this.__uRoughnessMap, 2)
			this.textureCount++
		}
	}

	public loadParameters(): void {
		this.texture.bind(this.gl, 0)
		this.normalMap?.bind(this.gl, 1)
		this.roughnessMap?.bind(this.gl, 2)
	}
}
