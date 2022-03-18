---
layout: ../../layouts/BaseLayout.astro
setup: |
  import Canvas from '../../components/Canvas.svelte'
  let pmatrix = 'pmatrix'
  let n = 'n'
  let i = 'i'
title: Nuvole di punti
---

Si tratta di una collezione di punti tridimensionali, non strutturati, cioè **senza informazioni di adiacenza**. Tipicamente oltre alla posizione hanno, quando possibile, un valore di normale, assieme ad altri attributi come può essere il colore.

Il tipo di nuvola di punti all'atto pratico dipende dalla loro sorgente, da come sono stati creati:

- gli **scanner 3D attivi** funzionano come una macchina fotografica, ma al posto del colore misurano la distanza (**scanner laser**, **scanner a luce strutturata**). Il campionamento è generalmente molto denso, simile a una fotografia.
- la **Structure from Motion** utilizza la **computer vision** per ottenere una nuvola di punti da un insieme di normali fotografie. I punti ottenuti hanno così anche un'informazione legata al loro colore.

Le nuvole di punti sono soggette a diversi problemi:

- il **sampling non è generalmente uniforme**
- alcuni materiali potrebbero avere proprietà **non adatte ad essere scansionate** attivamente
- i risultati, in particolare per la SfM sono spesso molto **rumorosi**
- per tecnologie laser gli scan **non sono allineati**

Per il rendering dei punti generalmente si utilizzano dei **surfel** (**surf**ace **el**ement): i punti vengono raffigurati come piccoli dischi, orientati secondo una normale, e con diverse proprietà (posizione, normale, colore, dimensione).

Riassumendo, le nuvole di punti sono spesso economiche e semplici da ottenere mediante gli scanner, e sono relativamente facili da renderizzare con una GPU. Tuttavia, dal punto di vista matematico **non definiscono una superficie**, dal punto di vista algoritmico **non definiscono un grafo** ed è quindi complesso definire punti "vicini", e possono essere difficili da renderizzare a causa di rumore e irregolarità nel sampling.
