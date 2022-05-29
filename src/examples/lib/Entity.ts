import { InputHandler } from './InputHandler'
import { Matrix4 } from './Matrix'
import { Model } from './Model'
import { Renderer } from './Renderer'
import { Shader } from './Shader'
import { Vector3 } from './Vector'

export interface EntityInterface {
	rotateX(angle: number): void
	setRotationY(angle: number): void
	setRotationZ(angle: number): void
	scaleX(amount: number): void
	scaleY(amount: number): void
	scaleZ(amount: number): void
	setScaleX(amount: number): void
	setScaleY(amount: number): void
	setScaleZ(amount: number): void
	setScale(amount: number): void
	moveX(amount: number): void
	moveY(amount: number): void
	moveZ(amount: number): void
	setPositionX(amount: number): void
	setPositionY(amount: number): void
	setPositionZ(amount: number): void
	setPosition(x: number, y: number, z: number): void
	getPosition(): Vector3
	getFrame(): Matrix4
	update(delta: number, inputHandler: InputHandler): void
	render(
		gl: WebGL2RenderingContext,
		renderer: Renderer,
		transformation?: Matrix4,
		shader?: Shader
	): void
}

class EntityKernel {
	protected scale: Vector3 = new Vector3(1, 1, 1)

	protected positionMatrix: Matrix4 = new Matrix4()
	protected matrix: Matrix4
	protected needsUpdating: boolean = true

	rotateXAroundOrigin(angle: number) {
		let position = [this.positionMatrix[12], this.positionMatrix[13], this.positionMatrix[14]]
		this.positionMatrix[12] = 0
		this.positionMatrix[13] = 0
		this.positionMatrix[14] = 0
		this.positionMatrix = Matrix4.rotate(new Vector3(angle, 0, 0)).mul(this.positionMatrix)
		this.positionMatrix[12] = position[0]
		this.positionMatrix[13] = position[1]
		this.positionMatrix[14] = position[2]
		this.needsUpdating = true
	}

	rotateYAroundOrigin(angle: number) {
		let position = [this.positionMatrix[12], this.positionMatrix[13], this.positionMatrix[14]]
		this.positionMatrix[12] = 0
		this.positionMatrix[13] = 0
		this.positionMatrix[14] = 0
		this.positionMatrix = Matrix4.rotate(new Vector3(0, angle, 0)).mul(this.positionMatrix)
		this.positionMatrix[12] = position[0]
		this.positionMatrix[13] = position[1]
		this.positionMatrix[14] = position[2]
		this.needsUpdating = true
	}

	rotateZAroundOrigin(angle: number) {
		let position = [this.positionMatrix[12], this.positionMatrix[13], this.positionMatrix[14]]
		this.positionMatrix[12] = 0
		this.positionMatrix[13] = 0
		this.positionMatrix[14] = 0
		this.positionMatrix = Matrix4.rotate(new Vector3(0, 0, angle)).mul(this.positionMatrix)
		this.positionMatrix[12] = position[0]
		this.positionMatrix[13] = position[1]
		this.positionMatrix[14] = position[2]
		this.needsUpdating = true
	}

	rotateX(angle: number) {
		this.positionMatrix = Matrix4.rotate(new Vector3(angle, 0, 0)).mul(this.positionMatrix)
		this.needsUpdating = true
	}

	rotateY(angle: number) {
		this.positionMatrix = Matrix4.rotate(new Vector3(0, angle, 0)).mul(this.positionMatrix)
		this.needsUpdating = true
	}

	rotateZ(angle: number) {
		this.positionMatrix = Matrix4.rotate(new Vector3(0, 0, angle)).mul(this.positionMatrix)
		this.needsUpdating = true
	}

	setRotationX(angle: number) {
		const rotationMatrix = Matrix4.rotate(new Vector3(angle, 0, 0))
		rotationMatrix[12] = this.positionMatrix[12]
		rotationMatrix[13] = this.positionMatrix[13]
		rotationMatrix[14] = this.positionMatrix[14]
		this.positionMatrix = rotationMatrix
		this.needsUpdating = true
	}

	setRotationY(angle: number) {
		const rotationMatrix = Matrix4.rotate(new Vector3(0, angle, 0))
		rotationMatrix[12] = this.positionMatrix[12]
		rotationMatrix[13] = this.positionMatrix[13]
		rotationMatrix[14] = this.positionMatrix[14]
		this.positionMatrix = rotationMatrix
		this.needsUpdating = true
	}

	setRotationZ(angle: number) {
		const rotationMatrix = Matrix4.rotate(new Vector3(0, 0, angle))
		rotationMatrix[12] = this.positionMatrix[12]
		rotationMatrix[13] = this.positionMatrix[13]
		rotationMatrix[14] = this.positionMatrix[14]
		this.positionMatrix = rotationMatrix
		this.needsUpdating = true
	}

	scaleX(amount: number): void {
		this.scale[0] *= amount
		this.needsUpdating = true
	}

	scaleY(amount: number): void {
		this.scale[1] *= amount
		this.needsUpdating = true
	}

	scaleZ(amount: number): void {
		this.scale[2] *= amount
		this.needsUpdating = true
	}

	setScaleX(amount: number): void {
		this.scale[0] = amount
		this.needsUpdating = true
	}

	setScaleY(amount: number): void {
		this.scale[1] = amount
		this.needsUpdating = true
	}

	setScaleZ(amount: number): void {
		this.scale[2] = amount
		this.needsUpdating = true
	}

	setScale(amount: number): void {
		this.scale[0] = amount
		this.scale[1] = amount
		this.scale[2] = amount
		this.needsUpdating = true
	}

	moveX(amount: number): void {
		this.positionMatrix = this.positionMatrix.mul(Matrix4.translate(new Vector3(amount, 0, 0)))
		this.needsUpdating = true
	}

	moveY(amount: number): void {
		this.positionMatrix = this.positionMatrix.mul(Matrix4.translate(new Vector3(0, amount, 0)))
		this.needsUpdating = true
	}

	moveZ(amount: number): void {
		this.positionMatrix = this.positionMatrix.mul(Matrix4.translate(new Vector3(0, 0, amount)))
		this.needsUpdating = true
	}

	setPositionX(amount: number): void {
		this.positionMatrix[12] = amount
		this.needsUpdating = true
	}

	setPositionY(amount: number): void {
		this.positionMatrix[13] = amount
		this.needsUpdating = true
	}

	setPositionZ(amount: number): void {
		this.positionMatrix[14] = amount
		this.needsUpdating = true
	}

	setPosition(x: number, y: number, z: number): void {
		this.positionMatrix[12] = x
		this.positionMatrix[13] = y
		this.positionMatrix[14] = z
		this.needsUpdating = true
	}

	getPosition() {
		return new Vector3(this.positionMatrix[12], this.positionMatrix[13], this.positionMatrix[14])
	}

	getFrame(): Matrix4 {
		return this.positionMatrix.copy()
	}

	protected updateMatrix(): Matrix4 {
		return this.positionMatrix.mul(Matrix4.scale(this.scale))
	}
}

export class Entity extends EntityKernel implements EntityInterface {
	private model: Model
	private shader: Shader

	public constructor(model: Model, shader: Shader) {
		super()
		this.model = model
		this.shader = shader
	}

	public update(delta: number, inputHandler: InputHandler) {}

	public render(
		gl: WebGL2RenderingContext,
		renderer: Renderer,
		transformation?: Matrix4,
		shader?: Shader
	): void {
		if (this.needsUpdating) {
			this.matrix = this.updateMatrix()
			this.needsUpdating = false
		}

		if (!shader) {
			shader = this.shader
		}

		shader.bind()
		if (shader.lastFrameUniformLoaded !== renderer.getFrameCounter()) {
			shader.lastFrameUniformLoaded = renderer.getFrameCounter()
			shader.loadPerspective(renderer.getPerspectiveMatrix())
			shader.loadView(renderer.getViewMatrix())
			shader.loadDirectionalLights(renderer.getDirectionalLights())
			shader.loadSpotlights(renderer.getSpotights())
			shader.loadProjectingLights(
				renderer.getLightProjectors(),
				renderer.getLightProjectorTexture()
			)
			shader.loadProjectingLightsDepthTextures(renderer.getProjectorDepthTextures())
		}

		shader.loadParameters()
		if (transformation) {
			shader.loadObjectMatrix(transformation.mul(this.matrix))
		} else {
			shader.loadObjectMatrix(this.matrix)
		}
		this.model.bind(gl)
		this.model.render(gl)
	}
}

export class EntityTree extends EntityKernel implements EntityInterface {
	public entities: EntityInterface[]

	public constructor(entities: EntityInterface[]) {
		super()
		this.entities = entities
	}

	public update(delta: number, inputHandler: InputHandler) {}

	public render(
		gl: WebGL2RenderingContext,
		renderer: Renderer,
		transformation?: Matrix4,
		shader?: Shader
	): void {
		if (this.needsUpdating) {
			this.matrix = this.updateMatrix()
			this.needsUpdating = false
		}

		this.entities.forEach((entity) => {
			let matrix: Matrix4
			if (transformation) {
				matrix = transformation.mul(this.matrix)
			} else {
				matrix = this.matrix
			}

			entity.render(gl, renderer, matrix, shader)
		})
	}
}

export class DummyEntity extends EntityKernel implements EntityInterface {
	update(delta: number, inputHandler: InputHandler): void {}
	render(
		gl: WebGL2RenderingContext,
		renderer: Renderer,
		transformation?: Matrix4,
		shader?: Shader
	): void {}
}
