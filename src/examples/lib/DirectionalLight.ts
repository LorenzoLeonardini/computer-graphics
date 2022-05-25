export class DirectionalLight {
	public readonly direction: [number, number, number]
	public readonly color: [number, number, number, number]

	public constructor(direction, color) {
		this.direction = direction
		this.color = color
	}
}
