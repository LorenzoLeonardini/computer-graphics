export interface Vector extends Float32Array {
	add(vec: Vector): Vector
	sub(vec: Vector): Vector
	mul(num: number): Vector
	dot(vec: Vector): number
	getLength(): number
	normalize(): Vector
	copy(): Vector
}

export class Vector2 extends Float32Array implements Vector {
	constructor(x: number, y: number) {
		super([x, y])
	}

	add(vec: Vector2): Vector2 {
		this[0] += vec[0]
		this[1] += vec[1]
		return this
	}

	sub(vec: Vector2): Vector2 {
		this[0] -= vec[0]
		this[1] -= vec[1]
		return this
	}

	mul(num: number): Vector2 {
		this[0] *= num
		this[1] *= num
		return this
	}

	dot(vec: Vector2): number {
		return this[0] * vec[0] + this[1] * vec[1]
	}

	getLength(): number {
		return Math.sqrt(this[0] * this[0] + this[1] * this[1])
	}

	normalize(): Vector2 {
		let len = this.getLength()
		this[0] /= len
		this[1] /= len
		return this
	}

	copy(): Vector2 {
		return new Vector2(this[0], this[1])
	}
}

export class Vector3 extends Float32Array implements Vector {
	constructor(x: number, y: number, z: number) {
		super([x, y, z])
	}

	add(vec: Vector3): Vector3 {
		this[0] += vec[0]
		this[1] += vec[1]
		this[2] += vec[2]
		return this
	}

	sub(vec: Vector3): Vector3 {
		this[0] -= vec[0]
		this[1] -= vec[1]
		this[2] -= vec[2]
		return this
	}

	mul(num: number): Vector3 {
		this[0] *= num
		this[1] *= num
		this[2] *= num
		return this
	}

	dot(vec: Vector3): number {
		return this[0] * vec[0] + this[1] * vec[1] + this[2] * vec[2]
	}

	cross(vec: Vector3): Vector3 {
		return new Vector3(
			this[1] * vec[2] - this[2] * vec[1],
			this[2] * vec[0] - this[0] * vec[2],
			this[0] * vec[1] - this[1] * vec[0]
		)
	}

	getLength(): number {
		return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2])
	}

	normalize(): Vector3 {
		let len = this.getLength()
		this[0] /= len
		this[1] /= len
		this[2] /= len
		return this
	}

	copy(): Vector3 {
		return new Vector3(this[0], this[1], this[2])
	}
}

export class Vector4 extends Float32Array implements Vector {
	constructor(x: number, y: number, z: number, w: number) {
		super([x, y, z, w])
	}

	add(vec: Vector4): Vector4 {
		this[0] += vec[0]
		this[1] += vec[1]
		this[2] += vec[2]
		this[3] += vec[3]
		return this
	}

	sub(vec: Vector4): Vector4 {
		this[0] -= vec[0]
		this[1] -= vec[1]
		this[2] -= vec[2]
		this[3] -= vec[3]
		return this
	}

	mul(num: number): Vector4 {
		this[0] *= num
		this[1] *= num
		this[2] *= num
		this[3] *= num
		return this
	}

	dot(vec: Vector4): number {
		return this[0] * vec[0] + this[1] * vec[1] + this[2] * vec[2] + this[3] * vec[3]
	}

	getLength(): number {
		return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3])
	}

	normalize(): Vector4 {
		let len = this.getLength()
		this[0] /= len
		this[1] /= len
		this[2] /= len
		this[3] /= len
		return this
	}

	copy(): Vector4 {
		return new Vector4(this[0], this[1], this[2], this[3])
	}
}
