#version 300 es

precision lowp float;

uniform sampler2D uTexture;

in vec2 vTexCoords;
in vec3 vNormal;

out vec4 outColor;

void main(void) {
	outColor = texture(uTexture, vTexCoords);
}
