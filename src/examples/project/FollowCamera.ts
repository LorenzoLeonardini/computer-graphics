import { Camera } from '../lib/Camera'
import { InputHandler, MouseButton } from '../lib/InputHandler'
import { Matrix4 } from '../lib/Matrix'
import { Vector3 } from '../lib/Vector'
import { Car } from './Car'

export class FollowCamera extends Camera {
	private car: Car
	private zoomLevel: number = 0
	private desiredZoomLevel: number = 1.6
	private desiredRotation: number = 0

	private cameraPosition: Vector3 = new Vector3(0, 0.4, 1.5)
	private cameraYRotation: Vector3 = new Vector3(0, 0, 0)
	private xMove: number = 0
	private yMove: number = 0

	attachTo(car: Car) {
		this.car = car
		this.computePosition()
	}

	private computePosition() {
		this.frame = this.car
			.getFrame()
			.mul(Matrix4.translate(this.cameraPosition).rotate(this.cameraYRotation))
		this.lookAt(this.car.getPosition())
		this.frameChanged = true
	}

	handleInput(inputHandler: InputHandler): void {
		if (inputHandler.mouseWheelY() !== 0) {
			this.desiredZoomLevel += 4 * (inputHandler.mouseWheelY() / inputHandler.canvasHeight)
			if (this.desiredZoomLevel < 1) {
				this.desiredZoomLevel = 1
			}
			if (this.desiredZoomLevel > 6) {
				this.desiredZoomLevel = 6
			}
		}
		if (inputHandler.isMouseButtonClicked(MouseButton.LEFT)) {
			const [xMouse, yMouse] = inputHandler.getMousePositionDelta()
			this.xMove = xMouse / inputHandler.canvasWidth
			this.yMove = yMouse / inputHandler.canvasHeight
		}
	}

	update(delta: number) {
		if (!this.car) {
			throw new Error('Camera is not attached to an entity')
		}

		this.zoomLevel += (this.desiredZoomLevel - this.zoomLevel) * delta * 0.1
		this.cameraPosition = this.cameraPosition.normalize().mul(this.zoomLevel)

		if (this.car.getSpeed() >= 0) {
			this.desiredRotation = -this.car.getTurningAngle()
		} else {
			this.desiredRotation = Math.PI - this.car.getTurningAngle()
		}

		if (this.xMove) {
			this.cameraYRotation[1] += this.xMove * delta * 2
			this.xMove = 0
		} else if (this.car.getSpeed() != 0) {
			this.cameraYRotation[1] +=
				(this.desiredRotation - this.cameraYRotation[1]) * delta * 3 * Math.abs(this.car.getSpeed())
		}

		const entityPosition = this.car.getPosition()
		this.frame[12] = entityPosition[0]
		this.frame[13] = entityPosition[1] + this.zoomLevel
		this.frame[14] = entityPosition[2]
		this.frameChanged = true

		this.computePosition()
	}
}
