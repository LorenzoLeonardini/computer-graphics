---
layout: ../../layouts/BaseLayout.astro
setup: import Canvas from '../../components/Canvas.svelte'
title: Paradigmi di rendering
---

Dati una descrizione della geometria che compone una scena, informazioni sull'illuminazione, sui materiali dei vari oggetti, e sul modello della videocamera che la inquadra (posizione, apertura focale, ecc), un **algoritmo di rendering** è una serie di passaggi che genera l'immagine finale, mostrata poi sullo schermo.

Ci sono due approcci diversi per il rendering: il **ray tracing** e la **rasterizzazione**.

## Ray tracing

L'idea fondamentale del ray tracing è molto semplice: data una scena vogliamo "**simulare**" e seguire il percorso di **ogni raggio luminoso**, dall'emissione, attraverso tutti gli oggetti su cui rimbalza, fino poi a raggiungere l'osservatore. Poiché non tutti i raggi emessi da una fonte luminosa giungono all'osservatore, diventa più sensato seguire la strada al contrario, partendo dal punto di vista e attraversando ogni pixel della scena.

```python
for pixel in pixels:
	r = ray(viewpoint, pixel)
	for primitive in scene:
		# trova l'intersezione (r, primitive) e tieni la più vicina
```

Per ottenere effetti il più realistico possibile, è importante analizzare ogni **riflessione** del raggio luminoso sui vari oggetti, non fermandosi al primo "rimbalzo". Più riflessioni si calcolano e più l'effetto risulta realistico (una simulazione perfetta andrebbe avanti all'infinito), ma diventa anche più costoso da calcolare.

Oltre alle riflessioni è opportuno tenere presente che la luce viene anche rifratta da ogni materiale in maniera diversa, e quindi di nuovo per ogni raggio e ogni intersezione bisogna tenere conto di un nuovo raggio di **rifrazione**.

Sebbene l'idea del ray tracing sia quindi estremamente semplice e intuitiva, è chiaro come per ottenere effetti realistici e ad alta qualità si richieda un costo computazionale non indifferente.

Dati un numero di "rimbalzi" $N$, una scena $S$ composta da oggetti $o$, e indicando il costo dell'intersione tra un raggio $r$ e un oggetto $o$ come $Int(r, o)$, il costo per il calcolo del ray tracing per un raggio $r$ si calcola come

$$RTCost(r) = N\cdot\sum_{'\forall o \in S'} Int(r, o)$$

Quali sono le primitive possibili? In sostanza tutto ciò che può intersecare un raggio: poligoni, solidi, tutto quello che si vuole.

## Rasterizzazione

Il principio della rasterizzazione è l'opposto: cerco di proiettare tutte le primitive della scena sul mio schermo. Una volta trovata la proiezione occorre rasterizzare, ovvero calcolare i valori dei pixel come [immagine raster](/theory/immagini).

Quali sono le primitive che possono essere rasterizzate? Quelle per cui ci è semplice proiettare dal 3D al 2D e convertirle in pixel. Generalmente **segmenti**, **punti** e **triangoli**.

In maniera molto semplificata e schematizzata, la pipeline di render in un sistema basato su rasterizzazione si scompone in:

- definizione della scena
- per ogni vertice (**vertex shader**) si applicano trasformazioni geometriche volte a posizionarlo nello spazio e per proiettarlo sullo schermo
- i punti vengono assemblati e processati in primitive
- le primitive vengono **rasterizzate** in ciò che si chiama **frammento** (frammenti). Non sono pixel, sono associati ai pixel ma contengono più informazioni
- computazione per frammento (**fragment shader**)
- output combiner: una sorta di image processing
- l'immagine finale arriva nel frame buffer, ovvero ciò che vedo sullo schermo

Il costo degli algoritmi basati su rasterizzazione si può approssimare in questo modo:

$$CostR = K\cdot\#vertex + \sum_{'\forall p \in S'} R(p)$$

dove $K$ è il costo per trasformare un singolo vertice, $R(p)$ è il costo per rasterizzare la primitiva $p$.

## Pro e contro

I vantaggi del ray tracing sono quindi chiari: un algoritmo concettualmente semplice, che porta a risultati più realistici senza richiedere l'implementazione di algoritmi specifici, con una maggiore libertà nelle primitive supportate.

I vantaggi della rasterizzazione sono invece dati dalla facilità con cui si riesce a parallelizzare e dal fatto che è più adatta per le schede video attuali. Riesce a controllare più facilmente la complessità, è più semplice gestire scene dinamiche e scala meglio con la risoluzione.

Non è vero che il ray tracing sia obbligatoriamente lento e non è vero che la rasterizzazione non possa portare a scene realistiche e con effetti complessi.

> Rasterization is fast, but needs cleverness to support complex visual effects.
> 
> Ray tracing supports complex visual effetcs, but needs cleverness to be fast.
> 
> -- <cite>David Luebke (NVIDIA)</cite>

Entrambi i metodi necessitano di riconoscere e scartare le porzioni della scena che non sono visibili (**hidden surface removal**).

Entrambi i metodi devono processare ogni primitiva nella scena, ma mentre il ray tracing deve tenere in memoria ogni primitiva durante tutto il calcolo, nella rasterizzazione le primitive sono richieste solo all'inizio e poi la memoria può essere liberata. Inoltre, sebbene il ray tracing si presti a parallelizzazione, il numero di raggi da processare è troppo alto affinché si possa computare tutti i pixel in contemporanea.

Ma perché alla fine la rasterizzazione ha "vinto" come metodo primario? Nel ray tracing, per ogni raggio, bisogna calcolare tutte le intersezioni con le primitive, in modo poi da calcolare e mantenere l'intersezione più vicina (distinguere in sostanza l'oggetto davanti dagli oggetti dietro). Questo diventa piuttosto costoso. Nella rasterizzazione questo problema è stato risolto con lo **z-buffer**, un buffer secondario, accompagnato al frame buffer, che memorizza la "profondità" di quel pixel. Per ogni frammento si procede al calcolo del pixel e al salvataggio sul frame buffer solamente se si trova di fronte al frammento già calcolato in quel pixel.

Ormai per ottenere il meglio da entrambi i mondi si tende a utilizzare una tecnica mista: alcune parti della scena vengono renderizzate utilizzando ray tracing, altre utilizzando rasterizzazione.