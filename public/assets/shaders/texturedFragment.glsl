#version 300 es
precision lowp float;
#include "lightingFragment.glsl"

uniform sampler2D uTexture;
uniform sampler2D uNormalMap;
uniform sampler2D uRoughnessMap;
uniform int uHasNormalMap;
uniform int uHasRoughnessMap;

in vec2 vTexCoords;
in vec3 vNormal;

out vec4 outColor;

void main(void) {
	vec3 normalMap = vec3(0.0, 0.0, 1.0);
	if(uHasNormalMap == 1) {
		normalMap = texture(uNormalMap, vTexCoords).xyz;
		normalMap = 2.0 * normalMap - 1.0;
	}
	vec3 roughness = vec3(1.0);
	if(uHasRoughnessMap == 1) {
		roughness = texture(uRoughnessMap, vTexCoords).xyz;
	}

	outColor = texture(uTexture, vTexCoords);
	outColor = vec4(phongLighting(normalMap, outColor.xyz, 1.0 - roughness.x), 1.0);
}
