---
layout: ../../layouts/BaseLayout.astro
setup: import Canvas from '../../components/Canvas.svelte'
title: First steps
---

In questo primo esempio vediamo come disegnare un semplice triangolo bianco utilizzando [WebGL](/theory/webgl).

Notiamo subito la necessità di dividere il codice TypeScript in due "parti": una di inizializzazione per setuppare WebGL e tutto ciò che vogliamo disegnare sul canvas, e una che viene chiamata ad ogni frame per disegnare sul canvas (per ora vediamo solo scene statiche, quindi basta chiamarla una volta).

Seguendo la notazione del corso, dividiamo il codice di inizializzazione in altre tre parti: l'inizializzazione del context WebGL, la definizione di ciò che vogliamo disegnare, e la preparazione della GPU per renderizzare gli oggetti come vogliamo.

```ts
let gl: WebGLRenderingContext

function setupWebGL() {
	let canvas: HTMLCanvasElement = document.querySelector('#canvas')
	gl = canvas.getContext('webgl')
}

function setupWhatToDraw() {
	/* ... */
}

function setupHowToDraw() {
	/* ... */
}

function draw() {
	/* ... */
}

window.onload = () => {
	setupWebGL()
	setupWhatToDraw()
	setupHowToDraw()
	draw()
}
```

Il primo step da compiere nella funzione `draw` è quello di ripulire il canvas dal frame precedente. A tale scopo OpenGL/WebGL offre due funzioni, `clearColor` e `clear`, che permettono di riempire il canvas con un determinato colore. In particolare `clearColor` permette di definire il colore desiderato, `clear` è responsabile per effettivamente ripulire lo schermo.

```ts
function draw() {
	gl.clearColor(0.2, 0.3, 0.4, 1.0) // RGBA
	gl.clear(gl.COLOR_BUFFER_BIT)
}
```

<Canvas example='clear-canvas' client:load />

Notiamo come i valori RGBA non siano nel range 0-255, ma nel range 0-1. Si tratta di **float normalizzati**. In generale vedremo spesso che in WebGL molti valori vengono normalizzati tra 0 e 1 o tra -1 e 1. Ad esempio, le coordinate del viewport vanno da -1 a 1: il centro del viewport ha coordinate (0,0), l'angolo in alto a sinistra (-1,-1) e così via. Questo significa che un movimento di 0.1 orizzontale non corrisponde allo stesso numero di pixel di un movimento di 0.1 verticale.

Procediamo quindi a definire le coordinate del triangolo che vogliamo disegnare. Il nostro obiettivo è quello di ottenere un triangolo isoscele, con un vertice in alto al centro e due vertici in basso negli angoli:

```ts
export function setupWhatToDraw() {
	const positions = [
		// 1st vertex
		-1, -1,
		// 2nd vertex
		1, -1,
		// 3rd vertex
		0, 1
	]
}
```

Gli array di JS sono però strani e possono contenere valori di tipo diverso. WebGL ha bisogno di avere con certezza solo valori di tipo float, e per questo ci è necessario "wrappare" le coordinate in un oggetto di tipo `Float32Array`

```ts
const typedPositions = new Float32Array(positions)
```

È il momento di passare i nostri dati alla GPU, per farlo dobbiamo inserirli in un [vertex buffer](/theory/opengl-vertex-buffer) (`WebGLBuffer`):

```ts
const positionsBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer)
gl.bufferData(gl.ARRAY_BUFFER, typedPositions, gl.STATIC_DRAW)
```

Creiamo un buffer ed effettuiamo un "bind". Chiamiamo quindi la funzione `bufferData`, indicando come target `ARRAY_BUFFER`, che adesso sappiamo essere "bound" a `positionsBuffer`. Questa seconda funzione ha lo scopo di caricare i dati nella memoria del buffer, specificandone un utilizzo. Qua vediamo l'utilizzo standard: `STATIC_DRAW` che sta a indicare che i dati non varieranno nel tempo (STATIC) e verranno utilizzati per il render (DRAW). Notare che l'utilizzo ha solamente un ruolo di suggerimento per la GPU, che tenterà di ottimizzare la memorizzazione dei dati in base a quello che specifichiamo. Ciò significa che nessuno ci vieta, ad esempio, anche dopo aver specificato STATIC, di modificare di tanto in tanto il contenuto del buffer.

L'ultimo passo è quello di fornire una struttura ai dati, che al momento per la GPU non sono altro che byte caricati in memoria. Per fare ciò utilizziamo i [vertex attribute](/theory/opengl-vertex-attribute). A ogni vertex attribute è associato un indice, per comodità quindi definiamo una costante globale `const slotPositions = 0`.

```ts
export function setupWhatToDraw() {
	const positions = [
		// 1st vertex
		-1, -1,
		// 2nd vertex
		1, -1,
		// 3rd vertex
		0, 1
	]

	const typedPositions = new Float32Array(positions)

	const positionsBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, typedPositions, gl.STATIC_DRAW)

	gl.enableVertexAttribArray(slotPositions)
	gl.vertexAttribPointer(slotPositions, 2, gl.FLOAT, false, 8, 0)
}
```

I vertex attribute non hanno bisogno di un bind, ma serve indicare alla GPU che sono attivi in modo che possa caricarli nella vertex shader. Con `vertexAttribPointer` finalmente definiamo la struttura dei dati contenuti nel buffer attualmente "bound": per maggiori informazioni si rimanda alla pagina sui [vertex attribute](/theory/opengl-vertex-attribute).

È arrivato ora il momento di programmare la GPU per disegnare il nostro triangolo. Per farlo utilizzeremo due shader: la vertex shader, che esegue per ogni vertice ed è responsabile per determinarne il suo posizionamento, e la fragment shader che esegue per ogni pixel ed è responsabile per determinarne il suo colore.

Le shader sono veri e propri programmi, di cui dobbiamo scrivere il sorgente, che dobbiamo poi compilare:

```ts
export function setupHowToDraw() {
	const vertexShaderSource = `
		attribute vec2 aPosition;

		void main(void) {
			gl_Position = vec4(aPosition, 0.0, 1.0);
		}
	`
	const vertexShader = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertexShader, vertexShaderSource)
	gl.compileShader(vertexShader)

	const fragmentShaderSource = `
		precision lowp float;

		void main(void) {
			gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
		}
	`
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
	gl.shaderSource(fragmentShader, fragmentShaderSource)
	gl.compileShader(fragmentShader)
}
```

Le nostre prime due shader sono molto semplici.

La vertex shader riceve in input un attributo di tipo vettore a due dimensioni, chiamato arbritrariamente `aPosition`. Riceverà i dati dal nostro buffer. Tutto quello che fa è poi impostare una variabile chiamata `gl_Position` (il cui nome è definito dalle specifiche di WebGL, occhio ai typo), che però è di tipo `vec4` e quindi dobbiamo espandere aggiungendo una coordinata z impostata a 0 e una coordinata w che **deve** essere 1.

La fragment shader, assegna un valore alla variabile `gl_FragColor`, che rappresenta il colore con un vettore a 4 dimensioni (RGBA). Come per `gl_Position` il nome è definito dalla specifica ed è importante non fare errori. Notiamo anche `precision lowp float;`, che serve a definire la precisione di macchina con cui vengono eseguiti i calcoli.

Se vogliamo farci stampare in console gli errori di compilazione delle shader (se ce ne sono), possiamo utilizzare il seguente codice:

```ts
const message_vs = gl.getShaderInfoLog(vertexShader)
const message_fs = gl.getShaderInfoLog(fragmentShader)

console.log(message_vs, message_fs)
```

Il prossimo passo è quello di definire un "programma", che nel gergo di OpenGL/WebGL indica una serie di shader, linkate tra loro, utilizzate nella pipeline di render. In questa occasione dobbiamo anche associare il nostro attributo `slotPositions` al nome 'aPosition' (e come si fa se non con un bind?). L'ultimo passaggio è quello di specificare che vogliamo utilizzare questo programma per i prossimi rendering.

```ts
const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.bindAttribLocation(program, slotPositions, 'aPosition')
gl.linkProgram(program)
gl.useProgram(program)
```

Finalmente è tutto pronto, ci manca solo da aggiungere una chiamata a funzione in `draw`:

```ts
export function draw() {
	gl.clearColor(0.2, 0.8, 0.4, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.drawArrays(gl.TRIANGLES, 0, 3)
}
```

questa ci permette di disegnare il contenuto dell'`ARRAY_BUFFER`, indicando che si tratta di 3 vertici, a partire dall'indice 0.

<Canvas example='triangle' client:load />
