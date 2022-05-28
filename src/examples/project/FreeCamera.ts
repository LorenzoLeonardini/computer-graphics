import { Camera } from '../lib/Camera'
import { DummyEntity, EntityInterface } from '../lib/Entity'
import { InputHandler, MouseButton } from '../lib/InputHandler'
import { Matrix4 } from '../lib/Matrix'
import { Vector3, Vector4 } from '../lib/Vector'
import { FollowCamera } from './FollowCamera'

const MIN_ZOOM_LEVEL = 0.3
const MAX_ZOOM_LEVEL = 6

export class FreeCamera extends Camera {
	private desiredPosition: Vector3 = new Vector3(0, 0, 0)
	private movement: Vector3 = new Vector3(0, 0, 0)
	private centerEntity: DummyEntity = new DummyEntity()

	private zoomLevel: number = 0
	private desiredZoomLevel: number = 1.6

	private cameraPosition: Vector3 = new Vector3(0, 0.4, 1.5)
	private cameraYRotation: Vector3 = new Vector3(0, 0, 0)
	private xMove: number = 0
	private yMove: number = 0

	handleInput(inputHandler: InputHandler): void {
		if (inputHandler.mouseWheelY() !== 0) {
			this.desiredZoomLevel += 4 * (inputHandler.mouseWheelY() / inputHandler.canvasHeight)
			if (this.desiredZoomLevel < MIN_ZOOM_LEVEL) {
				this.desiredZoomLevel = MIN_ZOOM_LEVEL
			}
			if (this.desiredZoomLevel > MAX_ZOOM_LEVEL) {
				this.desiredZoomLevel = MAX_ZOOM_LEVEL
			}
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

	private rotationY: number = 0

	update(delta: number): void {
		if (this.movement.getLength() !== 0) {
			this.movement.normalize().mul(delta * 0.1)
			this.centerEntity.moveZ(this.movement[2])
			this.centerEntity.moveX(this.movement[0])
		}

		this.zoomLevel += (this.desiredZoomLevel - this.zoomLevel) * delta * 0.1
		if (this.zoomLevel < MIN_ZOOM_LEVEL) {
			this.zoomLevel = MIN_ZOOM_LEVEL
		}
		if (this.zoomLevel > MAX_ZOOM_LEVEL) {
			this.zoomLevel = MAX_ZOOM_LEVEL
		}
		this.cameraPosition = this.cameraPosition.normalize().mul(this.zoomLevel)

		if (this.xMove) {
			this.centerEntity.rotateYAroundOrigin(this.xMove * delta * 2)
			this.xMove = 0
		}
		if (this.yMove) {
			let vec = Matrix4.rotate(new Vector3(-this.yMove * delta * 2, 0, 0)).mul(
				new Vector4(this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2], 1)
			)
			this.cameraPosition[0] = vec[0]
			this.cameraPosition[1] = vec[1]
			this.cameraPosition[2] = vec[2]
			this.yMove = 0
		}

		let entityPosition = this.centerEntity.getPosition()
		this.frame[12] = entityPosition[0]
		this.frame[13] = entityPosition[1]
		this.frame[14] = entityPosition[2]
		this.frameChanged = true

		this.frame = this.centerEntity
			.getFrame()
			.mul(Matrix4.translate(this.cameraPosition.normalize().mul(this.zoomLevel)))
		this.lookAt(this.centerEntity.getPosition())
		this.frameChanged = true
	}

	consumesInput(): boolean {
		return true
	}
}
