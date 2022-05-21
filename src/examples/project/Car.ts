import { Cube } from '../lib/Cube'
import { Entity, EntityTree } from '../lib/Entity'
import { FlatShader } from '../lib/FlatShader'
import { Vector3 } from '../lib/Vector'

export class Car extends EntityTree {
	public constructor(gl: WebGL2RenderingContext) {
		let cube = new Cube(gl)
		let carBodyMaterial = new FlatShader(gl, new Vector3(0.8, 0.15, 0.15))

		let carBottomBody = new Entity(cube, carBodyMaterial)
		carBottomBody.setScaleX(0.5)
		carBottomBody.setScaleY(0.25)
		carBottomBody.setScaleZ(0.8)
		carBottomBody.moveY(0.25)

		let carTopBody = new Entity(cube, carBodyMaterial)
		carTopBody.setScaleX(0.5)
		carTopBody.setScaleY(0.15)
		carTopBody.setScaleZ(0.625)
		carTopBody.moveY(0.65)
		carTopBody.moveZ(0.8 - 0.625)

		super([carBottomBody, carTopBody])
		this.setScale(0.15)
	}
}
