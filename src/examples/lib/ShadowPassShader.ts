import { Shader } from './Shader'

export class ShadowPassShader extends Shader {
	constructor(gl: WebGL2RenderingContext) {
		super(gl, '/assets/shaders/shadowPassVertex.glsl', '/assets/shaders/shadowPassFragment.glsl')
	}
}
