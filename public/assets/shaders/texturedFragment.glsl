precision lowp float;

uniform sampler2D uTexture;

varying vec2 vTexCoords;
varying vec3 vNormal;

void main(void) {
	gl_FragColor = texture2D(uTexture, vTexCoords);
}
