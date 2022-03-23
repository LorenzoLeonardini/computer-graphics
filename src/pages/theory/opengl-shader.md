---
layout: ../../layouts/BaseLayout.astro
setup: |
  import Canvas from '../../components/Canvas.svelte'
title: Shader
---

La prima domanda che ci poniamo è: _che cos'è una shader?_

Una shader non è altro che un programma che viene **eseguito dalla GPU**. Una stringa di codice che possiamo scrivere come qualsiasi altro programma, mandarlo alla GPU, compilarlo come qualsiasi altro programma, _linkarlo_ come ogni altro programma e poi eseguirlo.

Mentre la CPU è più adatta e più veloce per computazioni generiche, la GPU è particolarmente efficiente per calcoli paralleli, calcoli matriciali e in generale un sacco di cose che tornano comode per la grafica. Non tutto è meglio eseguito sulla scheda video, ci sono alcune cose che sono più veloci da calcolare sul processore per poi mandare i risultati in VRAM per il rendering.

In generale, la scheda video non sa che farsene coi nostri dati, le shader permettono di definire come calcolare trasformazioni, luci, ombre e in generale ottenere il colore del pixel sul nostro schermo.

Diversi step della [pipeline di render](/theory/paradigmi-rendering) sono caratterizzati da shader diverse che lavorano su dati separati. In particolare le due principali shader che ci interessano sono la **vertex shader** e la **fragment shader**. La prima è responsabile per il calcolo della posizione dei vertici dei vari poligoni nella scena, la seconda è responsabile per il calcolo del colore dei vari fragment. La vertex shader viene eseguita per ogni vertice dei poligoni, ed è in grado di accedere ai [vertex attribute](/theory/opengl-vertex-attribute), mentre la fragment shader viene eseguita per ogni frammento da rasterizzare.

I passi che dobbiamo svolgere per avere un programma per la nostra GPU sono quindi:

- scrivere il sorgente della vertex e della fragment shader
- creare le shader
- compilare i due sorgenti
- linkare il programma
- abilitare il programma ([macchina a stati](/theory/opengl#opengl-come-macchina-a-stati))

Assumendo di avere due variabili `vertexShaderSource` e `fragmentShaderSource` contenenti il codice sorgente delle due shader:

```cpp
unsigned int program = glCreateProgram();

unsigned int vertexShader = glCreateShader(GL_VERTEX_SHADER);
glShaderSource(vertexShader, 1, &vertexShaderSource, nullptr);
glCompileShader(vertexShader);

unsigned int fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
glShaderSource(fragmentShader, 1, &fragmentShaderSource, nullptr);
glCompileShader(fragmentShader);

glAttachShader(program, vertexShader);
glAttachShader(program, fragmentShader);
glLinkProgram(program);
glValidateProgram(program);
```

```ts
const program = gl.createProgram()

const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vertexShaderSource)
gl.compileShader(vertexShader)

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fragmentShaderSource)
gl.compileShader(fragmentShader)

gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)
gl.validateProgram(program)
```

Una volta creato il programma le singole shader non servono più, e si possono eliminare. Non è obbligatorio, ma non servono più, tanto vale liberare memoria.

```cpp
glDeleteShader(vertexShader);
glDeleteShader(fragmentShader);
```

```ts
gl.deleteShader(vertexShader)
gl.deleteShader(fragmentShader)
```

Per debugging si può chiedere a OpenGL l'esito sia della compilazione, sia l'esito del linking, sia la validità del programma completo. Il metodo cambia molto tra OpenGL e WebGL.
