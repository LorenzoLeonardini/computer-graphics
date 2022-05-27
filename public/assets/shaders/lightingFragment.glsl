#define MAX_DIRECTIONAL_LIGHTS 4
#define MAX_SPOTLIGHTS 10

in vec3 vDirectionalLightsDirection[MAX_DIRECTIONAL_LIGHTS];
in vec3 vToSpotlightsVector[MAX_SPOTLIGHTS];
in vec3 vSpotlightsDirection[MAX_SPOTLIGHTS];
in vec3 toCameraVector;

uniform vec4 uSpotlightsColor[MAX_SPOTLIGHTS]; // 4th component is the intensity
uniform int uSpotlightsCount;

uniform vec4 uDirectionalLightsColor[MAX_DIRECTIONAL_LIGHTS]; // 4th component is the intensity
uniform int uDirectionalLightsCount;

uniform mat4 uProjectingLightsMat[2];
uniform sampler2D uProjectingLightTexture;
in vec3 vPosition;
in mat4 vObjectMat;

vec3 normalToColor(vec3 normal) {
	return (normalize(normal) + vec3(1,1,1)) * 0.5;
}

float AMBIENT_CONTRIBUTION = 0.4;
float SPOTLIGHT_INNER = 0.4;
float SPOTLIGHT_OUTER = 0.8;

float c1 = 0.0;
float c2 = 1.0;
float c3 = 0.4;

vec2 projectingLightsUV[2];

vec3 applyCarHeadlights(vec3 color) {
	vec4 tmp;
	tmp = uProjectingLightsMat[0] * vObjectMat * vec4(vPosition, 1.0);//(uProjectingLightsMat[0] * uObjectMat * vec4(vPosition, 1.0));
	projectingLightsUV[0] = ((tmp/tmp.w).xy + 1.0) * 0.5;

	tmp = (uProjectingLightsMat[1] * vObjectMat * vec4(vPosition, 1.0));
	projectingLightsUV[1] = ((tmp/tmp.w).xy + 1.0) * 0.5;

	if(projectingLightsUV[0].x >= 0.0 && projectingLightsUV[0].x <= 1.0 && projectingLightsUV[0].y >= 0.0 && projectingLightsUV[0].y <= 1.0) {
		vec4 headlight = texture(uProjectingLightTexture, projectingLightsUV[0].xy);
		color = headlight.rgb * headlight.a + color * (1.0 - headlight.a);
	}
	if(projectingLightsUV[1].x >= 0.0 && projectingLightsUV[1].x <= 1.0 && projectingLightsUV[1].y >= 0.0 && projectingLightsUV[1].y <= 1.0) {
		vec4 headlight = texture(uProjectingLightTexture, projectingLightsUV[1].xy);
		color = headlight.rgb * headlight.a + color * (1.0 - headlight.a);
	}

	return color;
}

vec3 phongLighting(vec3 normal, vec3 color, float roughness) {
	if(uDirectionalLightsCount == 0) {
		return color;
	}

	vec3 ambient = vec3(1.0, 1.0, 1.0);
	vec3 diffuse = vec3(0.0, 0.0, 0.0);
	vec3 specular = vec3(0.0, 0.0, 0.0);

	for(int i = 0; i < uDirectionalLightsCount; i++) {
		ambient *= uDirectionalLightsColor[i].xyz;
		diffuse += (uDirectionalLightsColor[i].xyz * max(dot(-vDirectionalLightsDirection[i], normal), 0.0));

		vec3 H = (-vDirectionalLightsDirection[i] + toCameraVector) / length(-vDirectionalLightsDirection[i] + toCameraVector);
		specular += (uDirectionalLightsColor[i].xyz * roughness * pow(max(dot(H, normal), 0.0), 10.0));
	}
	diffuse /= float(uDirectionalLightsCount);
	specular /= float(uDirectionalLightsCount);

	for(int i = 0; i < uSpotlightsCount; i++) {
		float angle = dot(normalize(vToSpotlightsVector[i]), normalize(vSpotlightsDirection[i]));
		float fs = pow(angle, 6.0);
		if(angle > cos(SPOTLIGHT_INNER)) {
			fs = 1.0;
		} else if(angle < cos(SPOTLIGHT_OUTER)) {
			fs = 0.0;
		}

		float dist = length(vToSpotlightsVector[i]);
		float attenuation = min(1.0 / (c1 + c2 * dist + c3 * dist * dist), 1.0);

		ambient += uSpotlightsColor[i].xyz * attenuation;
		diffuse += (uSpotlightsColor[i].xyz * max(dot(-vSpotlightsDirection[i], normal), 0.0)) * fs * attenuation;

		vec3 H = (-vSpotlightsDirection[i] + toCameraVector) / length(-vSpotlightsDirection[i] + toCameraVector);
		specular += (uSpotlightsColor[i].xyz * roughness * pow(max(dot(H, normal), 0.0), 10.0)) * fs * attenuation;
	}

	calculateCarHeadlights();

	vec3 finalColor = ambient * color * AMBIENT_CONTRIBUTION + (color * diffuse + specular) * (1.0 - AMBIENT_CONTRIBUTION);
	return applyCarHeadlights(finalColor);
}