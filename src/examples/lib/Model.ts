export abstract class Model {
	destroy: (gl: WebGLRenderingContext) => void
	bind: (gl: WebGLRenderingContext) => void
	unbind: (gl: WebGLRenderingContext) => void
	render: (gl: WebGLRenderingContext) => void
}
