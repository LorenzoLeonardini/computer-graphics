import { loadImage } from './Utils'

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

		this.texture = gl.createTexture()
		gl.bindTexture(gl.TEXTURE_2D, this.texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

		var anisotropicFiltering =
			gl.getExtension('EXT_texture_filter_anisotropic') ||
			gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
			gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
		if (anisotropicFiltering) {
			var max = gl.getParameter(anisotropicFiltering.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
			gl.texParameterf(
				gl.TEXTURE_2D,
				anisotropicFiltering.TEXTURE_MAX_ANISOTROPY_EXT,
				Math.min(4, max)
			)
		}

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
		gl.generateMipmap(gl.TEXTURE_2D)
	}

	bind(gl: WebGL2RenderingContext, textureUnit: number = 0) {
		gl.activeTexture(gl.TEXTURE0 + textureUnit)
		gl.bindTexture(gl.TEXTURE_2D, this.texture)
	}

	unbind(gl: WebGL2RenderingContext, textureUnit: number = 0) {
		gl.activeTexture(gl.TEXTURE0 + textureUnit)
		gl.bindTexture(gl.TEXTURE_2D, null)
	}

	static async loadAll() {
		await Promise.all(Texture.imageElementPromises)
	}
}
