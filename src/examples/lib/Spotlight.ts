import { Vector3 } from './Vector'

export class Spotlight {
	private position: Vector3
	private direction: Vector3
	private color: Vector3

	public constructor(position: Vector3, direction: Vector3, color: Vector3) {
		this.position = position
		this.direction = direction
		this.color = color
	}

	public getPosition(): Vector3 {
		return this.position
	}

	public getDirection(): Vector3 {
		return this.direction
	}

	public getColor(): Vector3 {
		return this.color
	}

	public setPosition(position: Vector3): void {
		this.position = position
	}

	public setDirection(direction: Vector3): void {
		this.direction = direction
	}

	public setColor(color: Vector3): void {
		this.color = color
	}
}
