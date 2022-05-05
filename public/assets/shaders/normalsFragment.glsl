precision lowp float;

varying vec2 vTexCoords;
varying vec3 vNormal;

void main(void) {
	vec3 color = (vNormal + vec3(1.0, 1.0, 1.0)) * 0.5;
	gl_FragColor = vec4(color, 1.0);
}