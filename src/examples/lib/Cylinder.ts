import { Model } from './Model'
import { glCall } from './Utils'

export class Cylinder implements Model {
	buffer: WebGLBuffer
	ibo: WebGLBuffer
	subdivisions: number = 32

	constructor(gl: WebGLRenderingContext) {
		const step = (Math.PI * 2) / this.subdivisions
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
		for (let i = 0; i < this.subdivisions; i++) {
			indices.push(0, i + 1, ((i + 1) % this.subdivisions) + 1)
			indices.push(
				this.subdivisions + 1,
				this.subdivisions + 1 + i + 1,
				this.subdivisions + 1 + ((i + 1) % this.subdivisions) + 1
			)
			indices.push(
				i + 1,
				((i + 1) % this.subdivisions) + 1,
				this.subdivisions + 1 + ((i + 1) % this.subdivisions) + 1
			)
			indices.push(
				i + 1,
				this.subdivisions + 1 + ((i + 1) % this.subdivisions) + 1,
				this.subdivisions + 1 + i + 1
			)
		}
		const typedIndices = new Uint16Array(indices)

		this.buffer = glCall(gl, gl.createBuffer)
		this.ibo = glCall(gl, gl.createBuffer)
		this.bind(gl)

		gl.bufferData(gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

		this.unbind(gl)
	}

	destroy(gl: WebGLRenderingContext): void {
		glCall(gl, gl.deleteBuffer, this.buffer)
		glCall(gl, gl.deleteBuffer, this.ibo)
	}

	bind(gl: WebGLRenderingContext): void {
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, this.buffer)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, this.ibo)
		glCall(gl, gl.enableVertexAttribArray, 0)
		glCall(gl, gl.vertexAttribPointer, 0, 3, gl.FLOAT, false, 4 * 3, 0)
	}

	unbind(gl: WebGLRenderingContext): void {
		glCall(gl, gl.disableVertexAttribArray, 0)
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, null)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, null)
	}

	render(gl: WebGLRenderingContext): void {
		this.bind(gl)
		glCall(gl, gl.drawElements, gl.TRIANGLES, this.subdivisions * 3 * 4, gl.UNSIGNED_SHORT, 0)
		this.unbind(gl)
	}
}
