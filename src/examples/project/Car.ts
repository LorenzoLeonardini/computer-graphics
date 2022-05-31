import { Camera } from '../lib/Camera'
import { Entity, EntityTree } from '../lib/Entity'
import { FlatShader } from '../lib/FlatShader'
import { InputHandler } from '../lib/InputHandler'
import { Matrix4 } from '../lib/Matrix'
import { loadObj } from '../lib/ObjectLoader'
import { OBJModel } from '../lib/OBJModel'
import { Shader } from '../lib/Shader'
import { Vector3, Vector4 } from '../lib/Vector'

const ENGINE_POWER: number = 0.004
const ENGINE_POWER_REVERSE: number = 0.0015
const BRAKES = -0.0027
const FRICTION: number = -0.018
const DRAG: number = -0.0002

const WHEELS_DISTANCE = 2.9
const WHEELS_WIDTH = 1.7

export class Car extends EntityTree {
	private wheelTurning: number = 0
	private rotationPoint: Vector4 = new Vector4(0, 0, 0, 1)
	private wheelRotation: number = 0

	private acceleration: number = 0
	private velocity: number = 0

	private headlightProjectors: [Camera, Camera]

	private wheels: EntityTree[]

	public constructor(
		gl: WebGL2RenderingContext,
		cubeModel: OBJModel,
		carBodyMaterial: Shader,
		wheelModel: OBJModel,
		wheelShader: Shader,
		tireModel: OBJModel,
		tireShader: Shader
	) {
		let carBody = new Entity(cubeModel, carBodyMaterial)
		carBody.moveY(0.65)
		carBody.moveZ(-0.05)

		let wheels = Array(4)
			.fill(0)
			.map((_) => {
				let wheelRim = new Entity(wheelModel, wheelShader)
				let tire = new Entity(tireModel, tireShader)

				let wheel = new EntityTree([wheelRim, tire])
				wheel.setRotationZ(Math.PI / 2)
				wheel.setScale(1.05)
				wheel.setPositionY(0.3)
				return wheel
			})

		wheels[0].setPositionX(-WHEELS_WIDTH / 2)
		wheels[0].setPositionZ(-WHEELS_DISTANCE / 2)

		wheels[1].setPositionX(WHEELS_WIDTH / 2)
		wheels[1].setPositionZ(-WHEELS_DISTANCE / 2)
		wheels[1].rotateYAroundOrigin(Math.PI)

		wheels[2].setPositionX(-WHEELS_WIDTH / 2)
		wheels[2].setPositionZ(WHEELS_DISTANCE / 2)

		wheels[3].setPositionX(WHEELS_WIDTH / 2)
		wheels[3].setPositionZ(WHEELS_DISTANCE / 2)
		wheels[3].rotateYAroundOrigin(Math.PI)

		super([carBody, ...wheels])
		this.setScale(0.1)
		this.wheels = wheels

		this.headlightProjectors = [new Camera(1, 1, 0.2, 32), new Camera(1, 1, 0.2, 32)]
		this.headlightProjectors[0].position(0.55, 0.8, -2.2)
		this.headlightProjectors[0].position(-0.55, 0.8, -2.2)
	}

	public getSpeed(): number {
		return this.velocity
	}

	public getTurningAngle(): number {
		return this.wheelTurning
	}

	public update(delta: number, inputHandler: InputHandler): void {
		// BEGIN ACCELERATION CALCULATION
		if (inputHandler.isKeyPressed('KeyW') || inputHandler.isKeyPressed('ArrowUp')) {
			if (this.velocity >= 0) {
				this.acceleration = ENGINE_POWER * (1 - Math.abs(this.wheelTurning) / (Math.PI * 0.3))
			} else {
				this.acceleration = -BRAKES
			}
		} else if (inputHandler.isKeyPressed('KeyS') || inputHandler.isKeyPressed('ArrowDown')) {
			if (this.velocity <= 0) {
				this.acceleration =
					-ENGINE_POWER_REVERSE * (1 - Math.abs(this.wheelTurning) / (Math.PI * 0.3))
			} else {
				this.acceleration = BRAKES
			}
		} else {
			// faking inertia
			this.acceleration = this.velocity * 0.01
		}

		// https://kidscancode.org/godot_recipes/2d/car_steering/
		if (Math.abs(this.velocity) < 0.001) {
			this.velocity = 0
		}
		let friction = this.velocity * FRICTION
		let drag = this.velocity * Math.abs(this.velocity) * DRAG
		if (Math.abs(this.velocity) < 0.1) {
			friction *= 3
		}
		this.acceleration += drag + friction
		// END ACCELERATION CALCULATION

		// BEGIN VELOCITY AND SPACE CALCULATION
		this.velocity += this.acceleration * delta
		let displacement = this.velocity * delta + this.acceleration * delta * delta * 0.5
		// END VELOCITY AND SPACE CALCULATION

		// BEGIN TURNING CALCULATION
		let maximumCurve = Math.PI * 0.25
		if (Math.abs(this.velocity) > 0.04) {
			maximumCurve = Math.PI * 0.1
		}
		if (inputHandler.isKeyPressed('KeyA') || inputHandler.isKeyPressed('ArrowLeft')) {
			if (this.wheelTurning <= 0.01) {
				this.wheelTurning = this.wheelTurning + (-maximumCurve - this.wheelTurning) * delta * 0.01
			} else {
				this.wheelTurning = this.wheelTurning + (0 - this.wheelTurning) * delta * 0.15
			}
		} else if (inputHandler.isKeyPressed('KeyD') || inputHandler.isKeyPressed('ArrowRight')) {
			if (this.wheelTurning >= -0.01) {
				this.wheelTurning = this.wheelTurning + (maximumCurve - this.wheelTurning) * delta * 0.01
			} else {
				this.wheelTurning = this.wheelTurning + (0 - this.wheelTurning) * delta * 0.15
			}
		} else if (this.velocity !== 0) {
			this.wheelTurning = this.wheelTurning + (0 - this.wheelTurning) * delta * 0.1
			if (Math.abs(this.wheelTurning) < 0.01) {
				this.wheelTurning = 0
			}
		}

		const rotationX = (WHEELS_DISTANCE * 0.15) / Math.tan(this.wheelTurning)
		if (this.wheelTurning > 0) {
			this.rotationPoint = this.positionMatrix.mul(
				new Vector4(rotationX + (WHEELS_WIDTH * 0.15) / 2, 0, (WHEELS_DISTANCE * 0.15) / 2, 1)
			)
		} else {
			this.rotationPoint = this.positionMatrix.mul(
				new Vector4(rotationX - (WHEELS_WIDTH * 0.15) / 2, 0, (WHEELS_DISTANCE * 0.15) / 2, 1)
			)
		}
		// END TURNING CALCULATION

		// BEGIN WHEEL ANIMATION
		this.wheelRotation += -displacement * (2 * (1 / 0.6)) * (2 * (1 / 0.6))
		this.wheels.forEach((wheel, i) => {
			wheel.setRotationY(this.wheelRotation * (1 - (i % 2) * 2))
			wheel.rotateZAroundOrigin(Math.PI / 2)
		})
		this.wheels[1].rotateYAroundOrigin(Math.PI)
		this.wheels[3].rotateYAroundOrigin(Math.PI)
		this.wheels[0].rotateYAroundOrigin(this.wheelTurning)
		this.wheels[1].rotateYAroundOrigin(this.wheelTurning)
		// END WHEEL ANIMATION

		// BEGIN MOVE
		if (this.wheelTurning === 0) {
			// move straight
			this.moveZ(-displacement)
		} else {
			// rotate around
			const currentPosition = new Vector4(this.positionMatrix[12], 0, this.positionMatrix[14], 1)
			const distance =
				this.rotationPoint.copy().sub(currentPosition).getLength() * Math.sign(this.wheelTurning)

			this.positionMatrix = this.positionMatrix
				.translate(new Vector3(-this.rotationPoint[0], 0, -this.rotationPoint[2]))
				.rotate(new Vector3(0, displacement / distance, 0))
				.translate(new Vector3(this.rotationPoint[0], 0, this.rotationPoint[2]))
			this.needsUpdating = true
		}
	}

	public getProjectorsMatrix = () => {
		this.headlightProjectors[0].frame = this.updateMatrix().mul(
			Matrix4.translate(new Vector3(-0.35, 0.45, -0.8))
		)
		this.headlightProjectors[0].frameChanged = true
		this.headlightProjectors[1].frame = this.updateMatrix().mul(
			Matrix4.translate(new Vector3(0.35, 0.45, -0.8))
		)
		this.headlightProjectors[1].frameChanged = true
		return [
			this.headlightProjectors[0]
				.getPerspectiveMatrix()
				.mul(this.headlightProjectors[0].getViewMatrix()),
			this.headlightProjectors[1]
				.getPerspectiveMatrix()
				.mul(this.headlightProjectors[1].getViewMatrix())
		]
	}
}
