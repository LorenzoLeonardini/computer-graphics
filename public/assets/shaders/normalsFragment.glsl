#version 300 es
precision lowp float;
#include "lightingFragment.glsl"

in vec2 vTexCoords;
in vec3 vNormal;

out vec4 outColor;

void main(void) {
	vec3 color = (vNormal + vec3(1.0, 1.0, 1.0)) * 0.5;
	outColor = vec4(color, 1.0);
}