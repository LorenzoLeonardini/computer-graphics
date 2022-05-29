#version 300 es
precision highp float;

out vec4 outColor;

float planeApprox(float depth) {
	// Compute partial derivatives of depth.
	float dx = dFdx(depth);
	float dy = dFdy(depth);
	// Compute second moment over the pixel extents.
	return depth * depth + 0.25 * (dx * dx + dy * dy);
}

void main(void) {
	outColor = vec4(gl_FragCoord.w, planeApprox(gl_FragCoord.w), 0.0, 1.0);
}