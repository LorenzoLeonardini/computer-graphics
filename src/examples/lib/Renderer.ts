import { Camera } from './Camera'
import { EntityInterface } from './Entity'
import { Matrix4 } from './Matrix'
import { glCall } from './Utils'

export class Renderer {
	private gl: WebGL2RenderingContext
	private entities: EntityInterface[] = []
	private static frameCounter: number = 0
	private static perspectiveMatrix: Matrix4
	private static viewMatrix: Matrix4

	public constructor(gl: WebGL2RenderingContext) {
		this.gl = gl
	}

	public addEntity(e: EntityInterface) {
		this.entities.push(e)
	}

	public static getFrameCounter() {
		return Renderer.frameCounter
	}

	public static getPerspectiveMatrix() {
		return Renderer.perspectiveMatrix
	}

	public static getViewMatrix() {
		return Renderer.viewMatrix
	}

	public render(camera: Camera) {
		glCall(this.gl, this.gl.enable, this.gl.DEPTH_TEST)
		glCall(this.gl, this.gl.enable, this.gl.CULL_FACE)
		glCall(this.gl, this.gl.enable, this.gl.BLEND)
		glCall(this.gl, this.gl.blendFunc, this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)

		glCall(this.gl, this.gl.clearColor, 0.2, 0.3, 0.4, 1)
		glCall(this.gl, this.gl.clear, this.gl.COLOR_BUFFER_BIT)

		camera.update()

		Renderer.frameCounter++
		Renderer.perspectiveMatrix = camera.getPerspectiveMatrix()
		Renderer.viewMatrix = camera.getViewMatrix()

		this.entities.forEach((entity) => {
			camera.render(this.gl, entity)
		})
	}
}
