import { Vector, Vector2, Vector3, Vector4 } from './Vector'

export interface Matrix<T> extends Float32Array {
	add(mat: T): T
	sub(mat: T): T
	mul(num: number): T
	mul(vec: Vector): Vector
	mul(mat: T): T
	translate(vec: Vector): T
	rotate(vec: Vector): T
	scale(vec: Vector | number): T
	row(idx: number): Vector
	col(idx: number): Vector
	copy(): T
}

export class Matrix3 extends Float32Array implements Matrix<Matrix3> {
	constructor(
		value?: [number, number, number, number, number, number, number, number, number] | undefined
	) {
		if (value) {
			super([...value])
		} else {
			super([1, 0, 0, 0, 1, 0, 0, 0, 1])
		}
	}

	add(mat: Matrix3): Matrix3 {
		for (let i = 0; i < 9; i++) this[i] += mat[i]
		return this
	}

	sub(mat: Matrix3): Matrix3 {
		for (let i = 0; i < 9; i++) this[i] -= mat[i]
		return this
	}

	mul(b: number | Vector | Matrix3): any {
		if (b instanceof Matrix3) {
			return new Matrix3([
				this[0] * b[0] + this[3] * b[1] + this[6] * b[2],
				this[1] * b[0] + this[4] * b[1] + this[7] * b[2],
				this[2] * b[0] + this[5] * b[1] + this[8] * b[2],

				this[0] * b[3] + this[3] * b[4] + this[6] * b[5],
				this[1] * b[3] + this[4] * b[4] + this[7] * b[5],
				this[2] * b[3] + this[5] * b[4] + this[8] * b[5],

				this[0] * b[6] + this[3] * b[7] + this[6] * b[8],
				this[1] * b[6] + this[4] * b[7] + this[7] * b[8],
				this[2] * b[6] + this[5] * b[7] + this[8] * b[8]
			])
		} else if (b instanceof Vector3) {
			let x = this.row(0).dot(b)
			let y = this.row(1).dot(b)
			let z = this.row(2).dot(b)
			return new Vector3(x, y, z)
		} else if (typeof b === 'number') {
			for (let i = 0; i < 9; i++) this[i] *= b
			return this
		} else {
			throw new Error('Invalid input parameter type')
		}
	}

	translate(vec: Vector2 | Vector3 | Vector4): Matrix3 {
		let translation = new Matrix3([1, 0, 0, 0, 1, 0, vec[0], vec[1], 1])

		return translation.mul(this) as unknown as Matrix3
	}

	rotate(vec: Vector3): Matrix3 {
		if (vec[0] !== 0 || vec[1] !== 0) {
			throw new Error('Cannot rotate on axis different than z')
		}

		let rotation = new Matrix3([
			Math.cos(vec[2]),
			Math.sin(vec[2]),
			0,
			-Math.sin(vec[2]),
			Math.cos(vec[2]),
			0,
			0,
			0,
			1
		])

		return rotation.mul(this) as unknown as Matrix3
	}

	scale(vec: Vector2 | Vector3 | Vector4 | number): Matrix3 {
		if (typeof vec === 'number') {
			let scale = new Matrix3([vec, 0, 0, 0, vec, 0, 0, 0, 1])

			return scale.mul(this) as unknown as Matrix3
		} else {
			let scale = new Matrix3([vec[0], 0, 0, 0, vec[1], 0, 0, 0, 1])

			return scale.mul(this) as unknown as Matrix3
		}
	}

	row(idx: number): Vector3 {
		if (idx < 0 || idx >= 4) {
			throw new Error('Invalid index')
		}
		return new Vector3(this[idx], this[idx + 3], this[idx + 9])
	}

	col(idx: number): Vector3 {
		if (idx < 0 || idx >= 4) {
			throw new Error('Invalid index')
		}
		return new Vector3(this[idx * 3], this[idx * 3 + 1], this[idx * 3 + 2])
	}

	toString(): string {
		return `
[ ${this[0]}, ${this[3]}, ${this[6]},
  ${this[1]}, ${this[4]}, ${this[7]},
  ${this[2]}, ${this[5]}, ${this[8]} ]
		`
	}

	copy(): Matrix3 {
		return new Matrix3([
			this[0],
			this[1],
			this[2],
			this[3],
			this[4],
			this[5],
			this[6],
			this[7],
			this[8]
		])
	}
}

export class Matrix4 extends Float32Array implements Matrix<Matrix4> {
	constructor(
		value?:
			| [
					number,
					number,
					number,
					number,
					number,
					number,
					number,
					number,
					number,
					number,
					number,
					number,
					number,
					number,
					number,
					number
			  ]
			| undefined
	) {
		if (value) {
			super([...value])
		} else {
			super([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
		}
	}

	add(mat: Matrix4): Matrix4 {
		for (let i = 0; i < 16; i++) this[i] += mat[i]
		return this
	}

	sub(mat: Matrix4): Matrix4 {
		for (let i = 0; i < 16; i++) this[i] -= mat[i]
		return this
	}

	mul(b: number | Vector | Matrix4): any {
		if (b instanceof Matrix4) {
			return new Matrix4([
				this[0] * b[0] + this[4] * b[1] + this[8] * b[2] + this[12] * b[3],
				this[1] * b[0] + this[5] * b[1] + this[9] * b[2] + this[13] * b[3],
				this[2] * b[0] + this[6] * b[1] + this[10] * b[2] + this[14] * b[3],
				this[3] * b[0] + this[7] * b[1] + this[11] * b[2] + this[15] * b[3],

				this[0] * b[4] + this[4] * b[5] + this[8] * b[6] + this[12] * b[7],
				this[1] * b[4] + this[5] * b[5] + this[9] * b[6] + this[13] * b[7],
				this[2] * b[4] + this[6] * b[5] + this[10] * b[6] + this[14] * b[7],
				this[3] * b[4] + this[7] * b[5] + this[11] * b[6] + this[15] * b[7],

				this[0] * b[8] + this[4] * b[9] + this[8] * b[10] + this[12] * b[11],
				this[1] * b[8] + this[5] * b[9] + this[9] * b[10] + this[13] * b[11],
				this[2] * b[8] + this[6] * b[9] + this[10] * b[10] + this[14] * b[11],
				this[3] * b[8] + this[7] * b[9] + this[11] * b[10] + this[15] * b[11],

				this[0] * b[12] + this[4] * b[13] + this[8] * b[14] + this[12] * b[15],
				this[1] * b[12] + this[5] * b[13] + this[9] * b[14] + this[13] * b[15],
				this[2] * b[12] + this[6] * b[13] + this[10] * b[14] + this[14] * b[15],
				this[3] * b[12] + this[7] * b[13] + this[11] * b[14] + this[15] * b[15]
			])
		} else if (b instanceof Vector4) {
			let x = this.row(0).dot(b)
			let y = this.row(1).dot(b)
			let z = this.row(2).dot(b)
			let w = this.row(3).dot(b)
			return new Vector4(x, y, z, w)
		} else if (typeof b === 'number') {
			for (let i = 0; i < 16; i++) this[i] *= b
			return this
		} else {
			throw new Error('Invalid input parameter type')
		}
	}

	static translate(vec: Vector3 | Vector4): Matrix4 {
		return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, vec[0], vec[1], vec[2], 1])
	}

	translate(vec: Vector3 | Vector4): Matrix4 {
		let translation = Matrix4.translate(vec)

		return translation.mul(this) as unknown as Matrix4
	}

	static rotate(vec: Vector3): Matrix4 {
		if (vec[0] === 0 && vec[1] === 0 && vec[2] === 0) {
			return new Matrix4()
		}
		if (vec[0] !== 0 && vec[1] === 0 && vec[2] === 0) {
			return new Matrix4([
				1,
				0,
				0,
				0,
				0,
				Math.cos(vec[0]),
				Math.sin(vec[0]),
				0,
				0,
				-Math.sin(vec[0]),
				Math.cos(vec[0]),
				0,
				0,
				0,
				0,
				1
			])
		}
		if (vec[0] === 0 && vec[1] !== 0 && vec[2] === 0) {
			return new Matrix4([
				Math.cos(vec[1]),
				0,
				Math.sin(vec[1]),
				0,
				0,
				1,
				0,
				0,
				-Math.sin(vec[1]),
				0,
				Math.cos(vec[1]),
				0,
				0,
				0,
				0,
				1
			])
		}
		if (vec[0] === 0 && vec[1] === 0 && vec[2] !== 0) {
			return new Matrix4([
				Math.cos(vec[2]),
				Math.sin(vec[2]),
				0,
				0,
				-Math.sin(vec[2]),
				Math.cos(vec[2]),
				0,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				0,
				1
			])
		}
		throw new Error('Invalid rotation')
	}

	rotate(vec: Vector3): Matrix4 {
		const rotation = Matrix4.rotate(vec)
		return rotation.mul(this)
	}

	static scale(vec: Vector3 | Vector4 | number): Matrix4 {
		if (typeof vec === 'number') {
			return new Matrix4([vec, 0, 0, 0, 0, vec, 0, 0, 0, 0, vec, 0, 0, 0, 0, 1])
		} else {
			return new Matrix4([vec[0], 0, 0, 0, 0, vec[1], 0, 0, 0, 0, vec[2], 0, 0, 0, 0, 1])
		}
	}

	scale(vec: Vector3 | Vector4 | number): Matrix4 {
		let scale = Matrix4.scale(vec)
		return scale.mul(this)
	}

	row(idx: number): Vector4 {
		if (idx < 0 || idx >= 4) {
			throw new Error('Invalid index')
		}
		return new Vector4(this[idx], this[idx + 4], this[idx + 8], this[idx + 12])
	}

	col(idx: number): Vector4 {
		if (idx < 0 || idx >= 4) {
			throw new Error('Invalid index')
		}
		return new Vector4(this[idx * 4], this[idx * 4 + 1], this[idx * 4 + 2], this[idx * 4 + 3])
	}

	toString(): string {
		return `
[ ${this[0]}, ${this[4]}, ${this[8]}, ${this[12]},
  ${this[1]}, ${this[5]}, ${this[9]}, ${this[13]},
  ${this[2]}, ${this[6]}, ${this[10]}, ${this[14]}, 
  ${this[3]}, ${this[7]}, ${this[11]}, ${this[15]} ]
		`
	}

	static perspective(
		yfov: number,
		aspectRatio: number,
		nearPlane: number,
		farPlane: number
	): Matrix4 {
		const h = Math.tan(yfov / 2) * 2 * nearPlane
		const w = h / aspectRatio

		return new Matrix4([
			(2 * nearPlane) / w,
			0,
			0,
			0,
			0,
			(2 * nearPlane) / h,
			0,
			0,
			0,
			0,
			-(farPlane + nearPlane) / (farPlane - nearPlane),
			-1,
			0,
			0,
			(-2 * farPlane * nearPlane) / (farPlane - nearPlane),
			0
		])
	}

	copy(): Matrix4 {
		return new Matrix4([
			this[0],
			this[1],
			this[2],
			this[3],
			this[4],
			this[5],
			this[6],
			this[7],
			this[8],
			this[9],
			this[10],
			this[11],
			this[12],
			this[13],
			this[14],
			this[15]
		])
	}

	// This implementation is from the Mesa OpenGL function `__gluInvertMatrixd()` found in `project.c`
	inverse(): Matrix4 {
		let r = new Matrix4()
		r[0] =
			this[5] * this[10] * this[15] -
			this[5] * this[14] * this[11] -
			this[6] * this[9] * this[15] +
			this[6] * this[13] * this[11] +
			this[7] * this[9] * this[14] -
			this[7] * this[13] * this[10]
		r[1] =
			-this[1] * this[10] * this[15] +
			this[1] * this[14] * this[11] +
			this[2] * this[9] * this[15] -
			this[2] * this[13] * this[11] -
			this[3] * this[9] * this[14] +
			this[3] * this[13] * this[10]
		r[2] =
			this[1] * this[6] * this[15] -
			this[1] * this[14] * this[7] -
			this[2] * this[5] * this[15] +
			this[2] * this[13] * this[7] +
			this[3] * this[5] * this[14] -
			this[3] * this[13] * this[6]
		r[3] =
			-this[1] * this[6] * this[11] +
			this[1] * this[10] * this[7] +
			this[2] * this[5] * this[11] -
			this[2] * this[9] * this[7] -
			this[3] * this[5] * this[10] +
			this[3] * this[9] * this[6]

		r[4] =
			-this[4] * this[10] * this[15] +
			this[4] * this[14] * this[11] +
			this[6] * this[8] * this[15] -
			this[6] * this[12] * this[11] -
			this[7] * this[8] * this[14] +
			this[7] * this[12] * this[10]
		r[5] =
			this[0] * this[10] * this[15] -
			this[0] * this[14] * this[11] -
			this[2] * this[8] * this[15] +
			this[2] * this[12] * this[11] +
			this[3] * this[8] * this[14] -
			this[3] * this[12] * this[10]
		r[6] =
			-this[0] * this[6] * this[15] +
			this[0] * this[14] * this[7] +
			this[2] * this[4] * this[15] -
			this[2] * this[12] * this[7] -
			this[3] * this[4] * this[14] +
			this[3] * this[12] * this[6]
		r[7] =
			this[0] * this[6] * this[11] -
			this[0] * this[10] * this[7] -
			this[2] * this[4] * this[11] +
			this[2] * this[8] * this[7] +
			this[3] * this[4] * this[10] -
			this[3] * this[8] * this[6]

		r[8] =
			this[4] * this[9] * this[15] -
			this[4] * this[13] * this[11] -
			this[5] * this[8] * this[15] +
			this[5] * this[12] * this[11] +
			this[7] * this[8] * this[13] -
			this[7] * this[12] * this[9]
		r[9] =
			-this[0] * this[9] * this[15] +
			this[0] * this[13] * this[11] +
			this[1] * this[8] * this[15] -
			this[1] * this[12] * this[11] -
			this[3] * this[8] * this[13] +
			this[3] * this[12] * this[9]
		r[10] =
			this[0] * this[5] * this[15] -
			this[0] * this[13] * this[7] -
			this[1] * this[4] * this[15] +
			this[1] * this[12] * this[7] +
			this[3] * this[4] * this[13] -
			this[3] * this[12] * this[5]
		r[11] =
			-this[0] * this[5] * this[11] +
			this[0] * this[9] * this[7] +
			this[1] * this[4] * this[11] -
			this[1] * this[8] * this[7] -
			this[3] * this[4] * this[9] +
			this[3] * this[8] * this[5]

		r[12] =
			-this[4] * this[9] * this[14] +
			this[4] * this[13] * this[10] +
			this[5] * this[8] * this[14] -
			this[5] * this[12] * this[10] -
			this[6] * this[8] * this[13] +
			this[6] * this[12] * this[9]
		r[13] =
			this[0] * this[9] * this[14] -
			this[0] * this[13] * this[10] -
			this[1] * this[8] * this[14] +
			this[1] * this[12] * this[10] +
			this[2] * this[8] * this[13] -
			this[2] * this[12] * this[9]
		r[14] =
			-this[0] * this[5] * this[14] +
			this[0] * this[13] * this[6] +
			this[1] * this[4] * this[14] -
			this[1] * this[12] * this[6] -
			this[2] * this[4] * this[13] +
			this[2] * this[12] * this[5]
		r[15] =
			this[0] * this[5] * this[10] -
			this[0] * this[9] * this[6] -
			this[1] * this[4] * this[10] +
			this[1] * this[8] * this[6] +
			this[2] * this[4] * this[9] -
			this[2] * this[8] * this[5]
		return r
	}
}
