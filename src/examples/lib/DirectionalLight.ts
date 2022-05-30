import { Vector3 } from './Vector'

export class DirectionalLight {
	private direction: Vector3
	private color: Vector3

	public constructor(direction: Vector3, color: Vector3) {
		this.direction = direction
		this.color = color
	}

	public getDirection(): Vector3 {
		return this.direction
	}

	public getColor(): Vector3 {
		return this.color
	}

	public setDirection(direction: Vector3): void {
		this.direction = direction
	}

	public setColor(color: Vector3): void {
		this.color = color
	}
}
