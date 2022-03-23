---
layout: ../../layouts/BaseLayout.astro
setup: |
  import Canvas from '../../components/Canvas.svelte'
title: OpenGL
---

**OpenGL** è un API grafica, progettata per permettere di controllare la GPU al fine di disegnare grafiche complesse. Non si tratta dell'unica API esistente, alcune alternative famose sono per esempio Direct3D e Vulkan.

Una cosa interessante da tenere presente è che OpenGL _non è una libreria_. OpenGL è una **specifica**, non implementa nessun codice, ma specifica cosa puoi fare con l'API, quali funzioni sono disponibili, come si comportano, eccetera. L'implementazione delle funzioni OpenGL è scritta dai produttori delle GPU e fa parte dei driver della scheda che vengono installati nel sistema operativo.

Per questo, a differenza di quanto possa suggerire il nome, l'implementazione di OpenGL _non è open source_. I produttori delle schede video si tengono stretti i codici sorgente dei driver, e ogni scheda ha implementazioni differenti con supporti ad API di versioni diverse.

Il grande punto a favore di OpenGL è che è cross platform: l'API può essere utilizzata senza distinzione su Windows, Mac, Linux (incluso Android) e con specifiche versioni anche su sistemi embedded e [su browser](/theory/webgl).

## OpenGL come macchina a stati

OpenGL opera come una **macchina a stati**. Ciò significa che non vi è una concezione ad oggetti, per esempio, ma si imposta una serie di **stati** per controllare la GPU. Quando per esempio vogliamo far disegnare un triangolo, non chiamiamo una funzione `triangle` con tutta una serie di parametri che lo definiscono. OpenGL sa già quali sono questi parametri perché fanno parte dello stato corrente.

Facciamo un esempio per capire meglio. Invece di dire `drawTriangle(coordinates, shader)`, dove `coordinates` è un array di coordinate di vertici e `shader` è un riferimento alla [shader](/theory/opengl-shader) che vogliamo utilizzare, diciamo "seleziona questo array, seleziona questa shader, ora disegna". Nel momento in cui facciamo la chiamata finale alla funzione draw, OpenGL sa che deve operare sui dati attualmente selezionati, utilizzando la shader attualmente abilitata.
