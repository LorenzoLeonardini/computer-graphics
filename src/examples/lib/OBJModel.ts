import { Model } from './Model'

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

		this.vao = gl.createVertexArray()
		gl.bindVertexArray(this.vao)

		this.buffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)

		this.ibo = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo)

		this.vertexCount = indices.length

		gl.bufferData(gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

		gl.enableVertexAttribArray(0)
		gl.enableVertexAttribArray(1)
		gl.enableVertexAttribArray(2)
		gl.enableVertexAttribArray(3)
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 4 * 11, 0)
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4 * 11, 4 * 3)
		gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 4 * 11, 4 * 5)
		gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 4 * 11, 4 * 8)
	}

	destroy(gl: WebGL2RenderingContext): void {
		gl.deleteBuffer(this.buffer)
		gl.deleteBuffer(this.ibo)
		gl.deleteVertexArray(this.vao)
	}

	bind(gl: WebGL2RenderingContext): void {
		gl.bindVertexArray(this.vao)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo)
	}

	unbind(gl: WebGL2RenderingContext): void {}

	render(gl: WebGL2RenderingContext): void {
		gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0)
	}
}
