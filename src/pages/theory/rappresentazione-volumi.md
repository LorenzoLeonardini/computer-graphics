---
layout: ../../layouts/BaseLayout.astro
setup: |
  import Canvas from '../../components/Canvas.svelte'
  let pmatrix = 'pmatrix'
  let n = 'n'
  let i = 'i'
title: Modelli di volume
---

Dal lato volumetrico ci sono due diverse rappresentazioni:

- **voxel based**: il corrispondente tridimensionale del pixel (picture element $\to$ pix-el; volume element $\to$ vox-el), per ogni coordinata vi è un voxel con determinate proprietà (colore, densità, whatever)
- **geometria solida costruttiva** (**CGS**, constructive solid geometry): risultato di operazioni su solidi primitivi. Sono borderline rappresentazioni di superfici.

## Rappresentazione mediante voxel

Il tipo di rappresentazione più semplice è quella dei **voxel booleani**, dove un oggetto 3D è un insieme di voxel, ognuno "pieno" (true/1) o "vuoto" (false/0). Il costo è cubico rispetto alla dimensione (bisogna indicare l'esistenza di ogni singolo "pixel" del solido). Questo porta questo tipo di rappresentazione a diventare velocemente ingestibile.

Diventa chiara quindi la necessità di utilizzare un **encoding efficiente** dei voxel, che non si limiti a una risoluzione fissa, ma che sia in grado di adattarsi in base al livello di dettaglio del solido. Un esempio è la **rappresentazione gerarchica**, in cui il volume viene partizionato ricorsivamente in $n$ sottovolumi, finché non si raggiunge un sottovolume vuoto. Il costo della rappresentazione da cubico diventa **quadratico**.

Un'alternativa alla rappresentazione booleana è quella dei **float**, in cui ogni voxel contiene un valore float riferito a una qualche proprietà. Un esempio potrebbe essere la densità del solido in quel punto.

## Mesh poliedrali

Si tratta dell'estensione naturale delle mesh di superficie, tipicamente composte da due primitive: gli **esaedri** e i **tetraedri**. Sono tipicamente utilizzate per effettuare simulazioni.
