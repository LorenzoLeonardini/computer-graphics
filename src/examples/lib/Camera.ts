import { Material } from './Material'
import { Matrix4 } from './Matrix'
import { Model } from './Model'
import { Vector3 } from './Vector'

export class Camera {
	uid: number
	static IDS: number = 0

	perspective: Matrix4
	perspectiveChanged: boolean = false
	frame: Matrix4 = new Matrix4()
	frameChanged: boolean = false

	constructor(yfov: number, aspectRatio: number, nearPlane: number, farPlane: number) {
		this.uid = Camera.IDS++

		this.perspective = Matrix4.perspective(yfov, aspectRatio, nearPlane, farPlane)
		this.perspectiveChanged = true
	}

	position(x: number, y: number, z: number) {
		this.frame[12] = x
		this.frame[13] = y
		this.frame[14] = z
		this.frameChanged = true
	}

	move(x: number, y: number, z: number) {
		this.frame[12] += x
		this.frame[13] += y
		this.frame[14] += z
		this.frameChanged = true
	}

	lookAt(x: number, y: number, z: number) {
		let zDir = new Vector3(this.frame[12], this.frame[13], this.frame[14])
			.sub(new Vector3(x, y, z))
			.normalize()
		let up = new Vector3(0, 1, 0)
		let xDir = up.cross(zDir).normalize()
		let yDir = zDir.cross(xDir).normalize()

		this.frame[0] = xDir[0]
		this.frame[1] = xDir[1]
		this.frame[2] = xDir[2]

		this.frame[4] = yDir[0]
		this.frame[5] = yDir[1]
		this.frame[6] = yDir[2]

		this.frame[8] = zDir[0]
		this.frame[9] = zDir[1]
		this.frame[10] = zDir[2]
		this.frameChanged = true
	}

	// This implementation is from the Mesa OpenGL function `__gluInvertMatrixd()` found in `project.c`
	viewMatrix(): Matrix4 {
		let r = new Matrix4()
		r[0] =
			this.frame[5] * this.frame[10] * this.frame[15] -
			this.frame[5] * this.frame[14] * this.frame[11] -
			this.frame[6] * this.frame[9] * this.frame[15] +
			this.frame[6] * this.frame[13] * this.frame[11] +
			this.frame[7] * this.frame[9] * this.frame[14] -
			this.frame[7] * this.frame[13] * this.frame[10]
		r[1] =
			-this.frame[1] * this.frame[10] * this.frame[15] +
			this.frame[1] * this.frame[14] * this.frame[11] +
			this.frame[2] * this.frame[9] * this.frame[15] -
			this.frame[2] * this.frame[13] * this.frame[11] -
			this.frame[3] * this.frame[9] * this.frame[14] +
			this.frame[3] * this.frame[13] * this.frame[10]
		r[2] =
			this.frame[1] * this.frame[6] * this.frame[15] -
			this.frame[1] * this.frame[14] * this.frame[7] -
			this.frame[2] * this.frame[5] * this.frame[15] +
			this.frame[2] * this.frame[13] * this.frame[7] +
			this.frame[3] * this.frame[5] * this.frame[14] -
			this.frame[3] * this.frame[13] * this.frame[6]
		r[3] =
			-this.frame[1] * this.frame[6] * this.frame[11] +
			this.frame[1] * this.frame[10] * this.frame[7] +
			this.frame[2] * this.frame[5] * this.frame[11] -
			this.frame[2] * this.frame[9] * this.frame[7] -
			this.frame[3] * this.frame[5] * this.frame[10] +
			this.frame[3] * this.frame[9] * this.frame[6]

		r[4] =
			-this.frame[4] * this.frame[10] * this.frame[15] +
			this.frame[4] * this.frame[14] * this.frame[11] +
			this.frame[6] * this.frame[8] * this.frame[15] -
			this.frame[6] * this.frame[12] * this.frame[11] -
			this.frame[7] * this.frame[8] * this.frame[14] +
			this.frame[7] * this.frame[12] * this.frame[10]
		r[5] =
			this.frame[0] * this.frame[10] * this.frame[15] -
			this.frame[0] * this.frame[14] * this.frame[11] -
			this.frame[2] * this.frame[8] * this.frame[15] +
			this.frame[2] * this.frame[12] * this.frame[11] +
			this.frame[3] * this.frame[8] * this.frame[14] -
			this.frame[3] * this.frame[12] * this.frame[10]
		r[6] =
			-this.frame[0] * this.frame[6] * this.frame[15] +
			this.frame[0] * this.frame[14] * this.frame[7] +
			this.frame[2] * this.frame[4] * this.frame[15] -
			this.frame[2] * this.frame[12] * this.frame[7] -
			this.frame[3] * this.frame[4] * this.frame[14] +
			this.frame[3] * this.frame[12] * this.frame[6]
		r[7] =
			this.frame[0] * this.frame[6] * this.frame[11] -
			this.frame[0] * this.frame[10] * this.frame[7] -
			this.frame[2] * this.frame[4] * this.frame[11] +
			this.frame[2] * this.frame[8] * this.frame[7] +
			this.frame[3] * this.frame[4] * this.frame[10] -
			this.frame[3] * this.frame[8] * this.frame[6]

		r[8] =
			this.frame[4] * this.frame[9] * this.frame[15] -
			this.frame[4] * this.frame[13] * this.frame[11] -
			this.frame[5] * this.frame[8] * this.frame[15] +
			this.frame[5] * this.frame[12] * this.frame[11] +
			this.frame[7] * this.frame[8] * this.frame[13] -
			this.frame[7] * this.frame[12] * this.frame[9]
		r[9] =
			-this.frame[0] * this.frame[9] * this.frame[15] +
			this.frame[0] * this.frame[13] * this.frame[11] +
			this.frame[1] * this.frame[8] * this.frame[15] -
			this.frame[1] * this.frame[12] * this.frame[11] -
			this.frame[3] * this.frame[8] * this.frame[13] +
			this.frame[3] * this.frame[12] * this.frame[9]
		r[10] =
			this.frame[0] * this.frame[5] * this.frame[15] -
			this.frame[0] * this.frame[13] * this.frame[7] -
			this.frame[1] * this.frame[4] * this.frame[15] +
			this.frame[1] * this.frame[12] * this.frame[7] +
			this.frame[3] * this.frame[4] * this.frame[13] -
			this.frame[3] * this.frame[12] * this.frame[5]
		r[11] =
			-this.frame[0] * this.frame[5] * this.frame[11] +
			this.frame[0] * this.frame[9] * this.frame[7] +
			this.frame[1] * this.frame[4] * this.frame[11] -
			this.frame[1] * this.frame[8] * this.frame[7] -
			this.frame[3] * this.frame[4] * this.frame[9] +
			this.frame[3] * this.frame[8] * this.frame[5]

		r[12] =
			-this.frame[4] * this.frame[9] * this.frame[14] +
			this.frame[4] * this.frame[13] * this.frame[10] +
			this.frame[5] * this.frame[8] * this.frame[14] -
			this.frame[5] * this.frame[12] * this.frame[10] -
			this.frame[6] * this.frame[8] * this.frame[13] +
			this.frame[6] * this.frame[12] * this.frame[9]
		r[13] =
			this.frame[0] * this.frame[9] * this.frame[14] -
			this.frame[0] * this.frame[13] * this.frame[10] -
			this.frame[1] * this.frame[8] * this.frame[14] +
			this.frame[1] * this.frame[12] * this.frame[10] +
			this.frame[2] * this.frame[8] * this.frame[13] -
			this.frame[2] * this.frame[12] * this.frame[9]
		r[14] =
			-this.frame[0] * this.frame[5] * this.frame[14] +
			this.frame[0] * this.frame[13] * this.frame[6] +
			this.frame[1] * this.frame[4] * this.frame[14] -
			this.frame[1] * this.frame[12] * this.frame[6] -
			this.frame[2] * this.frame[4] * this.frame[13] +
			this.frame[2] * this.frame[12] * this.frame[5]
		r[15] =
			this.frame[0] * this.frame[5] * this.frame[10] -
			this.frame[0] * this.frame[9] * this.frame[6] -
			this.frame[1] * this.frame[4] * this.frame[10] +
			this.frame[1] * this.frame[8] * this.frame[6] +
			this.frame[2] * this.frame[4] * this.frame[9] -
			this.frame[2] * this.frame[8] * this.frame[5]
		return r
	}

	render(gl: WebGLRenderingContext, model: Model, material: Material, objectMat: Matrix4) {
		if (material.currentCamera !== this.uid || this.frameChanged || this.perspectiveChanged) {
			material.loadPerspective(gl, this.perspective)
			material.loadView(gl, this.viewMatrix())
			material.currentCamera = this.uid
			this.frameChanged = false
			this.perspectiveChanged = false
		}

		gl.uniformMatrix4fv(
			gl.getUniformLocation(material.shader.program, 'uObjectMat'),
			false,
			objectMat
		)
		material.prepareRender(gl)
		model.render(gl)
	}
}
