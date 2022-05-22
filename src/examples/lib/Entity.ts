import { Matrix4 } from './Matrix'
import { Model } from './Model'
import { Renderer } from './Renderer'
import { Shader } from './Shader'
import { Vector3 } from './Vector'

export interface EntityInterface {
	rotateX(angle: number): void
	rotateY(angle: number): void
	rotateZ(angle: number): void
	setRotationX(angle: number): void
	setRotationY(angle: number): void
	setRotationZ(angle: number): void
	render(gl: WebGL2RenderingContext, transformation?: Matrix4): void
}

class EntityKernel {
	protected position: Vector3 = new Vector3(0, 0, 0)
	protected rotation: Vector3 = new Vector3(0, 0, 0)
	protected scale: Vector3 = new Vector3(1, 1, 1)

	protected matrix: Matrix4
	protected needsUpdating: boolean = true

	rotateX(angle: number) {
		this.rotation[0] += angle
		this.needsUpdating = true
	}

	rotateY(angle: number) {
		this.rotation[1] += angle
		this.needsUpdating = true
	}

	rotateZ(angle: number) {
		this.rotation[2] += angle
		this.needsUpdating = true
	}

	setRotationX(angle: number) {
		this.rotation[0] = angle
		this.needsUpdating = true
	}

	setRotationY(angle: number) {
		this.rotation[1] = angle
		this.needsUpdating = true
	}

	setRotationZ(angle: number) {
		this.rotation[2] = angle
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
		this.position[0] += amount
		this.needsUpdating = true
	}

	moveY(amount: number): void {
		this.position[1] += amount
		this.needsUpdating = true
	}

	moveZ(amount: number): void {
		this.position[2] += amount
		this.needsUpdating = true
	}

	setPositionX(amount: number): void {
		this.position[0] = amount
		this.needsUpdating = true
	}

	setPositionY(amount: number): void {
		this.position[1] = amount
		this.needsUpdating = true
	}

	setPositionZ(amount: number): void {
		this.position[2] = amount
		this.needsUpdating = true
	}

	setPosition(x: number, y: number, z: number): void {
		this.position[0] = x
		this.position[1] = y
		this.position[2] = z
		this.needsUpdating = true
	}

	protected updateMatrix(): Matrix4 {
		return Matrix4.rotate(new Vector3(0, this.rotation[1], 0))
			.rotate(new Vector3(this.rotation[0], 0, 0))
			.rotate(new Vector3(0, 0, this.rotation[2]))
			.scale(this.scale)
			.translate(this.position)
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

	public render(gl: WebGL2RenderingContext, transformation?: Matrix4): void {
		if (this.needsUpdating) {
			this.matrix = this.updateMatrix()
			this.needsUpdating = false
		}

		this.shader.bind()
		if (this.shader.lastFrameUniformLoaded !== Renderer.getFrameCounter()) {
			this.shader.lastFrameUniformLoaded = Renderer.getFrameCounter()
			this.shader.loadPerspective(Renderer.getPerspectiveMatrix())
			this.shader.loadView(Renderer.getViewMatrix())
		}

		this.shader.loadParameters()
		if (transformation) {
			this.shader.loadObjectMatrix(transformation.mul(this.matrix))
		} else {
			this.shader.loadObjectMatrix(this.matrix)
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

	public render(gl: WebGL2RenderingContext, transformation?: Matrix4): void {
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

			entity.render(gl, matrix)
		})
	}
}
