import { Camera } from '../lib/Camera'
import { InputHandler } from '../lib/InputHandler'

export class CameraSwitcher {
	private currentCamera: Camera
	private allCameras: { camera: Camera; key: number }[] = []

	public constructor(cameras: { camera: Camera; key: number }[]) {
		this.allCameras = cameras
	}

	public handleInput(inputHandler: InputHandler) {
		for (let i in this.allCameras) {
			const { camera, key } = this.allCameras[i]

			if (inputHandler.isKeyPressed('Digit' + key) || inputHandler.isKeyPressed('Numpad' + key)) {
				this.currentCamera = camera
				break
			}
		}

		this.currentCamera.handleInput(inputHandler)
	}

	public updateAllCameras(delta: number) {
		this.allCameras.forEach(({ key: _, camera }) => camera.update(delta))
	}

	public getCurrentCamera(): Camera {
		return this.currentCamera
	}

	public setCamera(k: number) {
		for (let i in this.allCameras) {
			const { camera, key } = this.allCameras[i]

			if (k === key) {
				this.currentCamera = camera
				break
			}
		}
	}
}
