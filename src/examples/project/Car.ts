import { Cube } from '../lib/Cube'
import { Cylinder } from '../lib/Cylinder'
import { Entity, EntityTree } from '../lib/Entity'
import { FlatShader } from '../lib/FlatShader'
import { InputHandler } from '../lib/InputHandler'
import { Vector3 } from '../lib/Vector'

const MAX_SPEED: number = 0.05
const ROTATION_SPEED: number = 0.1
const ACCELERATION: number = 0.001
const LERP: number = 0.03

export class Car extends EntityTree {
	private direction: number = 0
	private acceleration: number = 0
	private velocity: number = 0

	public constructor(gl: WebGL2RenderingContext) {
		let cube = new Cube(gl)
		let carBodyMaterial = new FlatShader(gl, new Vector3(0.8, 0.15, 0.15))

		let cylinder = new Cylinder(gl)
		let carTiresMaterial = new FlatShader(gl, new Vector3(0.133, 0.133, 0.133))

		let carBottomBody = new Entity(cube, carBodyMaterial)
		carBottomBody.setScaleX(0.5)
		carBottomBody.setScaleY(0.25)
		carBottomBody.setScaleZ(0.8)
		carBottomBody.moveY(0.45)

		let carTopBody = new Entity(cube, carBodyMaterial)
		carTopBody.setScaleX(0.5)
		carTopBody.setScaleY(0.15)
		carTopBody.setScaleZ(0.625)
		carTopBody.moveY(0.85)
		carTopBody.moveZ(0.8 - 0.625)

		let wheels = Array(4)
			.fill(0)
			.map((_) => {
				let wheel = new Entity(cylinder, carTiresMaterial)
				wheel.rotateZ(Math.PI / 2)
				wheel.setScaleX(0.2)
				wheel.setScaleY(0.1)
				wheel.setScaleZ(0.2)
				wheel.moveY(0.2)
				return wheel
			})

		wheels[0].moveX(-0.5)
		wheels[0].moveZ(-0.45)

		wheels[1].moveX(0.5)
		wheels[1].moveZ(-0.45)

		wheels[2].moveX(-0.5)
		wheels[2].moveZ(0.45)

		wheels[3].moveX(0.5)
		wheels[3].moveZ(0.45)

		super([carBottomBody, carTopBody, ...wheels])
		this.setScale(0.15)
	}

	update(delta: number, inputHandler: InputHandler) {
		if (inputHandler.isKeyPressed('KeyW') || inputHandler.isKeyPressed('ArrowUp')) {
			this.acceleration = ACCELERATION
		} else if (inputHandler.isKeyPressed('KeyS') || inputHandler.isKeyPressed('ArrowDown')) {
			this.acceleration = -ACCELERATION
		} else {
			this.acceleration = -this.velocity * LERP
		}

		if (inputHandler.isKeyPressed('KeyA') || inputHandler.isKeyPressed('ArrowLeft')) {
			this.direction -= ROTATION_SPEED * delta
			this.setRotationY(this.direction)
		} else if (inputHandler.isKeyPressed('KeyD') || inputHandler.isKeyPressed('ArrowRight')) {
			this.direction += ROTATION_SPEED * delta
			this.setRotationY(this.direction)
		}

		this.velocity += this.acceleration * delta * delta * 0.5
		if (this.velocity > MAX_SPEED) {
			this.velocity = MAX_SPEED
		}
		if (this.velocity < -MAX_SPEED) {
			this.velocity = -MAX_SPEED
		}
		this.moveZ(-this.velocity * delta)
	}
}
