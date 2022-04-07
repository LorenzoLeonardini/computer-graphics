import { Material } from './Material'

export class NormalsMaterial extends Material {
	constructor(gl: WebGLRenderingContext) {
		super()

		this.fragmentSrc = `
		vec3 normalizedNormals = (vNormal + vec3(1.0, 1.0, 1.0)) / 2.0;
		`
		this.gl_FragColor = 'vec4(normalizedNormals, 1.0)'
		super.create(gl)
	}
}
