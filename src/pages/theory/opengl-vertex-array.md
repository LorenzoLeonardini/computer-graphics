---
layout: ../../layouts/BaseLayout.astro
setup: |
  import Canvas from '../../components/Canvas.svelte'
title: Vertex Array
---

Si è visto in precedenza come [caricare dati sulla GPU](/theory/opengl-vertex-buffer) e come [definirne un layout](/theory/opengl-vertex-attribute).

Definire i vertex attribute, però, non è un'operazione associata al vertex buffer specifico, ma modifica lo [stato](/theory/opengl#opengl-come-macchina-a-stati) generico di OpenGL. Per questo, quando si vuole renderizzare un altro modello, contenuto in un altro vertex buffer, oltre ai vari bind, è necessario ridefinire ogni volta il layout con i vertex buffer.

Questo diventa piuttosto scomodo e ripetitivo, oltre a sembrare apparentemente inutile, basterebbe che OpenGL memorizzasse il layout associandolo a quel vertex buffer. Ebbene, nelle versioni recenti di OpenGL e in **WebGL 2** (non in WebGL 1), viene presentata una soluzione che funziona esattamente in questa maniera. L'unica differenza è che il layout non viene associato direttamente al vertex buffer, ma a quello che si chiama **vertex array**. I vertex array associano un layout a uno specifico buffer. Effettuare il binding del vertex array significa contemporaneamente fare il binding al buffer e caricare il layout dei vertex attribute.

In realtà in OpenGL moderno i vertex array sono obbligatori e si utilizzano sempre, anche quando non ce se ne rende conto: ve ne è infatti sempre attivo uno di default.

```cpp
unsigned int vao;
glGenVertexArrays(1, &vao);
glBindVertexArray(vao);

unsigned int buffer;
glGenBuffers(1, &buffer);
glBindBuffer(GL_ARRAY_BUFFER, buffer);

glEnableVertexAttribArray(0);
glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 2 * sizeof(float), 0);
```

```ts
const vao = gl.createVertexArray()
gl.bindVertexArray(vao)

const buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

gl.enableVertexAttribArray(0)
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 2 * 4, 0)
```

Prima di effettuare il render adesso c'è solo bisogno di fare il bind del vertex array e, eventualmente, dell'index buffer.
