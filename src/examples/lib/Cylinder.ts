import { Model } from './Model'
import { glCall } from './Utils'

const SUBDIVISIONS: number = 32

export class Cylinder implements Model {
	static buffer: WebGLBuffer
	static ibo: WebGLBuffer
	static count: number = 0

	constructor(gl: WebGLRenderingContext) {
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
				SUBDIVISIONS + 1 + i + 1,
				SUBDIVISIONS + 1 + ((i + 1) % SUBDIVISIONS) + 1
			)
			indices.push(
				i + 1,
				((i + 1) % SUBDIVISIONS) + 1,
				SUBDIVISIONS + 1 + ((i + 1) % SUBDIVISIONS) + 1
			)
			indices.push(i + 1, SUBDIVISIONS + 1 + ((i + 1) % SUBDIVISIONS) + 1, SUBDIVISIONS + 1 + i + 1)
		}
		const typedIndices = new Uint16Array(indices)

		Cylinder.buffer = glCall(gl, gl.createBuffer)
		Cylinder.ibo = glCall(gl, gl.createBuffer)
		Cylinder.bind(gl)

		gl.bufferData(gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

		Cylinder.unbind(gl)
	}

	destroy(gl: WebGLRenderingContext): void {
		Cylinder.count -= 1
		if (Cylinder.count === 0) {
			glCall(gl, gl.deleteBuffer, Cylinder.buffer)
			glCall(gl, gl.deleteBuffer, Cylinder.ibo)
		}
	}

	static bind(gl: WebGLRenderingContext): void {
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, Cylinder.buffer)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, Cylinder.ibo)
		glCall(gl, gl.enableVertexAttribArray, 0)
		glCall(gl, gl.vertexAttribPointer, 0, 3, gl.FLOAT, false, 4 * 3, 0)
	}

	static unbind(gl: WebGLRenderingContext): void {
		glCall(gl, gl.disableVertexAttribArray, 0)
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, null)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, null)
	}

	render(gl: WebGLRenderingContext): void {
		glCall(gl, gl.drawElements, gl.TRIANGLES, SUBDIVISIONS * 3 * 4, gl.UNSIGNED_SHORT, 0)
	}
}
