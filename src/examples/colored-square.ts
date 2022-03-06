let gl: WebGLRenderingContext = null
const slotPositions = 0
const slotColor = 1

export function setupWebGL(canvas: HTMLCanvasElement) {
	gl = canvas.getContext('webgl')
}

export function setupWhatToDraw() {
	const positionsAndColors = [
		// 1st vertex
		-1, -1, 1, 0, 0,
		// 2nd vertex
		-1, 1, 0, 1, 0,
		// 3rd vertex
		1, -1, 0, 0, 1,

		// 1st vertex
		1, -1, 0, 1, 1,
		// 2nd vertex
		-1, 1, 1, 0, 1,
		// 3rd vertex
		1, 1, 1, 1, 0
	]

	const typedPositionsAndColors = new Float32Array(positionsAndColors)
	const positionsAndColorsBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionsAndColorsBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, typedPositionsAndColors, gl.STATIC_DRAW)
	gl.enableVertexAttribArray(slotPositions)
	gl.vertexAttribPointer(slotPositions, 2, gl.FLOAT, false, 20, 0)
	gl.enableVertexAttribArray(slotColor)
	gl.vertexAttribPointer(slotColor, 3, gl.FLOAT, false, 20, 8)
}

export function setupHowToDraw() {
	const vertexShaderSource = `
		attribute vec2 aPosition;
		attribute vec3 aColor;

		varying vec3 color;

		void main(void) {
			color = aColor;
			gl_Position = vec4(aPosition, 0.0, 1.0);
		}
	`
	const vertexShader = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertexShader, vertexShaderSource)
	gl.compileShader(vertexShader)

	const fragmentShaderSource = `
		precision lowp float;

		varying vec3 color;

		void main(void) {
			gl_FragColor = vec4(color, 1.0);
		}
	`
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
	gl.shaderSource(fragmentShader, fragmentShaderSource)
	gl.compileShader(fragmentShader)

	const program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.bindAttribLocation(program, slotPositions, 'aPosition')
	gl.bindAttribLocation(program, slotColor, 'aColor')
	gl.linkProgram(program)
	gl.useProgram(program)

	const message_vs = gl.getShaderInfoLog(vertexShader)
	const message_fs = gl.getShaderInfoLog(fragmentShader)

	console.log(message_vs, message_fs)
}

export function draw() {
	gl.clearColor(0.4, 0.3, 0.6, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.drawArrays(gl.TRIANGLES, 0, 6)
}