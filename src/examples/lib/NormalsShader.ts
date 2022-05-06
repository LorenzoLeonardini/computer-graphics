import { Shader } from './Shader'

export class NormalsShader extends Shader {
	constructor(gl: WebGL2RenderingContext) {
		super()
		this.gl = gl
	}

	async _init(): Promise<NormalsShader> {
		this.vertexSrc = await (await fetch('/assets/shaders/normalsVertex.glsl')).text()
		this.fragmentSrc = await (await fetch('/assets/shaders/normalsFragment.glsl')).text()

		await super._init(this.gl)
		return this
	}
}
