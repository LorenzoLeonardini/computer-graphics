#version 300 es

precision lowp float;

uniform vec3 uColor;

in vec2 vTexCoords;
in vec3 vNormal;

out vec4 outColor;

void main(void) {
	outColor = vec4(uColor, 1.0);
}