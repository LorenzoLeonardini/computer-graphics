import { Model } from './Model'
import { glCall } from './Utils'

export class Quad implements Model {
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

		Quad.buffer = glCall(gl, gl.createBuffer)
		Quad.ibo = glCall(gl, gl.createBuffer)
		Quad.bind(gl)

		glCall(gl, gl.bufferData, gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		glCall(gl, gl.bufferData, gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

		Quad.unbind(gl)
	}

	destroy(gl: WebGL2RenderingContext): void {
		Quad.count -= 1
		if (Quad.count === 0) {
			glCall(gl, gl.deleteBuffer, Quad.buffer)
			glCall(gl, gl.deleteBuffer, Quad.ibo)
		}
	}

	static bind(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, Quad.buffer)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, Quad.ibo)
		glCall(gl, gl.enableVertexAttribArray, 0)
		glCall(gl, gl.enableVertexAttribArray, 1)
		glCall(gl, gl.enableVertexAttribArray, 2)
		glCall(gl, gl.vertexAttribPointer, 0, 3, gl.FLOAT, false, 4 * 8, 0)
		glCall(gl, gl.vertexAttribPointer, 1, 2, gl.FLOAT, false, 4 * 8, 4 * 3)
		glCall(gl, gl.vertexAttribPointer, 2, 3, gl.FLOAT, false, 4 * 8, 4 * 5)
	}

	static unbind(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.disableVertexAttribArray, 0)
		glCall(gl, gl.disableVertexAttribArray, 1)
		glCall(gl, gl.disableVertexAttribArray, 2)
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, null)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, null)
	}

	render(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.drawElements, gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
	}
}
