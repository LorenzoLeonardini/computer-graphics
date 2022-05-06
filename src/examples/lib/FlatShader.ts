import { Shader } from './Shader'
import { glCall } from './Utils'
import { Vector3 } from './Vector'

export class FlatShader extends Shader {
	color: Vector3

	colorUniformLocation: WebGLUniformLocation

	constructor(gl: WebGL2RenderingContext, color: Vector3) {
		super()
		this.color = color
		this.gl = gl
	}

	async _init(): Promise<FlatShader> {
		this.vertexSrc = await (await fetch('/assets/shaders/flatVertex.glsl')).text()
		this.fragmentSrc = await (await fetch('/assets/shaders/flatFragment.glsl')).text()

		await super._init(this.gl)
		this.colorUniformLocation = glCall(this.gl, this.gl.getUniformLocation, this.program, 'uColor')
		glCall(this.gl, this.gl.uniform3fv, this.colorUniformLocation, this.color)

		return this
	}
}
