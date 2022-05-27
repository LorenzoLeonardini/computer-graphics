import { Vector3, Vector4 } from './Vector'

export class Spotlight {
	private position: Vector3
	private direction: Vector3
	private color: Vector4

	public constructor(position: Vector3, direction: Vector3, color: Vector4) {
		this.position = position
		this.direction = direction
		this.color = color
	}

	public getPosition(): Vector3 {
		return this.position
	}

	public getDirection() {
		return this.direction
	}

	public getColor() {
		return this.color
	}

	public setPosition(position: Vector3) {
		this.position = position
	}

	public setDirection(direction: Vector3) {
		this.direction = direction
	}

	public setColor(color: Vector4) {
		this.color = color
	}
}
