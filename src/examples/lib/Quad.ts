import { Model } from './Model'

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

		Quad.vao = gl.createVertexArray()
		gl.bindVertexArray(Quad.vao)

		Quad.buffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, Quad.buffer)

		Quad.ibo = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Quad.ibo)

		gl.bufferData(gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

		gl.enableVertexAttribArray(0)
		gl.enableVertexAttribArray(1)
		gl.enableVertexAttribArray(2)
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 4 * 8, 0)
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4 * 8, 4 * 3)
		gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 4 * 8, 4 * 5)
	}

	destroy(gl: WebGL2RenderingContext): void {
		Quad.count -= 1
		if (Quad.count === 0) {
			gl.deleteBuffer(Quad.buffer)
			gl.deleteBuffer(Quad.ibo)
			gl.deleteVertexArray(Quad.vao)
		}
	}

	bind(gl: WebGL2RenderingContext): void {
		gl.bindVertexArray(Quad.vao)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Quad.ibo)
	}

	unbind(gl: WebGL2RenderingContext): void {}

	render(gl: WebGL2RenderingContext): void {
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
	}
}
