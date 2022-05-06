import { Model } from './Model'
import { glCall } from './Utils'

export class Quad implements Model {
	static vao: WebGLVertexArrayObject
	static buffer: WebGLBuffer
	static ibo: WebGLBuffer
	static count: number = 0

	constructor(gl: WebGL2RenderingContext) {
		if (Quad.count > 0) {
			return
		}
		Quad.count += 1

		const vertices = [
			-1, -1, 0, 0, 1, 0, 0, 1, 1, -1, 0, 1, 1, 0, 0, 1, -1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0,
			0, 1
		]
		const typedVertices = new Float32Array(vertices)

		const indices = [0, 1, 2, 2, 1, 3]
		const typedIndices = new Uint16Array(indices)

		Quad.vao = glCall(gl, gl.createVertexArray)
		glCall(gl, gl.bindVertexArray, Quad.vao)

		Quad.buffer = glCall(gl, gl.createBuffer)
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, Quad.buffer)

		Quad.ibo = glCall(gl, gl.createBuffer)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, Quad.ibo)

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
		Quad.count -= 1
		if (Quad.count === 0) {
			glCall(gl, gl.deleteBuffer, Quad.buffer)
			glCall(gl, gl.deleteBuffer, Quad.ibo)
			glCall(gl, gl.deleteVertexArray, Quad.vao)
		}
	}

	static bind(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.bindVertexArray, Quad.vao)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, Quad.ibo)
	}

	static unbind(gl: WebGL2RenderingContext): void {}

	render(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.drawElements, gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
	}
}
