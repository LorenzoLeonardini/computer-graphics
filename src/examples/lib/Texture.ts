import { loadImage } from './Utils'

export class Texture {
	private gl: WebGL2RenderingContext
	public texture: WebGLTexture
	private imagePath: string

	static imageElementPromises = []

	constructor(gl: WebGL2RenderingContext, imagePath: string | null, mipmapping: boolean = true) {
		this.gl = gl
		if (imagePath) {
			this.imagePath = imagePath
			Texture.imageElementPromises.push(this._init(mipmapping))
		}
	}

	public async _init(mipmapping: boolean): Promise<void> {
		const image = await loadImage(this.imagePath)
		const gl = this.gl

		this.texture = gl.createTexture()
		gl.bindTexture(gl.TEXTURE_2D, this.texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

		if (mipmapping) {
			const anisotropicFiltering =
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
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		}
	}

	public bind(gl: WebGL2RenderingContext, textureUnit: number = 0): void {
		gl.activeTexture(gl.TEXTURE0 + textureUnit)
		gl.bindTexture(gl.TEXTURE_2D, this.texture)
	}

	public unbind(gl: WebGL2RenderingContext, textureUnit: number = 0): void {
		gl.activeTexture(gl.TEXTURE0 + textureUnit)
		gl.bindTexture(gl.TEXTURE_2D, null)
	}

	public static async loadAll(): Promise<void> {
		await Promise.all(Texture.imageElementPromises)
	}
}
