#version 300 es
precision lowp float;
#include "lightingFragment.glsl"

uniform sampler2D uBlendMapTexture;

uniform sampler2D uBaseTexture[3];
uniform sampler2D uRedTexture[3];
uniform sampler2D uGreenTexture[3];
uniform sampler2D uBlueTexture[3];

in vec2 vTexCoords;
in vec3 vNormal;

out vec4 outColor;

void main(void) {
	vec2 texCoords = fract(vTexCoords * 30.0);

	vec4 blendMap = texture(uBlendMapTexture, vTexCoords);
	float baseAlpha = 1.0 - (blendMap.r + blendMap.g + blendMap.b);

	vec4 baseTextureColor = texture(uBaseTexture[0], texCoords);
	vec4 redTextureColor = texture(uRedTexture[0], texCoords);
	vec4 greenTextureColor = texture(uGreenTexture[0], texCoords);
	vec4 blueTextureColor = texture(uBlueTexture[0], texCoords);

	vec4 baseTextureNormal = texture(uBaseTexture[1], texCoords);
	vec4 redTextureNormal = texture(uRedTexture[1], texCoords);
	vec4 greenTextureNormal = texture(uGreenTexture[1], texCoords);
	vec4 blueTextureNormal = texture(uBlueTexture[1], texCoords);

	vec4 baseTextureRoughness = texture(uBaseTexture[2], texCoords);
	vec4 redTextureRoughness = texture(uRedTexture[2], texCoords);
	vec4 greenTextureRoughness = texture(uGreenTexture[2], texCoords);
	vec4 blueTextureRoughness = texture(uBlueTexture[2], texCoords);

	vec3 normalMap = ((baseTextureNormal * baseAlpha + redTextureNormal * blendMap.r + greenTextureNormal * blendMap.g + blueTextureNormal * blendMap.b).xyz);
	normalMap = 2.0 * normalMap - 1.0;

	vec4 roughness = baseTextureRoughness * baseAlpha + redTextureRoughness * blendMap.r + greenTextureRoughness * blendMap.g + blueTextureRoughness * blendMap.b;

	outColor = baseTextureColor * baseAlpha + redTextureColor * blendMap.r + greenTextureColor * blendMap.g + blueTextureColor * blendMap.b;
	outColor = vec4(phongLighting(normalMap, outColor.xyz, 1.0 - roughness.x), 1.0);
}