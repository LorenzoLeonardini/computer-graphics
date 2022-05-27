#define MAX_DIRECTIONAL_LIGHTS 4
#define MAX_SPOTLIGHTS 10

uniform vec3 uDirectionalLightsDirection[MAX_DIRECTIONAL_LIGHTS];
uniform vec3 uSpotlightsPosition[MAX_SPOTLIGHTS];
uniform vec3 uSpotlightsDirection[MAX_SPOTLIGHTS];

out vec3 vDirectionalLightsDirection[MAX_DIRECTIONAL_LIGHTS];
out vec3 vToSpotlightsVector[MAX_SPOTLIGHTS];
out vec3 vSpotlightsDirection[MAX_SPOTLIGHTS];
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

	for(int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++) {
		vDirectionalLightsDirection[i] = toTangentSpace * (uViewMat * vec4(uDirectionalLightsDirection[i], 0.0)).xyz;
	}

	for(int i = 0; i < MAX_SPOTLIGHTS; i++) {
		vToSpotlightsVector[i] = toTangentSpace * (uViewMat * vec4(uSpotlightsPosition[i], 0.0)).xyz;
		vToSpotlightsVector[i] = toTangentSpace * (positionRelativeToCamera - (uViewMat * vec4(uSpotlightsPosition[i], 1.0))).xyz;
		vSpotlightsDirection[i] = toTangentSpace * (uViewMat * vec4(uSpotlightsDirection[i], 0.0)).xyz;
	}
}