---
layout: ../../layouts/BaseLayout.astro
setup: |
    import Canvas from '../../components/Canvas.svelte'
    import StretchedCanvas from '../../components/StretchedCanvas.svelte'
title: WebGL
---

[WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) è un'API JavaScript per disegnare grafiche bi e tridimensionali nel browser. È basata su OpenGL, in particolare sulla versione **OpenGL ES**, implementa in maniera molto simile. Per questo i concetti di base delle due API si sovrappongono e possono essere studiati in parallelo.

WebGL permette di utilizzare le accelerazioni grafiche hardware della GPU per "disegnare" negli elementi `<canvas>` di HTML5.

Mentre la versione standard di WebGL supporta le feature di OpenGL ES 2.0, una versione più recente (e ormai supportata da quasi tutti i browser), WebGL 2, aggiunge il supporto per le funzionalità di OpenGL ES 3.0.

Per poter utilizzare WebGL, occorre ottenere un "context" di disegno in JavaScript. All'atto pratico i canvas HTML possono essere disegnati da diversi context, WebGL è solo un esempio, come 2d e bitmap rendering.

```js
const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')
const gl2 = canvas.getContext('webgl2')
```

Gli esempi che vedremo saranno tutti in [TypeScript](https://www.typescriptlang.org/), per sfruttare il controllo dei tipi e l'autocompletamento delle funzioni.

```ts
const canvas :HTMLCanvasElement = document.querySelector('canvas')
const gl :WebGLRenderingContext = canvas.getContext('webgl')
const gl2 :WebGL2RenderingContext = canvas.getContext('webgl2')
```

A questo punto si possono cominciare a chiamare le funzioni dell'API:

```ts
gl.bindBuffer(...)
```

Una nota molto importante: nell'impostare la dimensione del canvas, è fondamentale specificarla negli attributi del tag HTML. Questi infatti definiscono la dimensione del viewport, ovvero dell'area effettivamente renderizzabile. Quando si cambiano le dimensioni con CSS, invece, il canvas e la viewport vengono "stretchati" per adattarsi alla dimensione specificata da CSS. (Notare inoltre che la dimensione negli attributi non vuole unità di misura, può essere solo in pixel)

```html
<canvas
	id="canvas"
	width="500"
	height="500">
</canvas>
```

Di seguito un esempio di canvas con dimensione specificata negli attributi contro un canvas stretchato da CSS:

<Canvas example='triangle' client:load />

<StretchedCanvas example='triangle' client:load />
