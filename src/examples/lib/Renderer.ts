import { Camera } from './Camera'
import { DirectionalLight } from './DirectionalLight'
import { EntityInterface } from './Entity'
import { Matrix4 } from './Matrix'
import { Spotlight } from './Spotlight'
import { Texture } from './Texture'

export class Renderer {
	private gl: WebGL2RenderingContext
	private entities: EntityInterface[] = []
	private frameCounter: number = 0
	private perspectiveMatrix: Matrix4
	private viewMatrix: Matrix4
	private directionalLights: DirectionalLight[] = []
	private spotlights: Spotlight[] = []
	private lightProjectors: Matrix4[]
	private lightProjectorTexture: Texture

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

	public addDirectionalLight(l: DirectionalLight) {
		this.directionalLights.push(l)
	}

	public addSpotlight(l: Spotlight) {
		this.spotlights.push(l)
	}

	public getFrameCounter() {
		return this.frameCounter
	}

	public getPerspectiveMatrix() {
		return this.perspectiveMatrix
	}

	public getViewMatrix() {
		return this.viewMatrix
	}

	public getDirectionalLights() {
		return this.directionalLights
	}

	public getSpotights() {
		return this.spotlights
	}

	public setLightProjectors(lightProjectors: Matrix4[]) {
		this.lightProjectors = lightProjectors
	}

	public getLightProjectors() {
		return this.lightProjectors
	}

	public setLightProjectorTexture(lightProjectorTexture: Texture) {
		this.lightProjectorTexture = lightProjectorTexture
	}

	public getLightProjectorTexture() {
		return this.lightProjectorTexture
	}

	public render(camera: Camera) {
		this.gl.clearColor(0.2, 0.3, 0.4, 1)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)

		this.frameCounter++
		this.perspectiveMatrix = camera.getPerspectiveMatrix()
		this.viewMatrix = camera.getViewMatrix()

		this.entities.forEach((entity) => {
			entity.render(this.gl, this)
		})
	}
}
