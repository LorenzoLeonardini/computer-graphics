export class Spotlight {
	public readonly position: [number, number, number]
	public readonly direction: [number, number, number]
	public readonly color: [number, number, number, number]

	public constructor(position, direction, color) {
		this.position = position
		this.direction = direction
		this.color = color
	}
}
