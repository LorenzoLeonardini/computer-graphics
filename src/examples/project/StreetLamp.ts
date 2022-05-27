import { Entity } from '../lib/Entity'
import { Matrix4 } from '../lib/Matrix'
import { Model } from '../lib/Model'
import { Shader } from '../lib/Shader'
import { Spotlight } from '../lib/Spotlight'
import { Vector3, Vector4 } from '../lib/Vector'

export class StreetLamp extends Entity {
	private static lampModel: Model
	private static shader: Shader
	private static lightRelativePosition: Vector4
	private light: Spotlight

	public static setUpModel(lampModel: Model, shader: Shader, lightRelativePosition: Vector3) {
		StreetLamp.lampModel = lampModel
		StreetLamp.shader = shader
		StreetLamp.lightRelativePosition = new Vector4(
			lightRelativePosition[0],
			lightRelativePosition[1],
			lightRelativePosition[2],
			1
		)
	}

	constructor() {
		if (!StreetLamp.lampModel || !StreetLamp.shader || !StreetLamp.lightRelativePosition) {
			throw new Error('Street light not set up')
		}
		super(StreetLamp.lampModel, StreetLamp.shader)
		this.light = new Spotlight(
			new Vector3(
				StreetLamp.lightRelativePosition[0],
				StreetLamp.lightRelativePosition[1],
				StreetLamp.lightRelativePosition[2]
			),
			new Vector3(0, -1, 0),
			new Vector4(1, 0.753, 0.128, 1)
		)
		this.setScale(0.8)
		this.needsUpdating = true
	}

	protected updateMatrix(): Matrix4 {
		const matrix = super.updateMatrix()
		const lightPosition = matrix.mul(StreetLamp.lightRelativePosition)
		this.light.setPosition(new Vector3(lightPosition[0], lightPosition[1], lightPosition[2]))
		return matrix
	}

	public getLight(): Spotlight {
		return this.light
	}
}
