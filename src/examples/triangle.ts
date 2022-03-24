let gl: WebGLRenderingContext = null
const slotPositions = 0

export function setupWebGL(canvas: HTMLCanvasElement) {
	gl = canvas.getContext('webgl')
}

export function setupWhatToDraw() {
	const positions = [
		// 1st vertex
		-1, -1,
		// 2nd vertex
		1, -1,
		// 3rd vertex
		0, 1
	]

	const typedPositions = new Float32Array(positions)

	const positionsBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, typedPositions, gl.STATIC_DRAW)

	gl.enableVertexAttribArray(slotPositions)
	gl.vertexAttribPointer(slotPositions, 2, gl.FLOAT, false, 8, 0)
}

export function setupHowToDraw() {
	const vertexShaderSource = `
		attribute vec2 aPosition;

		void main(void) {
			gl_Position = vec4(aPosition, 0.0, 1.0);
		}
	`
	const vertexShader = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertexShader, vertexShaderSource)
	gl.compileShader(vertexShader)

	const fragmentShaderSource = `
		precision lowp float;

		void main(void) {
			gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
		}
	`
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
	gl.shaderSource(fragmentShader, fragmentShaderSource)
	gl.compileShader(fragmentShader)

	const message_vs = gl.getShaderInfoLog(vertexShader)
	const message_fs = gl.getShaderInfoLog(fragmentShader)

	console.log(message_vs, message_fs)

	const program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.bindAttribLocation(program, slotPositions, 'aPosition')
	gl.linkProgram(program)
	gl.useProgram(program)
}

export function draw() {
	gl.clearColor(0.2, 0.3, 0.4, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.drawArrays(gl.TRIANGLES, 0, 3)
}
