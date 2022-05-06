#version 300 es

precision lowp float;

uniform sampler2D uBlendMapTexture;
uniform sampler2D uBaseTexture;
uniform sampler2D uRedTexture;
uniform sampler2D uGreenTexture;
uniform sampler2D uBlueTexture;

in vec2 vTexCoords;
in vec3 vNormal;

out vec4 outColor;

void main(void) {
	vec4 blendMap = texture(uBlendMapTexture, vTexCoords);
	float baseAlpha = 1.0 - (blendMap.r + blendMap.g + blendMap.b);
	vec4 baseTextureColor = texture(uBaseTexture, vTexCoords * 30.0);
	vec4 redTextureColor = texture(uRedTexture, vTexCoords * 30.0);
	vec4 greenTextureColor = texture(uGreenTexture, vTexCoords * 30.0);
	vec4 blueTextureColor = texture(uBlueTexture, vTexCoords * 30.0);

	outColor = baseTextureColor * baseAlpha + redTextureColor * blendMap.r + greenTextureColor * blendMap.g + blueTextureColor * blendMap.b;
}