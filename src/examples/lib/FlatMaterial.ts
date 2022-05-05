import { Material } from './Material'
import { Vector3 } from './Vector'

export class FlatMaterial extends Material {
	constructor(gl: WebGLRenderingContext, color: Vector3) {
		super()

		this.gl_FragColor = `vec4(${color[0].toFixed(2)}, ${color[1].toFixed(2)}, ${color[2].toFixed(
			2
		)}, 1.0)`
		super.create(gl)
	}
}
