import { Model } from './Model'
import { glCall } from './Utils'

export class Cube implements Model {
	buffer: WebGLBuffer
	ibo: WebGLBuffer

	constructor(gl: WebGLRenderingContext) {
		const vertices = [
			-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1
		]
		const typedVertices = new Float32Array(vertices)

		const indices = [
			0, 1, 2, 2, 1, 3, 4, 6, 5, 6, 7, 5, 2, 3, 6, 6, 3, 7, 4, 5, 0, 0, 5, 1, 1, 5, 3, 3, 5, 7, 4,
			0, 6, 0, 6, 2
		]
		const typedIndices = new Uint16Array(indices)

		this.buffer = glCall(gl, gl.createBuffer)
		this.ibo = glCall(gl, gl.createBuffer)
		this.bind(gl)

		glCall(gl, gl.bufferData, gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		glCall(gl, gl.bufferData, gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

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
		glCall(gl, gl.drawElements, gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
		this.unbind(gl)
	}
}
