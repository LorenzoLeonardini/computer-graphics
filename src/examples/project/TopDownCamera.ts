import { Camera } from '../lib/Camera'
import { EntityInterface } from '../lib/Entity'
import { InputHandler } from '../lib/InputHandler'
import { Matrix4 } from '../lib/Matrix'

export class TopDownCamera extends Camera {
	private entity: EntityInterface
	private zoomLevel: number = 0
	private desiredZoomLevel: number = 2.5

	public attachTo(entity: EntityInterface): void {
		this.entity = entity
		this.frame = new Matrix4([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, this.zoomLevel, 0, 1])
	}

	public handleInput(inputHandler: InputHandler): void {
		if (inputHandler.mouseWheelY() !== 0) {
			this.desiredZoomLevel += 10 * (inputHandler.mouseWheelY() / inputHandler.canvasHeight)
			if (this.desiredZoomLevel < 1) {
				this.desiredZoomLevel = 1
			}
			if (this.desiredZoomLevel > 10) {
				this.desiredZoomLevel = 10
			}
		}
	}

	public update(delta: number): void {
		if (!this.entity) {
			throw new Error('Camera is not attached to an entity')
		}

		this.zoomLevel += (this.desiredZoomLevel - this.zoomLevel) * delta * 0.1

		const entityPosition = this.entity.getPosition()
		this.frame[12] = entityPosition[0]
		this.frame[13] = entityPosition[1] + this.zoomLevel
		this.frame[14] = entityPosition[2]
		this.frameChanged = true
	}
}
