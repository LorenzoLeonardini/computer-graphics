import { Camera } from './Camera'
import { DirectionalLight } from './DirectionalLight'
import { EntityInterface } from './Entity'
import { Matrix4 } from './Matrix'
import { Shader } from './Shader'
import { ShadowPassShader } from './ShadowPassShader'
import { Spotlight } from './Spotlight'
import { Texture } from './Texture'
import { Vector3 } from './Vector'

const PROJECTOR_SIZE = 1024
const SUN_SIZE = 1024 * 2

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
	private projectorPositions: Vector3[]
	private projectorDepths: number[]

	private sunMatrix: Matrix4
	private sunFrameBuffer: WebGLFramebuffer
	private sunDepthTexture: Texture

	private generateDepthTexture(SIZE: number): [WebGLFramebuffer, Texture] {
		const frameBuffer = this.gl.createFramebuffer()

		const texture = this.gl.createTexture()
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,
			0,
			this.gl.DEPTH_COMPONENT32F,
			SIZE,
			SIZE,
			0,
			this.gl.DEPTH_COMPONENT,
			this.gl.FLOAT,
			null
		)

		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer)
		this.gl.framebufferTexture2D(
			this.gl.FRAMEBUFFER,
			this.gl.DEPTH_ATTACHMENT,
			this.gl.TEXTURE_2D,
			texture,
			0
		)

		const colorTexture = this.gl.createTexture()
		const textureObject = new Texture(this.gl, null)
		textureObject.texture = colorTexture

		this.gl.bindTexture(this.gl.TEXTURE_2D, colorTexture)
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,
			0,
			this.gl.RGBA,
			SIZE,
			SIZE,
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

		return [frameBuffer, textureObject]
	}

	public constructor(gl: WebGL2RenderingContext) {
		this.gl = gl
		this.shadowPassShader = new ShadowPassShader(this.gl)

		const depth1 = this.generateDepthTexture(PROJECTOR_SIZE)
		const depth2 = this.generateDepthTexture(PROJECTOR_SIZE)
		const depth3 = this.generateDepthTexture(SUN_SIZE)

		this.projectorFrameBuffers = [depth1[0], depth2[0]]
		this.projectorFrameBuffersTextures = [depth1[1], depth2[1]]

		this.sunFrameBuffer = depth3[0]
		this.sunDepthTexture = depth3[1]
	}

	public addEntity(e: EntityInterface) {
		this.entities.push(e)
	}

	public addDirectionalLight(l: DirectionalLight) {
		this.directionalLights.push(l)
	}

	public addSun(l: DirectionalLight) {
		this.addDirectionalLight(l)

		let sunMat = new Matrix4()
		let zDir = l.getDirection().copy().mul(-1).normalize()
		let up = new Vector3(0, 1, 0)
		let xDir = up.cross(zDir).normalize()
		let yDir = zDir.cross(xDir).normalize()

		sunMat[0] = xDir[0]
		sunMat[1] = xDir[1]
		sunMat[2] = xDir[2]

		sunMat[4] = yDir[0]
		sunMat[5] = yDir[1]
		sunMat[6] = yDir[2]

		sunMat[8] = zDir[0]
		sunMat[9] = zDir[1]
		sunMat[10] = zDir[2]

		sunMat[12] = l.getDirection()[0] * -30
		sunMat[13] = l.getDirection()[1] * -30
		sunMat[14] = l.getDirection()[2] * -30

		this.sunMatrix = Matrix4.orthogonal(-9.5, -50.5, -21, -39, 9.5, 50.5).mul(sunMat)
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

	public setLightProjectorsPosition(positions: Vector3[]) {
		this.projectorPositions = positions
	}

	public setLightProjectorsDepth(depths: number[]) {
		this.projectorDepths = depths
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

	public getProjectorPositions() {
		return this.projectorPositions
	}

	public getProjectorDepths() {
		return this.projectorDepths
	}

	public getSunMatrix() {
		return this.sunMatrix
	}

	public getSunDepthTexture() {
		return this.sunDepthTexture
	}

	private renderScene(
		viewportWidth: number,
		viewportHeight: number,
		perspective: Matrix4,
		view: Matrix4,
		shader?: Shader
	) {
		this.frameCounter++
		this.gl.viewport(0, 0, viewportWidth, viewportHeight)

		this.gl.enable(this.gl.DEPTH_TEST)
		this.gl.enable(this.gl.CULL_FACE)

		this.gl.enable(this.gl.BLEND)
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)

		this.gl.clearColor(0.2, 0.3, 0.4, 1)
		this.gl.clearDepth(1.0)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

		this.perspectiveMatrix = perspective
		this.viewMatrix = view

		this.entities.forEach((entity) => {
			entity.render(this.gl, this, undefined, shader)
		})
	}

	public render(camera: Camera) {
		// Shadow pass
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.projectorFrameBuffers[0])
		this.renderScene(
			PROJECTOR_SIZE,
			PROJECTOR_SIZE,
			this.lightProjectors[0],
			new Matrix4(),
			this.shadowPassShader
		)

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.projectorFrameBuffers[1])
		this.renderScene(
			PROJECTOR_SIZE,
			PROJECTOR_SIZE,
			this.lightProjectors[1],
			new Matrix4(),
			this.shadowPassShader
		)

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.sunFrameBuffer)
		this.renderScene(SUN_SIZE, SUN_SIZE, this.sunMatrix, new Matrix4(), this.shadowPassShader)

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
		this.renderScene(
			document.body.clientWidth,
			document.body.clientHeight,
			camera.getPerspectiveMatrix(),
			camera.getViewMatrix()
		)
	}
}
