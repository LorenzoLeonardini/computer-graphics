export function glCall<F extends (...args: any) => any>(
	gl: WebGL2RenderingContext | WebGLRenderingContext,
	fn: F,
	...args: any // Parameters<F> sad https://github.com/microsoft/TypeScript/issues/29732
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

export async function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve) => {
		const image = new Image()
		image.src = url
		image.onload = () => {
			resolve(image)
		}
	})
}
