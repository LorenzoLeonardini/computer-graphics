---
layout: ../../layouts/BaseLayout.astro
setup: |
  import Canvas from '../../components/Canvas.svelte'
title: Vertex Buffer
---

I **vertex buffer** sono un componente tanto fondamentale quanto semplice in OpenGL. Non sono altro che un array di byte, utilizzati dalla GPU nella pipeline di render. Un esempio banale è quello di un vertex buffer contenente le coordinate dei vertici da disegnare sullo schermo. La differenza sostanziale tra i vertex buffer e un normale array del linguaggio è che i vertex buffer vengono **salvati in VRAM**, ovvero la RAM presente all'interno della GPU (Video RAM). Come detto, si tratta di array di raw byte, sarà compito nostro poi istruire la GPU su quale sia il loro formato (es: tre float per vertice per indicare la posizione).

La creazione del vertex buffer dipende dal linguaggio utilizzato, negli esempi vediamo C++ e TypeScript con WebGL:

```cpp
unsigned int buffer;
glGenBuffers(1, &buffer);
```

```ts
const buffer = gl.createBuffer()
```

in entrambi i casi ci ritroviamo con una variabile `buffer` contenente un id intero. Poiché OpenGL è una [macchina a stati](/theory/opengl#opengl-come-macchina-a-stati), ogni volta che creiamo un "oggetto" ci viene restituito un **id univoco** che ci permette di operarci in seguito.
Quando ad esempio vogliamo selezionare un buffer (**binding**) per lavorarci sopra:

```cpp
glBindBuffer(GL_ARRAY_BUFFER, buffer);
```

```ts
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
```

Notiamo che `bindBuffer` richiede un altro parametro, il _target_, che specifica per cosa vogliamo usare il buffer di cui stiamo facendo il bind. Nel nostro caso si tratta di un semplice array di byte, quindi utilizziamo `ARRAY_BUFFER`.
