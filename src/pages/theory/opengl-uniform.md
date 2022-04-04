---
layout: ../../layouts/BaseLayout.astro
setup: |
  import Canvas from '../../components/Canvas.svelte'
title: Uniform
---

Se si vogliono passare dati alle shader ci sono due alternative. La prima, come si è già visto, consiste nell'associare un valore ad ogni vertice, inserendolo nel [vertex buffer](/theory/opengl-vertex-buffer) e definendone la struttura con i [vertex attribute](/theory/opengl-vertex-attribute). Altrimenti OpenGL offre la possibilità di caricare valori per "draw call", ovvero valori uguali per ogni vertice, che vengono caricati prima di chiamare `drawArrays` o `drawElements`. Questo secondo tipo di variabile si chiama `uniform` (rimane uniforme per tutti i vertici) e può essere definito nelle shader in maniera simile agli attributi e i varying:

```shader
uniform mat4 uProjectionMatrix;
```

Un esempio classico in cui le uniform vengono utilizzate è per passare alla shader le matrici di trasformazione necessarie per renderizzare una scena tridimensionale:

```shader
attribute vec3 aPosition;

uniform mat4 uProjectionMat;

void main(void) {
  gl_Position = uProjectionMat * vec4(aPosition, 1.0);
}
```

Come si passano però i valori da caricare nella shader? Al momento della compilazione, il compilatore di OpenGL associa ad ogni variabile `uniform` un ID univoco, chiamato **uniform location**. Allo stesso tempo viene generata una tabella che mappa il nome della variabile a questo ID. Il procedimento per caricare un dato nella uniform è quindi quello di ottenere la uniform location della nostra variabile, per poi utilizzare l'ID ottenuto con uno dei molteplici metodi a disposizione:

```cpp
int location = glGetUniformLocation(shaderProgram, 'uProjectionMat');
glUniformMatrix4fv(location, 1, false, matrix);
```

```ts
const location = gl.getUniformLocation(shaderProgram, 'uProjectionMat')
gl.uniformMatrix4fv(location, false, projectionMatrix)
```

Vi sono diversi metodi `uniform____` in base al tipo di dato che si vuole caricare (vettori, matrici, interi, float, ecc). Una lista è disponibile [qui](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/glUniform.xhtml) (è il caso comunque di controllare cosa è disponibile nella versione specifica di OpenGL che si sta utilizzando)

La ragione per cui la uniform location viene ottenuta in un passaggio a parte è che si tratta di un operazione _relativamente_ costosa. Un'ottimizzazione di semplice realizzazione ma molto efficace è quella di farsi dare la uniform location dopo la creazione della shader e tenerla memorizzata in una variabile o una cache locale. Non ha particolarmente senso farsi dare la uniform location della matrice di proiezione a ogni frame, rimanendo sempre uguale la si può salvare in una variabile globale.
