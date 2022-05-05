let gl: WebGLRenderingContext = null

export function setupWebGL(canvas: HTMLCanvasElement) {
	gl = canvas.getContext('webgl')
}

export async function changeAspectRatio(width: number, height: number) {
	gl.viewport(0, 0, width, height)
}

export function setupWhatToDraw() {}

export function setupHowToDraw() {}

export function draw() {
	gl.clearColor(0.2, 0.3, 0.4, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
}
