#version 300 es
precision lowp float;
#include "lightingFragment.glsl"

uniform vec3 uColor;

in vec2 vTexCoords;
in vec3 vNormal;

out vec4 outColor;

void main(void) {
	vec3 normal = normalize(vNormal);
	outColor = vec4(phongLighting(vec3(0.0, 0.0, 1.0), uColor, 0.0), 1.0);
}