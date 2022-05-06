import { Model } from './Model'
import { glCall } from './Utils'

export class OBJModel implements Model {
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

		this.buffer = glCall(gl, gl.createBuffer)
		this.ibo = glCall(gl, gl.createBuffer)
		this.vertexCount = indices.length
		this.bind(gl)

		glCall(gl, gl.bufferData, gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		glCall(gl, gl.bufferData, gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

		this.unbind(gl)
	}

	destroy(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.deleteBuffer, this.buffer)
		glCall(gl, gl.deleteBuffer, this.ibo)
	}

	bind(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, this.buffer)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, this.ibo)
		glCall(gl, gl.enableVertexAttribArray, 0)
		glCall(gl, gl.enableVertexAttribArray, 1)
		glCall(gl, gl.enableVertexAttribArray, 2)
		glCall(gl, gl.vertexAttribPointer, 0, 3, gl.FLOAT, false, 4 * 8, 0)
		glCall(gl, gl.vertexAttribPointer, 1, 2, gl.FLOAT, false, 4 * 8, 4 * 3)
		glCall(gl, gl.vertexAttribPointer, 2, 3, gl.FLOAT, false, 4 * 8, 4 * 5)
	}

	unbind(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.disableVertexAttribArray, 0)
		glCall(gl, gl.disableVertexAttribArray, 1)
		glCall(gl, gl.disableVertexAttribArray, 2)
		glCall(gl, gl.bindBuffer, gl.ARRAY_BUFFER, null)
		glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, null)
	}

	render(gl: WebGL2RenderingContext): void {
		glCall(gl, gl.drawElements, gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0)
	}
}
