import { Shader } from './Shader'

export class NormalsShader extends Shader {
	constructor(gl: WebGL2RenderingContext) {
		super(gl, '/assets/shaders/normalsVertex.glsl', '/assets/shaders/normalsFragment.glsl')
	}
}
