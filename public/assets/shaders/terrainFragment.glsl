precision lowp float;

uniform sampler2D uBlendMapTexture;
uniform sampler2D uBaseTexture;
uniform sampler2D uRedTexture;
uniform sampler2D uGreenTexture;
uniform sampler2D uBlueTexture;

varying vec2 vTexCoords;
varying vec3 vNormal;

void main(void) {
	vec4 blendMap = texture2D(uBlendMapTexture, vTexCoords);
	float baseAlpha = 1.0 - (blendMap.r + blendMap.g + blendMap.b);
	vec4 baseTextureColor = texture2D(uBaseTexture, vTexCoords * 30.0);
	vec4 redTextureColor = texture2D(uRedTexture, vTexCoords * 30.0);
	vec4 greenTextureColor = texture2D(uGreenTexture, vTexCoords * 30.0);
	vec4 blueTextureColor = texture2D(uBlueTexture, vTexCoords * 30.0);

	gl_FragColor = baseTextureColor * baseAlpha + redTextureColor * blendMap.r + greenTextureColor * blendMap.g + blueTextureColor * blendMap.b;
}