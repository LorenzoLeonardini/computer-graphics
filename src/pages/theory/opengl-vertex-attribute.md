---
layout: ../../layouts/BaseLayout.astro
setup: |
  import Canvas from '../../components/Canvas.svelte'
title: Vertex Attribute
---

Come anticipato parlando dei [vertex buffer](/theory/opengl-vertex-buffer), nella VRAM abbiamo byte senza un minimo di struttura, indipendentemente da che array decidiamo di caricare. Si presenta la necessità di specificare il layout dei byte in memoria, in modo da poter dire alla GPU "questi primi n byte sono coordinate in float, quelli successivi sono per la texture, quelli successivi per le normali...". Sarà poi necessario in qualche modo trasferire questo layout nelle [shader](/theory/opengl-shader) in modo da poter lavorare coi nostri dati.

In sintesi quindi i **vertex attribute** ci permettono di definire la struttura in memoria degli **attributi dei vertici** e un meccanismo per accedervi dalle shader.

Il metodo standard per la definizione del layout degli attributi è `vertexAttribPointer`. Questo ci permette di definire quali byte compongono uno specifico attributo e di specificare un **indice** associato all'attributo stesso del vertice. Ad esempio potremmo avere i byte che compongono la posizione all'indice 0, il colore all'indice 1 e così via. Sono questi indici che permettono poi di accedere ai dati tramite le shader. È **fondamentale** chiamare la funzione solo dopo aver fatto il bind del vertex buffer interessato.

La funzione accetta 6 parametri:

- `index` è l'indice intero dell'attributo
- `size` è il numero di componenti dell'attributo: ogni attributo è infatti una lista di valori, che può avere un numero di elementi diverso in base a di che attributo si tratta. Per la posizione può essere 2 o 3 (coordinate 2D vs 3D), per le texture generalmente è 2 e così via
- `type` specifica il tipo di variabile dell'array, un esempio standard è `FLOAT`
- `normalized` è un booleano che indica se i valori dell'attributo debbano essere normalizzati oppure no; generalmente i float sono già normalizzati e lo si imposta a `false`
- `stride` è la dimensione in byte di ogni vertice, _non dell'attributo_. Serve per calcolare gli offset in byte quando si vuole accedere al vertice n-esimo
- `offset` è l'offset in byte dell'attributo all'interno del vertice. Se ad esempio per ogni vertice ho 8 byte di posizione e 12 byte di colore, per accedere alla posizione l'offset è 0, per accedere al colore l'offset è 8.

Immaginiamo di avere un vertex buffer con solo float che indicano coordinate **bi**dimensionali di un poligono. Vogliamo definire un layout che associa queste posizioni all'attributo di indice 0:

```cpp
glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 2 * sizeof(float), 0);
```

```ts
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 2 * 4, 0)
```

Un altro passo fondamentale affinché il layout funzioni è quello di **abilitare** l'attributo di indice n. È irrilevante abilitare prima o dopo la chiamata a `vertexAttribPointer`, sempre perché OpenGL è una macchina a stati, ma è importante avere il buffer bound.

```cpp
glEnableVertexAttribPointer(0);
```

```ts
gl.enableVertexAttribPointer(0)
```
