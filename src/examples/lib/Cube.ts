import { Model } from './Model'
import { glCall } from './Utils'

export class Cube implements Model {
	static vao: WebGLVertexArrayObject
	static buffer: WebGLBuffer
	static ibo: WebGLBuffer
	static count: number = 0

	constructor(gl: WebGL2RenderingContext) {
		if (Cube.count > 0) {
			return
		}
		Cube.count += 1

		const vertices = [
			-1, -1, -1, 0, 0, 1, -1, -1, 1, 0, -1, 1, -1, 0, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 0, 1, -1, 1,
			0, 0, -1, 1, 1, 1, 1, 1, 1, 1, 0, 1
		]
		const typedVertices = new Float32Array(vertices)

		const indices = [
			0, 2, 1, 2, 3, 1, 4, 5, 6, 6, 5, 7, 2, 6, 3, 6, 7, 3, 4, 0, 5, 0, 1, 5, 1, 3, 5, 3, 7, 5, 4,
			6, 0, 0, 6, 2
		]
		const typedIndices = new Uint16Array(indices)

		Cube.vao = glCall(gl, gl.createVertexArray)
		glCall(gl, gl.bindVertexArray, Cube.vao)

		Cube.buffer = glCall(gl, gl.createBuffer)
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, Cube.buffer)

		Cube.ibo = glCall(gl, gl.createBuffer)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, Cube.ibo)

		gl.bufferData(gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		glCall(gl, gl.bufferData, gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		glCall(gl, gl.bufferData, gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

		glCall(gl, gl.enableVertexAttribArray, 0)
		glCall(gl, gl.enableVertexAttribArray, 1)
		glCall(gl, gl.vertexAttribPointer, 0, 3, gl.FLOAT, false, 4 * 5, 0)
		glCall(gl, gl.vertexAttribPointer, 1, 2, gl.FLOAT, false, 4 * 5, 4 * 3)
	}

	destroy(gl: WebGL2RenderingContext): void {
		Cube.count -= 1
		if (Cube.count === 0) {
			glCall(gl, gl.deleteBuffer, Cube.buffer)
			glCall(gl, gl.deleteBuffer, Cube.ibo)
			glCall(gl, gl.deleteVertexArray, Cube.vao)
		}
	}

	static bind(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.bindVertexArray, Cube.vao)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, Cube.ibo)
	}

	static unbind(gl: WebGL2RenderingContext): void {}

	render(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.drawElements, gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
	}
}
