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

	public rotateXAroundOrigin(angle: number): void {
		let position = this.positionMatrix.col(3)
		this.positionMatrix[12] = 0
		this.positionMatrix[13] = 0
		this.positionMatrix[14] = 0
		this.positionMatrix = Matrix4.rotate(new Vector3(angle, 0, 0)).mul(this.positionMatrix)
		this.positionMatrix[12] = position[0]
		this.positionMatrix[13] = position[1]
		this.positionMatrix[14] = position[2]
		this.needsUpdating = true
	}

	public rotateYAroundOrigin(angle: number): void {
		let position = this.positionMatrix.col(3)
		this.positionMatrix[12] = 0
		this.positionMatrix[13] = 0
		this.positionMatrix[14] = 0
		this.positionMatrix = Matrix4.rotate(new Vector3(0, angle, 0)).mul(this.positionMatrix)
		this.positionMatrix[12] = position[0]
		this.positionMatrix[13] = position[1]
		this.positionMatrix[14] = position[2]
		this.needsUpdating = true
	}

	public rotateZAroundOrigin(angle: number): void {
		let position = this.positionMatrix.col(3)
		this.positionMatrix[12] = 0
		this.positionMatrix[13] = 0
		this.positionMatrix[14] = 0
		this.positionMatrix = Matrix4.rotate(new Vector3(0, 0, angle)).mul(this.positionMatrix)
		this.positionMatrix[12] = position[0]
		this.positionMatrix[13] = position[1]
		this.positionMatrix[14] = position[2]
		this.needsUpdating = true
	}

	public rotateX(angle: number): void {
		this.positionMatrix = Matrix4.rotate(new Vector3(angle, 0, 0)).mul(this.positionMatrix)
		this.needsUpdating = true
	}

	public rotateY(angle: number): void {
		this.positionMatrix = Matrix4.rotate(new Vector3(0, angle, 0)).mul(this.positionMatrix)
		this.needsUpdating = true
	}

	public rotateZ(angle: number): void {
		this.positionMatrix = Matrix4.rotate(new Vector3(0, 0, angle)).mul(this.positionMatrix)
		this.needsUpdating = true
	}

	public setRotationX(angle: number): void {
		const rotationMatrix = Matrix4.rotate(new Vector3(angle, 0, 0))
		rotationMatrix[12] = this.positionMatrix[12]
		rotationMatrix[13] = this.positionMatrix[13]
		rotationMatrix[14] = this.positionMatrix[14]
		this.positionMatrix = rotationMatrix
		this.needsUpdating = true
	}

	public setRotationY(angle: number): void {
		const rotationMatrix = Matrix4.rotate(new Vector3(0, angle, 0))
		rotationMatrix[12] = this.positionMatrix[12]
		rotationMatrix[13] = this.positionMatrix[13]
		rotationMatrix[14] = this.positionMatrix[14]
		this.positionMatrix = rotationMatrix
		this.needsUpdating = true
	}

	public setRotationZ(angle: number): void {
		const rotationMatrix = Matrix4.rotate(new Vector3(0, 0, angle))
		rotationMatrix[12] = this.positionMatrix[12]
		rotationMatrix[13] = this.positionMatrix[13]
		rotationMatrix[14] = this.positionMatrix[14]
		this.positionMatrix = rotationMatrix
		this.needsUpdating = true
	}

	public scaleX(amount: number): void {
		this.scale[0] *= amount
		this.needsUpdating = true
	}

	public scaleY(amount: number): void {
		this.scale[1] *= amount
		this.needsUpdating = true
	}

	public scaleZ(amount: number): void {
		this.scale[2] *= amount
		this.needsUpdating = true
	}

	public setScaleX(amount: number): void {
		this.scale[0] = amount
		this.needsUpdating = true
	}

	public setScaleY(amount: number): void {
		this.scale[1] = amount
		this.needsUpdating = true
	}

	public setScaleZ(amount: number): void {
		this.scale[2] = amount
		this.needsUpdating = true
	}

	public setScale(amount: number): void {
		this.scale[0] = amount
		this.scale[1] = amount
		this.scale[2] = amount
		this.needsUpdating = true
	}

	public moveX(amount: number): void {
		this.positionMatrix = this.positionMatrix.mul(Matrix4.translate(new Vector3(amount, 0, 0)))
		this.needsUpdating = true
	}

	public moveY(amount: number): void {
		this.positionMatrix = this.positionMatrix.mul(Matrix4.translate(new Vector3(0, amount, 0)))
		this.needsUpdating = true
	}

	public moveZ(amount: number): void {
		this.positionMatrix = this.positionMatrix.mul(Matrix4.translate(new Vector3(0, 0, amount)))
		this.needsUpdating = true
	}

	public setPositionX(amount: number): void {
		this.positionMatrix[12] = amount
		this.needsUpdating = true
	}

	public setPositionY(amount: number): void {
		this.positionMatrix[13] = amount
		this.needsUpdating = true
	}

	public setPositionZ(amount: number): void {
		this.positionMatrix[14] = amount
		this.needsUpdating = true
	}

	public setPosition(x: number, y: number, z: number): void {
		this.positionMatrix[12] = x
		this.positionMatrix[13] = y
		this.positionMatrix[14] = z
		this.needsUpdating = true
	}

	public getPosition(): Vector3 {
		return this.positionMatrix.col(3).xyz()
	}

	public getFrame(): Matrix4 {
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

	public update(delta: number, inputHandler: InputHandler): void {}

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
			shader.loadPerspectiveMatrix(renderer.getPerspectiveMatrix())
			shader.loadViewMatrix(renderer.getViewMatrix())
			shader.loadDirectionalLights(renderer.getDirectionalLights())
			shader.loadSpotlights(renderer.getSpotights())
			shader.loadProjectingLights(
				renderer.getLightProjectors(),
				renderer.getLightProjectorTexture()
			)
			shader.loadProjectingLightsDepthTextures(renderer.getProjectorsDepthTextures())
			shader.loadSun(renderer.getSunMatrix(), renderer.getSunDepthTexture())
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

	public update(delta: number, inputHandler: InputHandler): void {}

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
