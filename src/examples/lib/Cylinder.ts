import { Model } from './Model'

const SUBDIVISIONS: number = 32

export class Cylinder implements Model {
	static vao: WebGLVertexArrayObject
	static buffer: WebGLBuffer
	static ibo: WebGLBuffer
	static count: number = 0
	indicesCount: number = 0

	constructor(gl: WebGL2RenderingContext) {
		if (Cylinder.count > 0) {
			return
		}
		Cylinder.count += 1

		const step = (Math.PI * 2) / SUBDIVISIONS
		const vertices = []

		vertices.push(0, -1, 0)
		for (let angle = 0; angle < Math.PI * 2; angle += step) {
			const y = Math.sin(angle)
			const x = Math.cos(angle)
			vertices.push(x, -1, y)
		}

		vertices.push(0, 1, 0)
		for (let angle = 0; angle < Math.PI * 2; angle += step) {
			const y = Math.sin(angle)
			const x = Math.cos(angle)
			vertices.push(x, 1, y)
		}

		const typedVertices = new Float32Array(vertices)

		const indices = []
		for (let i = 0; i < SUBDIVISIONS; i++) {
			indices.push(0, i + 1, ((i + 1) % SUBDIVISIONS) + 1)
			indices.push(
				SUBDIVISIONS + 1,
				SUBDIVISIONS + 1 + ((i + 1) % SUBDIVISIONS) + 1,
				SUBDIVISIONS + 1 + i + 1
			)
			indices.push(
				i + 1,
				SUBDIVISIONS + 1 + ((i + 1) % SUBDIVISIONS) + 1,
				((i + 1) % SUBDIVISIONS) + 1
			)
			indices.push(i + 1, SUBDIVISIONS + 1 + i + 1, SUBDIVISIONS + 1 + ((i + 1) % SUBDIVISIONS) + 1)
		}
		this.indicesCount = indices.length
		const typedIndices = new Uint16Array(indices)

		Cylinder.vao = gl.createVertexArray()
		gl.bindVertexArray(Cylinder.vao)

		Cylinder.buffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, Cylinder.buffer)

		Cylinder.ibo = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cylinder.ibo)

		gl.bufferData(gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

		gl.enableVertexAttribArray(0)
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 4 * 3, 0)
	}

	destroy(gl: WebGL2RenderingContext): void {
		Cylinder.count -= 1
		if (Cylinder.count === 0) {
			gl.deleteBuffer(Cylinder.buffer)
			gl.deleteBuffer(Cylinder.ibo)
			gl.deleteVertexArray(Cylinder.vao)
		}
	}

	bind(gl: WebGL2RenderingContext): void {
		gl.bindVertexArray(Cylinder.vao)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cylinder.ibo)
	}

	unbind(gl: WebGL2RenderingContext): void {}

	render(gl: WebGL2RenderingContext): void {
		gl.drawElements(gl.TRIANGLES, this.indicesCount, gl.UNSIGNED_SHORT, 0)
	}
}
