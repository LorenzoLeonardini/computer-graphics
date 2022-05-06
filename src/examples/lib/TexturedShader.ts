import { Shader } from './Shader'
import { Texture } from './Texture'
import { glCall } from './Utils'

export class TexturedShader extends Shader {
	texture: Texture

	textureSamplerLocation: WebGLUniformLocation

	constructor(gl: WebGL2RenderingContext, texture: Texture) {
		super(gl, '/assets/shaders/texturedVertex.glsl', '/assets/shaders/texturedFragment.glsl')
		this.texture = texture
	}

	protected async _init() {
		await super._init()

		this.textureSamplerLocation = glCall(
			this.gl,
			this.gl.getUniformLocation,
			this.program,
			'uTexture'
		)
	}

	bind() {
		super.bind()
		glCall(this.gl, this.gl.uniform1i, this.textureSamplerLocation, 0)
		this.texture.bind(this.gl)
	}
}
