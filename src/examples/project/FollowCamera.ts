import { Camera } from '../lib/Camera'
import { InputHandler, MouseButton } from '../lib/InputHandler'
import { Matrix4 } from '../lib/Matrix'
import { Vector3 } from '../lib/Vector'
import { Car } from './Car'

const MIN_ZOOM_LEVEL = 0.3
const MAX_ZOOM_LEVEL = 6

export class FollowCamera extends Camera {
	private car: Car
	private zoomLevel: number = 0
	private desiredZoomLevel: number = 1.6
	private desiredRotation: number = 0

	private cameraPosition: Vector3 = new Vector3(0, 0.4, 1.5)
	private cameraYRotation: Vector3 = new Vector3(0, 0, 0)
	private xMove: number = 0

	private holdingMouse: boolean = false

	public attachTo(car: Car): void {
		this.car = car
		this.computePosition()
	}

	private computePosition(): void {
		this.frame = this.car
			.getFrame()
			.mul(Matrix4.translate(this.cameraPosition).rotate(this.cameraYRotation))
		this.lookAt(this.car.getPosition())
		this.frameChanged = true
	}

	public handleInput(inputHandler: InputHandler): void {
		if (inputHandler.mouseWheelY() !== 0) {
			this.desiredZoomLevel += 4 * (inputHandler.mouseWheelY() / inputHandler.canvasHeight)
			if (this.desiredZoomLevel < MIN_ZOOM_LEVEL) {
				this.desiredZoomLevel = MIN_ZOOM_LEVEL
			}
			if (this.desiredZoomLevel > MAX_ZOOM_LEVEL) {
				this.desiredZoomLevel = MAX_ZOOM_LEVEL
			}
		}
		if ((this.holdingMouse = inputHandler.isMouseButtonClicked(MouseButton.LEFT))) {
			const [xMouse, yMouse] = inputHandler.getMousePositionDelta()
			this.xMove = xMouse / inputHandler.canvasWidth
		}
	}

	public update(delta: number): void {
		if (!this.car) {
			throw new Error('Camera is not attached to an entity')
		}

		this.zoomLevel += (this.desiredZoomLevel - this.zoomLevel) * delta * 0.1
		if (this.zoomLevel < MIN_ZOOM_LEVEL) {
			this.zoomLevel = MIN_ZOOM_LEVEL
		}
		if (this.zoomLevel > MAX_ZOOM_LEVEL) {
			this.zoomLevel = MAX_ZOOM_LEVEL
		}
		this.cameraPosition = this.cameraPosition.normalize().mul(this.zoomLevel)

		if (this.car.getSpeed() >= 0) {
			this.desiredRotation = -this.car.getTurningAngle()
		} else {
			this.desiredRotation = Math.PI - this.car.getTurningAngle()
		}

		if (this.xMove) {
			this.cameraYRotation[1] += this.xMove * delta * 2
			this.xMove = 0
		} else if (this.car.getSpeed() != 0 && !this.holdingMouse) {
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
