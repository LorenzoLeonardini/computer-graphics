import { glCall, loadImage } from './Utils'

export class Texture {
	gl: WebGL2RenderingContext
	texture: WebGLTexture
	imagePath: string

	static imageElementPromises = []

	constructor(gl: WebGL2RenderingContext, imagePath: string) {
		this.gl = gl
		this.imagePath = imagePath

		Texture.imageElementPromises.push(this._init())
	}

	async _init() {
		const image = await loadImage(this.imagePath)
		const gl = this.gl

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

	static async loadAll() {
		await Promise.all(Texture.imageElementPromises)
	}
}
