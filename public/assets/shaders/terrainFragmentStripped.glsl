#version 300 es
precision lowp float;
#include "lightingFragment.glsl"

uniform sampler2D uBlendMapTexture;

uniform sampler2D uBaseTexture;
uniform sampler2D uRedTexture;
uniform sampler2D uGreenTexture;
uniform sampler2D uBlueTexture;

in vec2 vTexCoords;
in vec3 vNormal;

out vec4 outColor;

void main(void) {
	vec2 texCoords = fract(vTexCoords * 120.0);

	vec4 blendMap = texture(uBlendMapTexture, vTexCoords);
	float baseAlpha = 1.0 - (blendMap.r + blendMap.g + blendMap.b);

	vec4 baseTextureColor = texture(uBaseTexture, texCoords);
	vec4 redTextureColor = texture(uRedTexture, texCoords);
	vec4 greenTextureColor = texture(uGreenTexture, texCoords);
	vec4 blueTextureColor = texture(uBlueTexture, texCoords);

	outColor = baseTextureColor * baseAlpha + redTextureColor * blendMap.r + greenTextureColor * blendMap.g + blueTextureColor * blendMap.b;
	outColor = vec4(phongLighting(vec3(0.0, 0.0, 1.0), outColor.xyz, 0.0), 1.0);
}