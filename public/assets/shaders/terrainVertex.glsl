#version 300 es

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aTexCoords;
layout(location = 2) in vec3 aNormal;
layout(location = 3) in vec3 aTangent;

uniform mat4 uProjectionMat;
uniform mat4 uViewMat;
uniform mat4 uObjectMat;

out vec2 vTexCoords;
out vec3 vNormal;
#include "lightingVertex.glsl"

void main(void) {
	vTexCoords = aTexCoords;
	calculateTangentFrame(uViewMat, uObjectMat);
	calculateProjectingLightsUV();
	calculateSunUV();

	gl_Position = uProjectionMat * positionRelativeToCamera;
}