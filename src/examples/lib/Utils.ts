export function glCall<F extends (...args: any) => any>(
	gl: WebGLRenderingContext,
	fn: F,
	...args: Parameters<F>
): ReturnType<F> {
	// Clearing errors
	while (gl.getError() !== gl.NO_ERROR);

	let returnValue = fn.call(gl, ...args)

	// Getting errors
	let error = gl.getError()
	let anyError = error !== gl.NO_ERROR
	while (error !== gl.NO_ERROR) {
		console.error(`[WebGL Error] ${error}`)
		error = gl.getError()
	}
	if (anyError) {
		debugger
		throw new Error('WebGL error, stopping execution')
	}

	return returnValue
}
