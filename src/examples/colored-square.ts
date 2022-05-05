let gl: WebGLRenderingContext = null
const slotPositions = 0
const slotColors = 1

export function setupWebGL(canvas: HTMLCanvasElement) {
	gl = canvas.getContext('webgl')
}

export function setupWhatToDraw() {
	const vertices = [
		// 1st vertex
		-1, -1, 1, 0, 0,
		// 2nd vertex
		1, -1, 0, 1, 0,
		// 3rd vertex
		-1, 1, 0, 0, 1,
		// 1st vertex
		-1, 1, 0, 0, 1,
		// 2nd vertex
		1, -1, 0, 1, 0,
		// 3rd vertex
		1, 1, 1, 1, 1
	]
	const typedVertices = new Float32Array(vertices)

	const buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)

	gl.enableVertexAttribArray(slotPositions)
	gl.vertexAttribPointer(slotPositions, 2, gl.FLOAT, false, 20, 0)
	gl.enableVertexAttribArray(slotColors)
	gl.vertexAttribPointer(slotColors, 3, gl.FLOAT, false, 20, 8)
}

export async function changeAspectRatio(width: number, height: number) {
	gl.viewport(0, 0, width, height)
}

export function setupHowToDraw() {
	const vertexShaderSource = `
		attribute vec2 aPosition;
		attribute vec3 aColor;
		
		varying vec3 vColor;
		
		void main(void) {
			vColor = aColor;
			gl_Position = vec4(aPosition, 0.0, 1.0);
		}
	`
	const vertexShader = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertexShader, vertexShaderSource)
	gl.compileShader(vertexShader)

	const fragmentShaderSource = `
		precision lowp float;

		varying vec3 vColor;
		
		void main(void) {
			gl_FragColor = vec4(vColor, 1.0);
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
	gl.bindAttribLocation(program, slotColors, 'aColor')
	gl.linkProgram(program)
	gl.useProgram(program)
}

export function draw() {
	gl.clearColor(0.2, 0.3, 0.4, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.drawArrays(gl.TRIANGLES, 0, 6)
}
