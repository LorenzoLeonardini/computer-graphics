import { Vector, Vector2, Vector3, Vector4 } from './Vector'

type MulType = Matrix | Vector | number
type MulRetType<T> =
	T extends Matrix ? Matrix :
	T extends Vector ? Vector :
	Matrix

export interface Matrix {
	add: (mat: Matrix) => Matrix,
	sub: (mat: Matrix) => Matrix,
	mul: <T extends MulType>(b: T) => MulRetType<T>,
	translate: (vec: Vector) => Matrix,
	rotate: (vec: Vector) => Matrix,
	scale: (vec: Vector | number) => Matrix,
	row: (idx: number) => Vector,
	col: (idx: number) => Vector,
}

export class Matrix3 implements Matrix {
	value: Float32Array

	constructor(value?: [number, number, number, number, number, number, number, number, number] | undefined) {
		if (value) {
			this.value = new Float32Array([...value])
		} else {
			this.value = new Float32Array([
				1, 0, 0,
				0, 1, 0,
				0, 0, 1
			])
		}
	}

	add(mat: Matrix3): Matrix3 {
		for (let i = 0; i < 9; i++)
			this.value[i] += mat.value[i]
		return this
	}

	sub(mat: Matrix3): Matrix3 {
		for (let i = 0; i < 9; i++)
			this.value[i] -= mat.value[i]
		return this
	}

	mul<T extends MulType>(b: T): MulRetType<T> {
		if (b instanceof Matrix3) {
			return new Matrix3([
				this.value[0] * b.value[0] + this.value[1] * b.value[3] + this.value[2] * b.value[6],
				this.value[0] * b.value[1] + this.value[1] * b.value[4] + this.value[2] * b.value[7],
				this.value[0] * b.value[2] + this.value[1] * b.value[5] + this.value[2] * b.value[8],

				this.value[3] * b.value[0] + this.value[4] * b.value[3] + this.value[5] * b.value[6],
				this.value[3] * b.value[1] + this.value[4] * b.value[4] + this.value[5] * b.value[7],
				this.value[3] * b.value[2] + this.value[4] * b.value[5] + this.value[5] * b.value[8],

				this.value[6] * b.value[0] + this.value[7] * b.value[3] + this.value[8] * b.value[6],
				this.value[6] * b.value[1] + this.value[7] * b.value[4] + this.value[8] * b.value[7],
				this.value[6] * b.value[2] + this.value[7] * b.value[5] + this.value[8] * b.value[8],
			]) as unknown as MulRetType<T>
		} else if (b instanceof Vector3) {
			let x = this.row(0).dot(b)
			let y = this.row(1).dot(b)
			let z = this.row(2).dot(b)
			return new Vector3(x, y, z) as unknown as MulRetType<T>
		} else if (typeof b === 'number') {
			for (let i = 0; i < 9; i++)
				this.value[i] *= b
			return this as unknown as MulRetType<T>
		} else {
			throw new Error('Invalid input parameter type')
		}
	}

	translate(vec: Vector2 | Vector3 | Vector4): Matrix3 {
		let translation = new Matrix3([
			1, 0, vec.x,
			0, 1, vec.y,
			0, 0, 1
		])

		return translation.mul(this) as unknown as Matrix3
	}

	rotate(vec: Vector3): Matrix3 {
		if (vec.x !== 0 || vec.y !== 0) {
			throw new Error('Cannot rotate on axis different than z')
		}

		let rotation = new Matrix3([
			Math.cos(vec.z), -Math.sin(vec.z), 0,
			Math.sin(vec.z), Math.cos(vec.z), 0,
			0, 0, 1
		])

		return rotation.mul(this) as unknown as Matrix3
	}

	scale(vec: Vector2 | Vector3 | Vector4 | number): Matrix3 {
		if (typeof vec === 'number') {
			let scale = new Matrix3([
				vec, 0, 0,
				0, vec, 0,
				0, 0, 1
			])

			return scale.mul(this) as unknown as Matrix3
		} else {
			let scale = new Matrix3([
				vec.x, 0, 0,
				0, vec.y, 0,
				0, 0, 1
			])

			return scale.mul(this) as unknown as Matrix3
		}
	}

	row(idx: number): Vector3 {
		if (idx < 0 || idx >= 4) {
			throw new Error('Invalid index')
		}
		return new Vector3(this.value[idx * 3], this.value[idx * 3 + 1], this.value[idx * 3 + 2])
	}

	col(idx: number): Vector3 {
		if (idx < 0 || idx >= 4) {
			throw new Error('Invalid index')
		}
		return new Vector3(this.value[idx], this.value[idx + 3], this.value[idx + 9])
	}


	toString(): string {
		return `
[ ${this.value[0]}, ${this.value[1]}, ${this.value[2]},
  ${this.value[3]}, ${this.value[4]}, ${this.value[5]},
  ${this.value[6]}, ${this.value[7]}, ${this.value[8]} ]
		`
	}

}

export class Matrix4 implements Matrix {
	value: Float32Array

	constructor(value?: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] | undefined) {
		if (value) {
			this.value = new Float32Array([...value])
		} else {
			this.value = new Float32Array([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			])
		}
	}

	add(mat: Matrix4): Matrix4 {
		for (let i = 0; i < 16; i++)
			this.value[i] += mat.value[i]
		return this
	}

	sub(mat: Matrix4): Matrix4 {
		for (let i = 0; i < 16; i++)
			this.value[i] -= mat.value[i]
		return this
	}

	mul<T extends MulType>(b: T): MulRetType<T> {
		if (b instanceof Matrix4) {
			return new Matrix4([
				this.value[0] * b.value[0] + this.value[1] * b.value[4] + this.value[2] * b.value[8] + this.value[3] * b.value[12],
				this.value[0] * b.value[1] + this.value[1] * b.value[5] + this.value[2] * b.value[9] + this.value[3] * b.value[13],
				this.value[0] * b.value[2] + this.value[1] * b.value[6] + this.value[2] * b.value[10] + this.value[3] * b.value[14],
				this.value[0] * b.value[3] + this.value[1] * b.value[7] + this.value[2] * b.value[11] + this.value[3] * b.value[15],

				this.value[4] * b.value[0] + this.value[5] * b.value[4] + this.value[6] * b.value[8] + this.value[7] * b.value[12],
				this.value[4] * b.value[1] + this.value[5] * b.value[5] + this.value[6] * b.value[9] + this.value[7] * b.value[13],
				this.value[4] * b.value[2] + this.value[5] * b.value[6] + this.value[6] * b.value[10] + this.value[7] * b.value[14],
				this.value[4] * b.value[3] + this.value[5] * b.value[7] + this.value[6] * b.value[11] + this.value[7] * b.value[15],

				this.value[8] * b.value[0] + this.value[9] * b.value[4] + this.value[10] * b.value[8] + this.value[11] * b.value[12],
				this.value[8] * b.value[1] + this.value[9] * b.value[5] + this.value[10] * b.value[9] + this.value[11] * b.value[13],
				this.value[8] * b.value[2] + this.value[9] * b.value[6] + this.value[10] * b.value[10] + this.value[11] * b.value[14],
				this.value[8] * b.value[3] + this.value[9] * b.value[7] + this.value[10] * b.value[11] + this.value[11] * b.value[15],

				this.value[12] * b.value[0] + this.value[13] * b.value[4] + this.value[14] * b.value[8] + this.value[15] * b.value[12],
				this.value[12] * b.value[1] + this.value[13] * b.value[5] + this.value[14] * b.value[9] + this.value[15] * b.value[13],
				this.value[12] * b.value[2] + this.value[13] * b.value[6] + this.value[14] * b.value[10] + this.value[15] * b.value[14],
				this.value[12] * b.value[3] + this.value[13] * b.value[7] + this.value[14] * b.value[11] + this.value[15] * b.value[15],
			]) as unknown as MulRetType<T>
		} else if (b instanceof Vector4) {
			let x = this.row(0).dot(b)
			let y = this.row(1).dot(b)
			let z = this.row(2).dot(b)
			let w = this.row(3).dot(b)
			return new Vector4(x, y, z, w) as unknown as MulRetType<T>
		} else if (typeof b === 'number') {
			for (let i = 0; i < 16; i++)
				this.value[i] *= b
			return this as unknown as MulRetType<T>
		} else {
			throw new Error('Invalid input parameter type')
		}
	}

	translate(vec: Vector3 | Vector4): Matrix4 {
		let translation = new Matrix4([
			1, 0, 0, vec.x,
			0, 1, 0, vec.y,
			0, 0, 1, vec.z,
			0, 0, 0, 1
		])

		return translation.mul(this) as unknown as Matrix4
	}

	rotate(vec: Vector3): Matrix4 {
		if (vec.x !== 0 && vec.y === 0 && vec.z === 0) {
			let rotation = new Matrix4([
				1, 0, 0, 0,
				0, Math.cos(vec.x), -Math.sin(vec.x), 0,
				0, Math.sin(vec.x), Math.cos(vec.x), 0,
				0, 0, 0, 1
			])

			return rotation.mul(this) as unknown as Matrix4
		} else if (vec.x === 0 && vec.y !== 0 && vec.z === 0) {
			let rotation = new Matrix4([
				Math.cos(vec.y), 0, -Math.sin(vec.y), 0,
				0, 1, 0, 0,
				Math.sin(vec.y), 0, Math.cos(vec.y), 0,
				0, 0, 0, 1
			])

			return rotation.mul(this) as unknown as Matrix4
		} else if (vec.x === 0 && vec.y === 0 && vec.z !== 0) {
			let rotation = new Matrix4([
				Math.cos(vec.z), -Math.sin(vec.z), 0, 0,
				Math.sin(vec.z), Math.cos(vec.z), 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			])

			return rotation.mul(this) as unknown as Matrix4
		} else {
			throw new Error('Invalid rotation')
		}
	}

	scale(vec: Vector3 | Vector4 | number): Matrix4 {
		if (typeof vec === 'number') {
			let scale = new Matrix4([
				vec, 0, 0, 0,
				0, vec, 0, 0,
				0, 0, vec, 0,
				0, 0, 0, 1
			])

			return scale.mul(this) as unknown as Matrix4
		} else {
			let scale = new Matrix4([
				vec.x, 0, 0, 0,
				0, vec.y, 0, 0,
				0, 0, vec.z, 0,
				0, 0, 0, 1
			])

			return scale.mul(this) as unknown as Matrix4
		}
	}

	row(idx: number): Vector4 {
		if (idx < 0 || idx >= 4) {
			throw new Error('Invalid index')
		}
		return new Vector4(this.value[idx * 4], this.value[idx * 4 + 1], this.value[idx * 4 + 2], this.value[idx * 4 + 3])
	}

	col(idx: number): Vector4 {
		if (idx < 0 || idx >= 4) {
			throw new Error('Invalid index')
		}
		return new Vector4(this.value[idx], this.value[idx + 4], this.value[idx + 8], this.value[idx + 12])
	}

	toString(): string {
		return `
[ ${this.value[0]}, ${this.value[1]}, ${this.value[2]}, ${this.value[3]},
  ${this.value[4]}, ${this.value[5]}, ${this.value[6]}, ${this.value[7]},
  ${this.value[8]}, ${this.value[9]}, ${this.value[10]}, ${this.value[11]}, 
  ${this.value[12]}, ${this.value[13]}, ${this.value[14]}, ${this.value[15]} ]
		`
	}

}