import { Matrix4 } from './Matrix'
import { Shader } from './Shader'
import { glCall } from './Utils'

const slotPositions = 0
const slotTexCoords = 1
const slotNormals = 2

export abstract class Material {
	shader: Shader
	currentCamera: number = -1
	gl_FragColor: string
	vertexSrc: string = ''
	fragmentSrc: string = ''
	fragmentUniforms: string = ''

	create(gl: WebGLRenderingContext) {
		const vertexShaderSource = `
attribute vec3 aPosition;
attribute vec2 aTexCoords;
attribute vec3 aNormal;

uniform mat4 uProjectionMat;
uniform mat4 uViewMat;
uniform mat4 uObjectMat;

varying vec2 vTexCoords;
varying vec3 vNormal;

void main(void) {
	${this.vertexSrc}

	vTexCoords = aTexCoords;
	vNormal = aNormal;
	gl_Position = uProjectionMat * uViewMat * uObjectMat * vec4(aPosition, 1.0);
}
		`
		const fragmentShaderSource = `
precision lowp float;

${this.fragmentUniforms}

varying vec2 vTexCoords;
varying vec3 vNormal;

void main(void) {
	${this.fragmentSrc}
	gl_FragColor = ${this.gl_FragColor};
}
		`

		this.shader = new Shader(gl, vertexShaderSource, fragmentShaderSource)
		this.shader.bindAttribLocation(gl, slotPositions, 'aPosition')
		this.shader.bindAttribLocation(gl, slotTexCoords, 'aTexCoords')
		this.shader.bindAttribLocation(gl, slotNormals, 'aNormal')
	}

	loadPerspective(gl: WebGLRenderingContext, perspective: Matrix4) {
		glCall(
			gl,
			gl.uniformMatrix4fv,
			glCall(gl, gl.getUniformLocation, this.shader.program, 'uProjectionMat'),
			false,
			perspective
		)
	}

	loadView(gl: WebGLRenderingContext, viewMatrix: Matrix4) {
		glCall(
			gl,
			gl.uniformMatrix4fv,
			glCall(gl, gl.getUniformLocation, this.shader.program, 'uViewMat'),
			false,
			viewMatrix
		)
	}

	prepareRender(gl: WebGLRenderingContext) {
		glCall(gl, gl.useProgram, this.shader.program)
	}
}
