#define MAX_DIRECTIONAL_LIGHTS 4
#define MAX_SPOTLIGHTS 10

in vec3 vDirectionalLightsDirection[MAX_DIRECTIONAL_LIGHTS];
in vec3 vToSpotlightsVector[MAX_SPOTLIGHTS];
in vec3 vSpotlightsDirection[MAX_SPOTLIGHTS];
in vec3 toCameraVector;

uniform vec3 uSpotlightsColor[MAX_SPOTLIGHTS]; // 4th component is the intensity
uniform int uSpotlightsCount;

uniform vec3 uDirectionalLightsColor[MAX_DIRECTIONAL_LIGHTS]; // 4th component is the intensity
uniform int uDirectionalLightsCount;

uniform sampler2D uProjectingLightTexture;
uniform sampler2D uProjectingLightDepthTexture[2];
in vec3 vPosition;
in mat4 vObjectMat;

vec3 normalToColor(vec3 normal) {
	return (normalize(normal) + vec3(1,1,1)) * 0.5;
}

float AMBIENT_CONTRIBUTION = 0.4;
float SPOTLIGHT_INNER = 0.6;
float SPOTLIGHT_OUTER = 1.2;

float c1 = 0.0;
float c2 = 1.0;
float c3 = 0.4;

in vec4 vProjectingLightsUV[2];
vec3 projectingLightsUV[2];

uniform sampler2D uSunDepthTexture;
in vec4 vSunUV;
vec3 sunUV;

vec3 applyCarHeadlights(vec3 color) {
	projectingLightsUV[0] = (vProjectingLightsUV[0] / vProjectingLightsUV[0].w).xyz * 0.5 + 0.5;
	projectingLightsUV[1] = (vProjectingLightsUV[1] / vProjectingLightsUV[1].w).xyz * 0.5 + 0.5;

	float bias = 0.002;

	float storedDepth = texture(uProjectingLightDepthTexture[0], projectingLightsUV[0].xy).x;
	if(projectingLightsUV[0].x >= 0.0 && projectingLightsUV[0].x <= 1.0 && projectingLightsUV[0].y >= 0.0 && projectingLightsUV[0].y <= 1.0) {
		if(storedDepth + bias >= projectingLightsUV[0].z) { 
			vec4 headlight = texture(uProjectingLightTexture, projectingLightsUV[0].xy);
			color = mix(color, headlight.rgb, headlight.a);
		}
	}

	storedDepth = texture(uProjectingLightDepthTexture[1], projectingLightsUV[1].xy).x;
	if(projectingLightsUV[1].x >= 0.0 && projectingLightsUV[1].x <= 1.0 && projectingLightsUV[1].y >= 0.0 && projectingLightsUV[1].y <= 1.0) {
		if(storedDepth + bias >= projectingLightsUV[1].z) { 
			vec4 headlight = texture(uProjectingLightTexture, projectingLightsUV[1].xy);
			color = mix(color, headlight.rgb, headlight.a);
		}
	}

	return color;
}

float linstep(float low, float high, float v){
	return clamp((v-low)/(high-low), 0.0, 1.0);
}

vec3 applySunShadow(vec3 color) {
	sunUV = (vSunUV / vSunUV.w).xyz * 0.5 + 0.5;

	vec2 m = texture(uSunDepthTexture, sunUV.xy).xy;
	float mu = m.x;
	float p = step(sunUV.z, mu);
	float sq_sigma = max(m.y - mu*mu, 0.005);

	float d = sunUV.z - mu;
	float pMax = linstep(0.005, 1.0, sq_sigma / (sq_sigma + d*d));

	float light_contr =  min(max(p, pMax), 1.0);

	light_contr = 0.5 + light_contr * 0.5;
	return color * light_contr;
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
		float fs = pow(angle, 2.0);
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

	vec3 finalColor = ambient * color * AMBIENT_CONTRIBUTION + (color * diffuse + specular) * (1.0 - AMBIENT_CONTRIBUTION);
	finalColor = applyCarHeadlights(finalColor);
	return applySunShadow(finalColor);
}