import { Camera } from '../lib/Camera'
import { EntityInterface } from '../lib/Entity'
import { InputHandler, MouseButton } from '../lib/InputHandler'
import { Vector3 } from '../lib/Vector'

export class FreeCamera extends Camera {
	private entity: EntityInterface
	private desiredZoom: number = 0
	private xMove: number = 0
	private yMove: number = 0

	attachTo(entity: EntityInterface) {
		this.entity = entity
	}

	handleInput(inputHandler: InputHandler): void {
		if (inputHandler.mouseWheelY() !== 0) {
			this.desiredZoom += 3 * (inputHandler.mouseWheelY() / inputHandler.canvasHeight)
		}
		if (inputHandler.isMouseButtonClicked(MouseButton.LEFT)) {
			const [xMouse, yMouse] = inputHandler.getMousePositionDelta()
			this.xMove = xMouse / inputHandler.canvasWidth
			this.yMove = yMouse / inputHandler.canvasHeight
		}
	}

	update(delta: number): void {
		if (!this.entity) {
			throw new Error('Camera is not attached to an entity')
		}

		const zoomLevel = this.desiredZoom * delta * 0.1
		this.desiredZoom -= zoomLevel
		this.zoom(zoomLevel)

		if (this.xMove) {
			this.rotateYAround(new Vector3(0, 0, 0), this.xMove * delta * 2)
			this.xMove = 0
		}

		if (this.yMove) {
			this.rotateXAround(new Vector3(0, 0, 0), -this.yMove * delta * 2)
			this.yMove = 0
		}

		this.lookAt(this.entity.getPosition())
	}
}
