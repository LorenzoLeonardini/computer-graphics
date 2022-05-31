import { Shader } from './Shader'
import { Vector3 } from './Vector'

export class FlatShader extends Shader {
	color: Vector3
	__uColor: WebGLUniformLocation

	constructor(gl: WebGL2RenderingContext, color: Vector3) {
		super(gl, '/assets/shaders/flatVertex.glsl', '/assets/shaders/flatFragment.glsl')
		this.color = color
	}

	protected async _init(): Promise<void> {
		await super._init()

		this.__uColor = this.getLocation('uColor')
	}

	public loadParameters(): void {
		this.gl.uniform3fv(this.__uColor, this.color)
	}
}
