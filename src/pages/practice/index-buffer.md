---
layout: ../../layouts/BaseLayout.astro
setup: import Canvas from '../../components/Canvas.svelte'
title: Index buffer
---

Estendiamo l'esempio [Attributi multipli](/practice/first-steps-colore) disegnando un quadrato e sfruttando gli index buffer per evitare la duplicazione dei vertici.

Cominciamo ridefinendo `vertices` in modo da includere due triangoli:

```ts
const vertices = [
	// 1st vertex
	-1, -1, 1, 0, 0,
	// 2nd vertex
	1, -1, 0, 1, 0,
	// 3rd vertex
	-1, 1, 0, 0, 1,
	// 1st vertex
	-1, 1, 0, 0, 1,
	// 2nd vertex
	1, -1, 0, 1, 0,
	// 3rd vertex
	1, 1, 1, 1, 1
]
```

Aggiornando ora la chiamata a `drawArrays` per disegnare 6 vertici otteniamo il nostro quadrato

```ts
gl.drawArrays(gl.TRIANGLES, 0, 6)
```

<Canvas example='colored-square' client:load />

Vogliamo quindi ridurre la dimensione di `vertices` e introdurre un index buffer:

```ts
export function setupWhatToDraw() {
	const vertices = [
		// 1st vertex
		-1, -1, 1, 0, 0,
		// 2nd vertex
		1, -1, 0, 1, 0,
		// 3rd vertex
		-1, 1, 0, 0, 1,
		// 4th vertex
		1, 1, 1, 1, 1
	]
	const typedVertices = new Float32Array(vertices)

	const buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, typedVertices, gl.STATIC_DRAW)

	const indices = [
		// 1st triangle
		0, 1, 2,
		// 2nd triangle
		2, 1, 3
	]
	const typedIndices = new Uint16Array(indices)

	const ibo = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedIndices, gl.STATIC_DRAW)
}
```

Notare l'importanza di `Uint`: gli indici devo _obbligatoriamente_ essere unsigned int. In questo caso abbiamo specificato 16 bit, quindi unsigned short, perché WebGL 1 di default _non supporta_ unsigned int a 32 bit per gli indici. Vi è un estensione (di cui però bisogna verificare la disponibilità per ogni dispositivo) che permette di utilizzare unsigned int a 32 bit:

```ts
const ext = gl.getExtension('OES_element_index_uint')
if (!ext) {
	// il dispositivo non supporta uint per gli indici!!!
}
```

Aggiorniamo infine la funzione `draw` per utilizzare `drawElements` anziché `drawArrays`:

```ts
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
```

Come per `drawArrays` è richiesto il tipo di primitiva (`TRIANGLES`), il numero di primitive da renderizzare (6), e l'offset (0), ma è anche richiesto il tipo utilizzato per gli indici (`UNSIGNED_SHORT` nel nostro caso)

<Canvas example='index-buffer' client:load />
