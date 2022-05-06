import { Model } from './Model'
import { glCall } from './Utils'

export class Cube implements Model {
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
			0, 1, 2, 2, 1, 3, 4, 6, 5, 6, 7, 5, 2, 3, 6, 6, 3, 7, 4, 5, 0, 0, 5, 1, 1, 5, 3, 3, 5, 7, 4,
			0, 6, 0, 6, 2
		]
		const typedIndices = new Uint16Array(indices)

		Cube.buffer = glCall(gl, gl.createBuffer)
		Cube.ibo = glCall(gl, gl.createBuffer)
		Cube.bind(gl)

		gl.bufferData(gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		glCall(gl, gl.bufferData, gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		glCall(gl, gl.bufferData, gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

		Cube.unbind(gl)
	}

	destroy(gl: WebGL2RenderingContext): void {
		Cube.count -= 1
		if (Cube.count === 0) {
			glCall(gl, gl.deleteBuffer, Cube.buffer)
			glCall(gl, gl.deleteBuffer, Cube.ibo)
		}
	}

	static bind(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, Cube.buffer)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, Cube.ibo)
		glCall(gl, gl.enableVertexAttribArray, 0)
		glCall(gl, gl.enableVertexAttribArray, 1)
		glCall(gl, gl.vertexAttribPointer, 0, 3, gl.FLOAT, false, 4 * 5, 0)
		glCall(gl, gl.vertexAttribPointer, 1, 2, gl.FLOAT, false, 4 * 5, 4 * 3)
	}

	static unbind(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.disableVertexAttribArray, 0)
		glCall(gl, gl.disableVertexAttribArray, 1)
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, null)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, null)
	}

	render(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.drawElements, gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
	}
}
