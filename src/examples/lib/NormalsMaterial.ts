import { Material } from './Material'

export class NormalsMaterial extends Material {
	constructor(gl: WebGLRenderingContext) {
		super()

		this.fragmentSrc = `vec3 color = (vNormal + vec3(1.0, 1.0, 1.0)) * 0.5;`
		this.gl_FragColor = 'vec4(color, 1.0)'
		super.create(gl)
	}
}
