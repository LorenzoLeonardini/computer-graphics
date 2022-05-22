import { Camera } from '../lib/Camera'
import { EntityInterface } from '../lib/Entity'
import { InputHandler } from '../lib/InputHandler'
import { Matrix4 } from '../lib/Matrix'

export class TopDownCamera extends Camera {
	private entity: EntityInterface
	private zoomLevel: number = 0
	private desiredZoomLevel: number = 2.5

	attachTo(entity: EntityInterface) {
		this.entity = entity
		this.frame = new Matrix4([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, this.zoomLevel, 0, 1])
	}

	update(delta: number, inputHandler: InputHandler) {
		if (!this.entity) {
			throw new Error('Camera is not attached to an entity')
		}

		if (inputHandler.mouseWheelY() !== 0) {
			this.desiredZoomLevel += 2 * (inputHandler.mouseWheelY() / inputHandler.canvasHeight)
		}

		this.zoomLevel += (this.desiredZoomLevel - this.zoomLevel) * delta * 0.15

		const entityPosition = this.entity.getPosition()
		this.frame[12] = entityPosition[0]
		this.frame[13] = entityPosition[1] + this.zoomLevel
		this.frame[14] = entityPosition[2]
		this.frameChanged = true
	}
}
