import { EntityInterface } from './Entity'
import { InputHandler } from './InputHandler'
import { Matrix4 } from './Matrix'
import { Vector3, Vector4 } from './Vector'

export class Camera {
	uid: number
	static IDS: number = 0

	perspective: Matrix4
	view: Matrix4
	frame: Matrix4 = new Matrix4()
	frameChanged: boolean = false

	constructor(yfov: number, aspectRatio: number, nearPlane: number, farPlane: number) {
		this.uid = Camera.IDS++

		this.perspective = Matrix4.perspective(yfov, aspectRatio, nearPlane, farPlane)
	}

	position(x: number, y: number, z: number) {
		this.frame[12] = x
		this.frame[13] = y
		this.frame[14] = z
		this.frameChanged = true
	}

	move(x: number, y: number, z: number) {
		this.frame[12] += x
		this.frame[13] += y
		this.frame[14] += z
		this.frameChanged = true
	}

	lookAt(pos: Vector3) {
		let zDir = new Vector3(this.frame[12], this.frame[13], this.frame[14]).sub(pos).normalize()
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

	forward(step: number) {
		const direction = new Vector3(this.frame[8], 0, this.frame[10])
		direction.normalize()
		direction.mul(step)
		this.frame[12] += direction[0]
		this.frame[14] += direction[2]
		this.frameChanged = true
	}

	zoom(step: number) {
		const direction = new Vector3(this.frame[8], this.frame[9], this.frame[10])
		direction.normalize()
		direction.mul(step)
		this.frame[12] += direction[0]
		this.frame[13] += direction[1]
		this.frame[14] += direction[2]
		this.frameChanged = true
	}

	rotateYAround(point: Vector3, angle: number) {
		if (angle === 0) return

		const distance = new Vector3(this.frame[12], this.frame[13], this.frame[14])
			.sub(point)
			.getLength()

		const position: Vector4 = Matrix4.rotate(new Vector3(0, angle, 0)).mul(
			new Vector4(0, 0, distance, 1)
		)
		const newPosition: Vector4 = this.frame.mul(position.sub(new Vector4(0, 0, distance, 0)))

		this.frame[12] = newPosition[0]
		this.frame[13] = newPosition[1]
		this.frame[14] = newPosition[2]
		this.frameChanged = true
	}

	rotateXAround(point: Vector3, angle: number) {
		if (angle === 0) return

		const distance = new Vector3(this.frame[12], this.frame[13], this.frame[14])
			.sub(point)
			.getLength()

		const position: Vector4 = Matrix4.rotate(new Vector3(angle, 0, 0)).mul(
			new Vector4(0, 0, distance, 1)
		)
		const newPosition: Vector4 = this.frame.mul(position.sub(new Vector4(0, 0, distance, 0)))

		this.frame[12] = newPosition[0]
		this.frame[13] = newPosition[1]
		this.frame[14] = newPosition[2]
		this.frameChanged = true
	}

	viewMatrix(): Matrix4 {
		return this.frame.inverse()
	}

	getPerspectiveMatrix(): Matrix4 {
		return this.perspective
	}
	getViewMatrix(): Matrix4 {
		if (this.frameChanged) {
			this.frameChanged = false
			this.view = this.viewMatrix()
		}
		return this.view
	}

	handleInput(inputHandler: InputHandler) {}
	update(delta: number) {}

	render(gl: WebGL2RenderingContext, entity: EntityInterface) {
		entity.render(gl)
	}
}
