import { Shader } from './Shader'
import { glCall } from './Utils'
import { Vector3 } from './Vector'

export class FlatShader extends Shader {
	color: Vector3
	colorUniformLocation: WebGLUniformLocation

	constructor(gl: WebGL2RenderingContext, color: Vector3) {
		super(gl, '/assets/shaders/flatVertex.glsl', '/assets/shaders/flatFragment.glsl')
		this.color = color
	}

	protected async _init() {
		await super._init()

		this.colorUniformLocation = glCall(this.gl, this.gl.getUniformLocation, this.program, 'uColor')
	}

	loadParameters(): void {
		glCall(this.gl, this.gl.uniform3fv, this.colorUniformLocation, this.color)
	}
}
