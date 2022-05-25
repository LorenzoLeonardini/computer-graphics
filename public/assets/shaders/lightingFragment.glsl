in vec3 vDirectionalLightsDirection[10];
in vec3 toCameraVector;
uniform vec4 uDirectionalLightsColor[10]; // 4th component is the intensity
uniform int uDirectionalLightsCount;

vec3 normalToColor(vec3 normal) {
	return (normalize(normal) + vec3(1,1,1)) * 0.5;
}

float AMBIENT_CONTRIBUTION = 0.4;

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

	return ambient * color * AMBIENT_CONTRIBUTION + (color * diffuse + specular) * (1.0 - AMBIENT_CONTRIBUTION);
}
