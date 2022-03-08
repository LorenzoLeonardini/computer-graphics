---
layout: ../../layouts/BaseLayout.astro
setup: import Canvas from '../../components/Canvas.svelte'
title: Le immagini
---

Con immagini in questo contesto intendiamo i file che contengono e rappresentano le immagini vere e proprie.

Ci sono due tipi di file immagine: le **immagini vettoriali** e le **immagini raster**.

Le immagini vettoriali sono costituite da un insieme di **primitive geometriche** (triangoli, poligoni, linee, curve...) che all'atto pratico forniscono istruzioni su come disegnare l'immagine stessa. Questo permette di scalare a qualsiasi dimensione senza perdita di dettaglio. D'altro canto però è possibile utilizzarle solo per forme più o meno geometriche e non sono sostituti praticabili per immagini raster generiche. Vengono generamente utilizzate per grafiche e loghi.

Le immagini raster sono costituite da una griglia di punti chiamati **pixel**. Sono caratterizzate da una specifica **risoluzione**, cioè il numero di pixel per unità di misura, e da un numero di **canali**, ovvero quanta informazione per ogni pixel. Un canale singolo fornisce informazioni di luminosità, senza colore. Tre canali forniscono informazioni sul colore nello spazio RGB. Con un quarto canale si può aggiungere la trasparenza (RGBA). Per ogni canale è indicata anche la **profondità**, ovvero quanti bit sono dedicati a memorizzare l'informazione. Normalmente si utilizzano 8 bit per canale. La dimensione dei file raster sarebbe calcolata con $ larghezza * altezza * profondità$, ma per risparmiare spazio spesso vengono compresse. Una **compressione lossy** presenta perdita di informazione e sfrutta proprietà dell'occhio nel non differenziare colori simili vicini. Una **compressione lossless** riesce a ridurre il numero di bit utilizzati mantenendo le stesse informazioni di partenza.