let gl: WebGLRenderingContext = null

export function setupWebGL(canvas: HTMLCanvasElement) {
	gl = canvas.getContext('webgl')
}

export function setupWhatToDraw() {
}

export function setupHowToDraw() {
}

export function draw() {
	gl.clearColor(0.2, 0.3, 0.4, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
}