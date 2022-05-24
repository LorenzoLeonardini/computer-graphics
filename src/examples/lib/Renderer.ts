import { Camera } from './Camera'
import { EntityInterface } from './Entity'
import { Matrix4 } from './Matrix'

export class Renderer {
	private gl: WebGL2RenderingContext
	private entities: EntityInterface[] = []
	private static frameCounter: number = 0
	private static perspectiveMatrix: Matrix4
	private static viewMatrix: Matrix4

	public constructor(gl: WebGL2RenderingContext) {
		this.gl = gl
		this.gl.enable(this.gl.DEPTH_TEST)
		this.gl.enable(this.gl.CULL_FACE)
		this.gl.enable(this.gl.BLEND)
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
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
		this.gl.clearColor(0.2, 0.3, 0.4, 1)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)

		Renderer.frameCounter++
		Renderer.perspectiveMatrix = camera.getPerspectiveMatrix()
		Renderer.viewMatrix = camera.getViewMatrix()

		this.entities.forEach((entity) => {
			camera.render(this.gl, entity)
		})
	}
}