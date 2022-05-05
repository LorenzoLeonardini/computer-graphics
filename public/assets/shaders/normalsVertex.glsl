attribute vec3 aPosition;
attribute vec2 aTexCoords;
attribute vec3 aNormal;

uniform mat4 uProjectionMat;
uniform mat4 uViewMat;
uniform mat4 uObjectMat;

varying vec2 vTexCoords;
varying vec3 vNormal;

void main(void) {
	vTexCoords = aTexCoords;
	vNormal = aNormal;

	gl_Position = uProjectionMat * uViewMat * uObjectMat * vec4(aPosition, 1.0);
}