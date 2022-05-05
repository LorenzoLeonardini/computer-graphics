precision lowp float;

uniform vec3 uColor;

varying vec2 vTexCoords;
varying vec3 vNormal;

void main(void) {
	gl_FragColor = vec4(uColor, 1.0);
}