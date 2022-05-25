import { Camera } from '../lib/Camera'
import { EntityInterface } from '../lib/Entity'
import { InputHandler, MouseButton } from '../lib/InputHandler'
import { Vector3 } from '../lib/Vector'

export class FreeCamera extends Camera {
	private desiredZoom: number = 0
	private xMove: number = 0
	private yMove: number = 0

	private lookAtPosition: Vector3 = new Vector3(0, 0, 0)
	private movement: Vector3 = new Vector3(0, 0, 0)

	handleInput(inputHandler: InputHandler): void {
		if (inputHandler.mouseWheelY() !== 0) {
			this.desiredZoom += 10 * (inputHandler.mouseWheelY() / inputHandler.canvasHeight)
		}
		if (inputHandler.isMouseButtonClicked(MouseButton.LEFT)) {
			const [xMouse, yMouse] = inputHandler.getMousePositionDelta()
			this.xMove = xMouse / inputHandler.canvasWidth
			this.yMove = yMouse / inputHandler.canvasHeight
		}
		this.movement[0] = 0
		this.movement[2] = 0
		if (inputHandler.isKeyPressed('KeyW') || inputHandler.isKeyPressed('ArrowUp')) {
			this.movement[2] = -1
		} else if (inputHandler.isKeyPressed('KeyS') || inputHandler.isKeyPressed('ArrowDown')) {
			this.movement[2] = 1
		}
		if (inputHandler.isKeyPressed('KeyA') || inputHandler.isKeyPressed('ArrowLeft')) {
			this.movement[0] = -1
		} else if (inputHandler.isKeyPressed('KeyD') || inputHandler.isKeyPressed('ArrowRight')) {
			this.movement[0] = 1
		}
	}

	update(delta: number): void {
		const zoomLevel = this.desiredZoom * delta * 0.1
		this.desiredZoom -= zoomLevel
		this.zoom(zoomLevel)

		if (this.movement.getLength() !== 0) {
			this.movement.normalize().mul(delta * 0.1)
			this.frame[12] += this.movement[0]
			this.frame[13] += this.movement[1]
			this.frame[14] += this.movement[2]
			this.lookAtPosition.add(this.movement)
		}

		if (this.xMove) {
			this.rotateYAround(new Vector3(0, 0, 0), this.xMove * delta * 2)
			this.xMove = 0
		}

		if (this.yMove) {
			this.rotateXAround(new Vector3(0, 0, 0), -this.yMove * delta * 2)
			this.yMove = 0
		}

		this.lookAt(this.lookAtPosition)
	}

	consumesInput(): boolean {
		return true
	}
}
