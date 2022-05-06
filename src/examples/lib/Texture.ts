import { glCall } from './Utils'

export class Texture {
	texture: WebGLTexture

	constructor(gl: WebGL2RenderingContext, image: HTMLImageElement) {
		this.texture = glCall(gl, gl.createTexture)
		glCall(gl, gl.bindTexture, gl.TEXTURE_2D, this.texture)
		glCall(gl, gl.texImage2D, gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

		glCall(gl, gl.texParameteri, gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
		glCall(gl, gl.texParameteri, gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
		glCall(gl, gl.texParameteri, gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
		glCall(gl, gl.texParameteri, gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

		glCall(gl, gl.generateMipmap, gl.TEXTURE_2D)
	}

	bind(gl: WebGL2RenderingContext, textureUnit: number = 0) {
		glCall(gl, gl.activeTexture, gl.TEXTURE0 + textureUnit)
		glCall(gl, gl.bindTexture, gl.TEXTURE_2D, this.texture)
	}

	unbind(gl: WebGL2RenderingContext, textureUnit: number = 0) {
		glCall(gl, gl.activeTexture, gl.TEXTURE0 + textureUnit)
		glCall(gl, gl.bindTexture, gl.TEXTURE_2D, null)
	}
}
