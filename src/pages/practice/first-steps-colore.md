---
layout: ../../layouts/BaseLayout.astro
setup: import Canvas from '../../components/Canvas.svelte'
title: Attributi multipli
---

In questo primo esempio vogliamo espandere [first steps](/practice/first-steps) aggiungendo un attributo "colore" ai nostri vertici. Per farlo, aggiungiamo dati RGB al nostro buffer: ogni vertice conterrà così 2 float di posizione e 3 float di colore.

```ts
export function setupWhatToDraw() {
	const vertices = [
		// 1st vertex
		-1, -1, 1, 0, 0,
		// 2nd vertex
		1, -1, 0, 1, 0,
		// 3rd vertex
		0, 1, 0, 0, 1
	]
	const typedVertices = new Float32Array(vertices)

	const buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)
}
```

Aggiorniamo ora i [vertex attribute](/theory/opengl-vertex-attribute) per includere anche il colore nel layout. Definiamo quindi una seconda costante globale `const slotColors = 1`.

```ts
gl.enableVertexAttribArray(slotPositions)
gl.vertexAttribPointer(slotPositions, 2, gl.FLOAT, false, 20, 0)
gl.enableVertexAttribArray(slotColors)
gl.vertexAttribPointer(slotColors, 3, gl.FLOAT, false, 20, 8)
```

Il problema da affrontare adesso è che gli attributi possono essere letti solo dalla vertex shader, ma noi vorremmo passare il colore alla fragment shader per definire il colore dei pixel. Fortunatamente però, abbiamo la possibilità di passare dati tra le vertex shader e le fragment shader (mediante variabili `varying`), per cui leggiamo l'attributo colore e lo inoltriamo alla fragment shader.

```shader
attribute vec2 aPosition;
attribute vec3 aColor;

varying vec3 vColor;

void main(void) {
	vColor = aColor;
	gl_Position = vec4(aPosition, 0.0, 1.0);
}
```

```shader
precision lowp float;

varying vec3 vColor;

void main(void) {
	gl_FragColor = vec4(vColor, 1.0);
}
```

Non dimentichiamo di aggiungere la chiamata a `bindAttribLocation` per il colore

```ts
gl.bindAttribLocation(program, slotPositions, 'aPosition')
gl.bindAttribLocation(program, slotColors, 'aColor')
```

<Canvas example='colored-triangle' client:load />
