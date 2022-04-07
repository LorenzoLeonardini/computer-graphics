export abstract class Model {
	destroy: (gl: WebGLRenderingContext) => void
	static bind: (gl: WebGLRenderingContext) => void
	static unbind: (gl: WebGLRenderingContext) => void
	render: (gl: WebGLRenderingContext) => void
}
