---
layout: ../../layouts/BaseLayout.astro
setup: |
  import Canvas from '../../components/Canvas.svelte'
title: Dai vertici ai pixel
---

Diversi algoritmi e passaggi sono richiesti nella [pipeline di render](/theory/paradigmi-rendering) prima di ottenere il pixel finale sul nostro schermo. Se ne vedono alcuni.

## Hidden Surface Removal

> Tra tutti i poligoni nella scena, quale produce il frammento finale? Se ho una pila di triangoli uno davanti all'altro come calcolo il frammento di quello che sta davanti in maniera efficiente?

Questo è il problema dell'**hidden surface removal**, ovvero "rimozione delle superfici nascoste": le superfici che non sono visibili vanno rimosse dalla pipeline di render, in modo da evitare computazioni inutili. Vi sono diverse ragioni per cui una primitiva potrebbe non essere visibile:

- quando sono completamente fuori dal _frustum_, ovvero dal cono visibile sullo schermo
- quando sono parzialmente fuori dal _frustum_
- quando sono completamente o parzialmente coperte da altre primitive

### Occlusion culling

Cominciamo a prendere in esame l'ultimo punto, l'**occlusion culling**: per ogni pixel vogliamo trovare la primitiva più vicina lungo il "raggio di vista" (ovvero il raggio che unisce l'occhio dell'osservatore con il centro del pixel).

Un primo approccio è quello del **depth sort** o **algoritmo del pittore**, in cui le primitive vengono ordinate in base alla distanza e vengono renderizzate a partire da quella più lontana, disegno **back-to-front**. L'ordinamento purtroppo non può far parte della pipeline e perciò deve essere compiuto sulla CPU prima di inviare i vertici alla GPU. Il depth sort inoltre non è immediato da calcolare: non è particolarmente semplice decidere e riconoscere se un poligono sta davanti o dietro a un altro poligono. La tecnica utilizzata è quella dei **separating plane**, che cercano di individuare un piano che divida ogni coppia di poligoni. Tuttavia, anche con questa tecnica, non sempre è possibile trovare un ordinamento, in quanto potrebbe addirittura non esistere. _Cosa succede se due poligoni si intersecano? Cosa succede se ho un ciclo di poligoni che si "coprono" a vicenda?_

Un altro problema rilevante del depth sort è che le coordinate dei vertici nel view space sono note solo dopo le trasformazioni, che idealmente vorremmo fare sulla GPU. La soluzione vincente, [come già accennato](/theory/paradigmi-rendering#pro-e-contro), è quella dello **z-buffer**, un buffer parallelo che contiene il valore della profondità di ogni frammento, che permette di saltare il rendering di frammenti con distanza maggiore rispetto a quella già presente nello z-buffer. Quando due poligoni hanno valori di profondità molto simili tra loro, tali che la precisione dello z-buffer non permette di distinguerli, si verifica il fenomeno dello **z-fighting**. Questo in particolare peggiora con le trasformazioni prospettiche.

### Backface culling

In presenza di un oggetto chiuso, il **backface culling** si occupa di rimuovere dalla pipeline di render tutte le facce dietro l'oggetto. Per effettuare questa scrematura si utilizzano le normali delle facce dei poligoni. Per convenzione le normali puntano all'esterno dell'oggetto, per cui se la normale punta "verso di me" allora sto guardando il davanti della faccia, altrimenti il retro. Più precisamente, se la mia direzione di vista forma con la normale un angolo inferiore a 90 gradi, allora la faccia visibile è quella frontale. All'atto pratico basta guardare l'ordine (orario o antiorario) dei vertici quando proiettati sul piano di vista. Questo viene calcolato dopo le trasformazioni nella vertex shader, ma prima di rasterizzare.

## Blending

A volte il valore di un frammento potrebbe voler essere determinato da più poligoni sovrapposti. Si basti pensare a un oggetto semitrasparente, ed esempio un vetro colorato, per cui vogliamo che il colore finale venga dato da un **blending** del colore del vetro e del poligono sottostante. In generale il blending, quando abilitato, permette di calcolare il valore di un frammento secondo una combinazione lineare: $F_d * d + F_s * s$, dove $F_d$ indica il valore del frammento sovrastante, con annesso moltiplicatore $d$ e $F_s$ indica il valore sottostante. In OpenGL, per esempio, un impostazione standard per il blending dei colori con alpha channel è

```ts
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
```

Notare che per compiere il blending in maniera appropriata, è necessario effettuare il render dei poligoni in ordine **back-to-front**.

## Aliasing

L'**aliasing** si riferisce al fatto che un insieme di pixel potrebbe rappresentare cose diverse. È causato dalla discretizzazione in pixel dell'immagine e si verifica quando vediamo i bordi dei poligoni "a scalini" (una differenza netta tra i vari pixel).
L'idea dietro l'**antialiasing** si basa sul dare a ogni pixel un colore con alpha proporzionale all'area che il segmento o il poligono occupano in quel pixel. Vi sono diverse tecniche per implementare l'antialiasing.

Il **Super Sampling Anti Aliasing** (**SSAA**) renderizza la scena in un framebuffer più grande e lo ridimensiona calcolando la media del colore dei vari pixel. Funziona, ma è costoso: occupa memoria perché i buffer aumentano di dimensione (raddoppiare le dimensioni significa avere buffer quattro volte più grandi), costa più tempo perché bisogna eseguire le shader per ogni nuovo frammento che si è aggiunto.

Il **Multi Sampling Anti Aliasing** (**MSAA**) tenta di fare la stessa cosa ma senza ingrandire il frame buffer. Solo il depth e lo stencil buffer vengono ingranditi, la fragment shader viene eseguita una volta sola per ogni fragment, ma prende in considerazione più campioni per ogni pixel e calcola la media dei colori.
