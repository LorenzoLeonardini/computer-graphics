---
layout: ../../layouts/BaseLayout.astro
setup: |
  import Canvas from '../../components/Canvas.svelte'
title: Index Buffer
---

Quando si vuole disegnare qualcosa di più di un semplice triangolo, si incontra un problema. Immaginiamo di voler disegnare un semplice quadrato, con quattro vertici A, B, C, D. Col semplice setup di un [vertex buffer](/theory/opengl-vertex-buffer) dovremmo inserire le coordinate dei vertici A, B, C per il primo triangolo e poi i vertici B, C, D per il secondo triangolo. Notiamo la ripetizione di due vertici. Per quanto in questo semplice esempio non sembri un grande problema, in modelli tridimensionali complessi un vertice può essere ripetuto decine di volte. Oltre ad essere scomodo da gestire, quando si cominciano ad aggiungere attributi come colore, normali, texture, ecc, la dimensione dei dati ripetuti si fa più che rilevante, e la VRAM non è infinita.

Quello che vorremmo fare è definire i vertici una sola volta nel vertex buffer, e poi fornire a OpenGL una lista di indici che definiscono quali vertici formano ogni triangolo. Nell'esempio precedente avremmo il vertex buffer contenente [A, B, C, D] e un **index buffer** contenente [0, 1, 2, 1, 2, 3]. Per quanto così sembri più costoso, se immaginiamo vertici con coordinate tridimensionali e una componente colore, si passa da

```cpp
// 6 * 6 * 4 = 144 byte
float vertices[] = {
  -1.0f, -1.0f, 0.0f, 1.0f, 0.0f, 0.0f,
   1.0f, -1.0f, 0.0f, 0.0f, 1.0f, 0.0f,
  -1.0f,  1.0f, 0.0f, 0.0f, 0.0f, 1.0f,

  -1.0f,  1.0f, 0.0f, 0.0f, 0.0f, 1.0f,
   1.0f, -1.0f, 0.0f, 0.0f, 1.0f, 0.0f,
   1.0f,  1.0f, 0.0f, 1.0f, 1.0f, 1.0f
};
```

a

```cpp
// 6 * 4 * 4 = 96 byte
float vertices[] = {
  -1.0f, -1.0f, 0.0f, 1.0f, 0.0f, 0.0f,
   1.0f, -1.0f, 0.0f, 0.0f, 1.0f, 0.0f,
  -1.0f,  1.0f, 0.0f, 0.0f, 0.0f, 1.0f,
   1.0f,  1.0f, 0.0f, 1.0f, 1.0f, 1.0f
};

// 6 * 4 = 24 byte
unsigned int indices[] = {
  0, 1, 2,
  2, 1, 3
};

// TOT: 120 byte
```

Se già in un esempio così semplice si risparmiano 24 byte, si può solo immaginare il risparmio che si ottiene in un complesso modello tridimensionale.

Vediamo quindi come si crea un index buffer e come lo si usa per il rendering.

```cpp
unsigned int indices;
glGenBuffers(1, &indices);
glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, indices);
```

```ts
const indices = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices)
```

Notiamo che in questo caso, a differenza dei vertex buffer, il target specificato è `ELEMENT_ARRAY_BUFFER`. Questo permette di avere contemporanemente bound sia il vertex buffer, sia l'index buffer. Per il render quindi si chiama `drawElements` (anziché `drawArrays`) e nello [stato corrente](/theory/opengl#opengl-come-macchina-a-stati) di OpenGL sono già presenti i buffer necessari.
