import { EntityInterface } from './Entity'
import { InputHandler } from './InputHandler'
import { Matrix4 } from './Matrix'
import { Vector3, Vector4 } from './Vector'

export class Camera {
	private uid: number
	private static IDS: number = 0

	private perspective: Matrix4
	private view: Matrix4
	frame: Matrix4 = new Matrix4()
	frameChanged: boolean = false

	public constructor(yfov: number, aspectRatio: number, nearPlane: number, farPlane: number) {
		this.uid = Camera.IDS++

		this.perspective = Matrix4.perspective(yfov, aspectRatio, nearPlane, farPlane)
	}

	public position(x: number, y: number, z: number): void {
		this.frame[12] = x
		this.frame[13] = y
		this.frame[14] = z
		this.frameChanged = true
	}

	public move(x: number, y: number, z: number): void {
		this.frame[12] += x
		this.frame[13] += y
		this.frame[14] += z
		this.frameChanged = true
	}

	public lookAt(pos: Vector3): void {
		let zDir = this.frame.col(3).xyz().sub(pos).normalize()
		let up = new Vector3(0, 1, 0)
		let xDir = up.cross(zDir).normalize()
		let yDir = zDir.cross(xDir).normalize()

		this.frame[0] = xDir[0]
		this.frame[1] = xDir[1]
		this.frame[2] = xDir[2]

		this.frame[4] = yDir[0]
		this.frame[5] = yDir[1]
		this.frame[6] = yDir[2]

		this.frame[8] = zDir[0]
		this.frame[9] = zDir[1]
		this.frame[10] = zDir[2]
		this.frameChanged = true
	}

	public forward(step: number): void {
		const direction = new Vector3(this.frame[8], 0, this.frame[10])
		direction.normalize()
		direction.mul(step)
		this.frame[12] += direction[0]
		this.frame[14] += direction[2]
		this.frameChanged = true
	}

	public zoom(step: number): void {
		const direction = new Vector3(this.frame[8], this.frame[9], this.frame[10])
		direction.normalize()
		direction.mul(step)
		this.frame[12] += direction[0]
		this.frame[13] += direction[1]
		this.frame[14] += direction[2]
		this.frameChanged = true
	}

	public rotateYAround(point: Vector3, angle: number): void {
		if (angle === 0) return

		const distance = this.frame.col(3).xyz().sub(point).getLength()

		const position: Vector4 = Matrix4.rotate(new Vector3(0, angle, 0)).mul(
			new Vector4(0, 0, distance, 1)
		)
		const newPosition: Vector4 = this.frame.mul(position.sub(new Vector4(0, 0, distance, 0)))

		this.frame[12] = newPosition[0]
		this.frame[13] = newPosition[1]
		this.frame[14] = newPosition[2]
		this.frameChanged = true
	}

	public rotateXAround(point: Vector3, angle: number): void {
		if (angle === 0) return

		const distance = this.frame.col(3).xyz().sub(point).getLength()

		const position: Vector4 = Matrix4.rotate(new Vector3(angle, 0, 0)).mul(
			new Vector4(0, 0, distance, 1)
		)
		const newPosition: Vector4 = this.frame.mul(position.sub(new Vector4(0, 0, distance, 0)))

		this.frame[12] = newPosition[0]
		this.frame[13] = newPosition[1]
		this.frame[14] = newPosition[2]
		this.frameChanged = true
	}

	private viewMatrix(): Matrix4 {
		return this.frame.inverse()
	}

	public getPerspectiveMatrix(): Matrix4 {
		return this.perspective
	}

	public getViewMatrix(): Matrix4 {
		if (this.frameChanged) {
			this.frameChanged = false

			let axis = new Vector3(this.frame[0], this.frame[1], this.frame[2]).normalize()
			this.frame[0] = axis[0]
			this.frame[1] = axis[1]
			this.frame[2] = axis[2]

			axis = new Vector3(this.frame[4], this.frame[5], this.frame[6]).normalize()
			this.frame[4] = axis[0]
			this.frame[5] = axis[1]
			this.frame[6] = axis[2]

			axis = new Vector3(this.frame[8], this.frame[9], this.frame[10]).normalize()
			this.frame[8] = axis[0]
			this.frame[9] = axis[1]
			this.frame[10] = axis[2]

			this.view = this.viewMatrix()
		}
		return this.view
	}

	public handleInput(inputHandler: InputHandler): void {}
	public update(delta: number): void {}
	public consumesInput(): boolean {
		return false
	}
}
