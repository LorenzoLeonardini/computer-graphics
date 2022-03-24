let gl: WebGLRenderingContext = null
const slotPositions = 0
const slotHue = 1

export function setupWebGL(canvas: HTMLCanvasElement) {
	gl = canvas.getContext('webgl')
}

export function setupWhatToDraw() {
	const vertices = [
		// 1st vertex
		-1, -0.1,
		// 2nd vertex
		1, -0.1,
		// 3rd vertex
		-1, 0.1,
		// 4th vertex
		1, 0.1
	]
	const typedVertices = new Float32Array(vertices)

	const buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)

	const indices = [
		// 1st triangle
		0, 1, 2,
		// 2nd triangle
		2, 1, 3
	]
	const typedIndices = new Uint16Array(indices)

	const ibo = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)

	gl.enableVertexAttribArray(slotPositions)
	gl.vertexAttribPointer(slotPositions, 2, gl.FLOAT, false, 8, 0)
}

export function setupHowToDraw() {
	const vertexShaderSource = `
		attribute vec2 aPosition;
		
		varying float vHue;
		
		void main(void) {
			// x position is between -1 and 1, use it to compute Hue from 0 to 1
			vHue = (1.0 + aPosition.x) / 2.0;
			gl_Position = vec4(aPosition, 0.0, 1.0);
		}
	`
	const vertexShader = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertexShader, vertexShaderSource)
	gl.compileShader(vertexShader)

	const fragmentShaderSource = `
		precision lowp float;

		varying float vHue;

		vec3 Hue(float H) {
            float R = abs(H * 6.0 - 3.0) - 1.0;
            float G = 2.0 - abs(H * 6.0 - 2.0);
            float B = 2.0 - abs(H * 6.0 - 4.0);
            return vec3(R,G,B);
        }

		void main(void) {
			// HSV to RGB conversion
			gl_FragColor = vec4(((Hue(vHue) - 1.0) + 1.0), 1.0);
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
	gl.bindAttribLocation(program, slotHue, 'aHue')
	gl.linkProgram(program)
	gl.useProgram(program)
}

export function draw() {
	gl.clearColor(0.2, 0.3, 0.4, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
}
