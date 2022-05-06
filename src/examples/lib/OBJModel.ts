import { Model } from './Model'
import { glCall } from './Utils'

export class OBJModel implements Model {
	vao: WebGLVertexArrayObject
	buffer: WebGLBuffer
	ibo: WebGLBuffer
	vertexCount: number

	constructor(
		gl: WebGL2RenderingContext,
		model: {
			vertices: number[]
			indices: number[]
		}
	) {
		const vertices = model.vertices
		const typedVertices = new Float32Array(vertices)

		const indices = model.indices
		const typedIndices = new Uint16Array(indices)

		this.vao = glCall(gl, gl.createVertexArray)
		glCall(gl, gl.bindVertexArray, this.vao)

		this.buffer = glCall(gl, gl.createBuffer)
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, this.buffer)

		this.ibo = glCall(gl, gl.createBuffer)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, this.ibo)

		this.vertexCount = indices.length

		glCall(gl, gl.bufferData, gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		glCall(gl, gl.bufferData, gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

		glCall(gl, gl.enableVertexAttribArray, 0)
		glCall(gl, gl.enableVertexAttribArray, 1)
		glCall(gl, gl.enableVertexAttribArray, 2)
		glCall(gl, gl.vertexAttribPointer, 0, 3, gl.FLOAT, false, 4 * 8, 0)
		glCall(gl, gl.vertexAttribPointer, 1, 2, gl.FLOAT, false, 4 * 8, 4 * 3)
		glCall(gl, gl.vertexAttribPointer, 2, 3, gl.FLOAT, false, 4 * 8, 4 * 5)
	}

	destroy(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.deleteBuffer, this.buffer)
		glCall(gl, gl.deleteBuffer, this.ibo)
		glCall(gl, gl.deleteVertexArray, this.vao)
	}

	bind(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.bindVertexArray, this.vao)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, this.ibo)
	}

	unbind(gl: WebGL2RenderingContext): void {}

	render(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.drawElements, gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0)
	}
}
