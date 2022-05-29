import { Camera } from './Camera'
import { DirectionalLight } from './DirectionalLight'
import { EntityInterface } from './Entity'
import { Matrix4 } from './Matrix'
import { ShadowPassShader } from './ShadowPassShader'
import { Spotlight } from './Spotlight'
import { Texture } from './Texture'

export class Renderer {
	private gl: WebGL2RenderingContext
	private entities: EntityInterface[] = []
	private shadowPassShader: ShadowPassShader

	private projectorFrameBuffers: WebGLFramebuffer[]
	private projectorFrameBuffersTextures: Texture[]

	private frameCounter: number = 0
	private perspectiveMatrix: Matrix4
	private viewMatrix: Matrix4
	private directionalLights: DirectionalLight[] = []
	private spotlights: Spotlight[] = []
	private lightProjectors: Matrix4[]
	private lightProjectorTexture: Texture

	public constructor(gl: WebGL2RenderingContext) {
		this.gl = gl
		this.shadowPassShader = new ShadowPassShader(this.gl)

		this.projectorFrameBuffersTextures = [new Texture(this.gl, null), new Texture(this.gl, null)]
		this.projectorFrameBuffers = [this.gl.createFramebuffer(), this.gl.createFramebuffer()]

		for (let i in this.projectorFrameBuffers) {
			this.projectorFrameBuffersTextures[i].texture = this.gl.createTexture()
			const texture = this.projectorFrameBuffersTextures[i].texture
			this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
			this.gl.texImage2D(
				this.gl.TEXTURE_2D,
				0,
				this.gl.DEPTH_COMPONENT16,
				1024,
				1024,
				0,
				this.gl.DEPTH_COMPONENT,
				this.gl.UNSIGNED_INT,
				null
			)

			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)

			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.projectorFrameBuffers[i])
			this.gl.framebufferTexture2D(
				this.gl.FRAMEBUFFER,
				this.gl.DEPTH_ATTACHMENT,
				this.gl.TEXTURE_2D,
				texture,
				0
			)

			const colorTexture = this.gl.createTexture()
			this.projectorFrameBuffersTextures[i].texture = colorTexture

			this.gl.bindTexture(this.gl.TEXTURE_2D, colorTexture)
			this.gl.texImage2D(
				this.gl.TEXTURE_2D,
				0,
				this.gl.RGBA,
				1024,
				1024,
				0,
				this.gl.RGBA,
				this.gl.UNSIGNED_BYTE,
				null
			)

			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)

			this.gl.framebufferTexture2D(
				this.gl.FRAMEBUFFER,
				this.gl.COLOR_ATTACHMENT0,
				this.gl.TEXTURE_2D,
				colorTexture,
				0
			)
		}

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

	public getProjectorDepthTextures() {
		return this.projectorFrameBuffersTextures
	}

	public render(camera: Camera) {
		// Shadow pass
		this.frameCounter++

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.projectorFrameBuffers[0])
		this.gl.viewport(0, 0, 1024, 1024)
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
		this.gl.clearDepth(1.0)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

		this.perspectiveMatrix = this.lightProjectors[0]
		this.viewMatrix = new Matrix4()

		this.entities.forEach((entity) => {
			entity.render(this.gl, this, undefined, this.shadowPassShader)
		})

		// Main rendering
		this.frameCounter++

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
		this.gl.viewport(0, 0, document.body.clientWidth, document.body.clientHeight)
		this.gl.clearColor(0.2, 0.3, 0.4, 1)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)

		this.perspectiveMatrix = camera.getPerspectiveMatrix()
		this.viewMatrix = camera.getViewMatrix()

		this.entities.forEach((entity) => {
			entity.render(this.gl, this)
		})
	}
}
