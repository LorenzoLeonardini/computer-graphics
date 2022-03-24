import { Model } from './Model'

export class Cube implements Model {
	buffer: WebGLBuffer
	ibo: WebGLBuffer

	create(gl: WebGLRenderingContext): void {
		const vertices = [
			-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1
		]
		const typedVertices = new Float32Array(vertices)

		const indices = [
			0, 1, 2, 2, 1, 3, 4, 6, 5, 6, 7, 5, 2, 3, 6, 6, 3, 7, 4, 5, 0, 0, 5, 1, 1, 5, 3, 3, 5, 7, 4,
			0, 6, 0, 6, 2
		]
		const typedIndices = new Uint16Array(indices)

		this.buffer = gl.createBuffer()
		this.ibo = gl.createBuffer()
		this.bind(gl)

		gl.bufferData(gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

		gl.enableVertexAttribArray(0)
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 4 * 3, 0)
	}

	destroy(gl: WebGLRenderingContext): void {
		gl.deleteBuffer(this.buffer)
		gl.deleteBuffer(this.ibo)
	}

	bind(gl: WebGLRenderingContext): void {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo)
		gl.enableVertexAttribArray(0)
	}

	unbind(gl: WebGLRenderingContext): void {
		gl.disableVertexAttribArray(0)
		gl.bindBuffer(gl.ARRAY_BUFFER, null)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
	}

	render(gl: WebGLRenderingContext): void {
		this.bind(gl)
		gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
		this.unbind(gl)
	}
}
