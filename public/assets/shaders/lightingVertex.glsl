uniform vec3 uDirectionalLightsDirection[10];
uniform vec3 uSpotlightsPosition[10];
uniform vec3 uSpotlightsDirection[10];

out vec3 vDirectionalLightsDirection[10];
out vec3 vToSpotlightsVector[10];
out vec3 vSpotlightsDirection[10];
out vec3 toCameraVector;

out vec4 positionInTangentSpace;

vec4 positionRelativeToCamera;
mat3 toTangentSpace;

void calculateTangentFrame(mat4 uViewMat, mat4 uObjectMat) {
	vNormal = normalize((uViewMat * uObjectMat * vec4(aNormal, 0.0)).xyz);

	vec3 tangent = normalize((uViewMat * uObjectMat * vec4(aTangent, 0.0)).xyz);
	vec3 bitangent = normalize(cross(vNormal, tangent));

	positionRelativeToCamera = uViewMat * uObjectMat * vec4(aPosition, 1.0);

	toTangentSpace = mat3(
		tangent.x, bitangent.x, vNormal.x,
		tangent.y, bitangent.y, vNormal.y,
		tangent.z, bitangent.z, vNormal.z
	);
	toCameraVector = toTangentSpace * (-positionRelativeToCamera).xyz;

	for(int i = 0; i < 10; i++) {
		vDirectionalLightsDirection[i] = toTangentSpace * (uViewMat * vec4(uDirectionalLightsDirection[i], 0.0)).xyz;
	}

	for(int i = 0; i < 10; i++) {
		vToSpotlightsVector[i] = toTangentSpace * (uViewMat * vec4(uSpotlightsPosition[i], 0.0)).xyz;
		vToSpotlightsVector[i] = toTangentSpace * (positionRelativeToCamera - (uViewMat * vec4(uSpotlightsPosition[i], 1.0))).xyz;
		vSpotlightsDirection[i] = toTangentSpace * (uViewMat * vec4(uSpotlightsDirection[i], 0.0)).xyz;
	}
}