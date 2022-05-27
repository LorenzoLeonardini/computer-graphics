import { Vector3, Vector4 } from './Vector'

export class DirectionalLight {
	private direction: Vector3
	private color: Vector4

	public constructor(direction: Vector3, color: Vector4) {
		this.direction = direction
		this.color = color
	}

	public getDirection() {
		return this.direction
	}

	public getColor() {
		return this.color
	}

	public setDirection(direction: Vector3) {
		this.direction = direction
	}

	public setColor(color: Vector4) {
		this.color = color
	}
}
