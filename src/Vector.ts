interface Vector {
	add: (vec: Vector) => Vector,
	sub: (vec: Vector) => Vector,
	mul: (num: number) => Vector,
	dot: (vec: Vector) => number,
	length: () => number,
	normalize: () => Vector
}

class Vector2 implements Vector {
	x: number
	y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	add(vec: Vector2): Vector2 {
		this.x += vec.x
		this.y += vec.y
		return this
	}

	sub(vec: Vector2): Vector2 {
		this.x -= vec.x
		this.y -= vec.y
		return this
	}

	mul(num: number): Vector2 {
		this.x *= num
		this.y *= num
		return this
	}

	dot(vec: Vector2): number {
		return this.x * vec.x + this.y * vec.y
	}

	length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}

	normalize(): Vector2 {
		let len = this.length()
		this.x /= len
		this.y /= len
		return this
	}
}

class Vector3 implements Vector {
	x: number
	y: number
	z: number

	constructor(x: number, y: number, z: number) {
		this.x = x
		this.y = y
		this.z = z
	}

	add(vec: Vector3): Vector3 {
		this.x += vec.x
		this.y += vec.y
		this.z += vec.z
		return this
	}

	sub(vec: Vector3): Vector3 {
		this.x -= vec.x
		this.y -= vec.y
		this.z -= vec.z
		return this
	}

	mul(num: number): Vector3 {
		this.x *= num
		this.y *= num
		this.z *= num
		return this
	}

	dot(vec: Vector3): number {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z
	}

	length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
	}

	normalize(): Vector3 {
		let len = this.length()
		this.x /= len
		this.y /= len
		this.z /= len
		return this
	}
}

class Vector4 implements Vector {
	x: number
	y: number
	z: number
	w: number

	constructor(x: number, y: number, z: number, w: number) {
		this.x = x
		this.y = y
		this.z = z
		this.w = w
	}

	add(vec: Vector4): Vector4 {
		this.x += vec.x
		this.y += vec.y
		this.z += vec.z
		this.w += vec.w
		return this
	}

	sub(vec: Vector4): Vector4 {
		this.x -= vec.x
		this.y -= vec.y
		this.z -= vec.z
		this.w -= vec.w
		return this
	}

	mul(num: number): Vector4 {
		this.x *= num
		this.y *= num
		this.z *= num
		this.w *= num
		return this
	}

	dot(vec: Vector4): number {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z + this.w * vec.w
	}

	length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
	}

	normalize(): Vector4 {
		let len = this.length()
		this.x /= len
		this.y /= len
		this.z /= len
		this.w /= len
		return this
	}
}