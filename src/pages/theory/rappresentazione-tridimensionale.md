---
layout: ../../layouts/BaseLayout.astro
setup: |
  import Canvas from '../../components/Canvas.svelte'
  let pmatrix = 'pmatrix'
  let n = 'n'
  let i = 'i'
title: Rappresentazione tridimensionale di oggetti
---

Quando si parla di oggetti tridimensionali, ci si riferisce a una **rappresentazione matematica** che lo definisce l'oggetto.

Una prima distinzione da fare consiste nei **modelli di superficie** e i **modelli di volume**. I primi modellano solo l'esterno dell'oggetto, al solo scopo di rappresentarlo, sono anche chiamati "**bounded-based**". I secondi contengono dati per ogni singolo punto del volume, ad esempio per modelli medici in cui si rappresentano sia la superficie esterna sia il solido interno e i suoi materiali; o anche il modello di una nuvola.

Tra i modelli tridimensionali, oltre a solidi standardi, si possono trovare anche **modelli basati su punti**, come sistemi di particelle o di simulazione di liquidi, e **modelli basati su segmenti**, adatti a modellare e visualizzare capelli o simili.

Le superfici, invece, possono essere rappresentate in 3 modi:

- **superfici implicite**: definite dallo zero di una certa funzione (ad esempio $x^2 + y^2 + z^2 - 9 = 0$ per una sfera)
- **superfici parametriche**: definite da il codominio di una certa funzione.
- **mesh poligonali** (o **superfici tassellate**): utilizzate per rappresentare oggetti complessi difficilmente scomponibili in superfici implicite o superfici parametriche. Si tratta di superfici composte da tanti poligoni messi insieme, a cui non è possibile associare una vera e propria funzione.

Dal lato volumetrico ci sono due diverse rappresentazioni:

- **voxel based**: il corrispondente tridimensionale del pixel (picture element $\to$ pix-el; volume element $\to$ vox-el), per ogni coordinata vi è un voxel con determinate proprietà (colore, densità, whatever)
- **geometria solida costruttiva** (**CGS**, constructive solid geometry): risultato di operazioni su solidi primitivi. Sono borderline rappresentazioni di superfici.

## Mesh poligonali

La rappresentazione generalmente più rilevante in computer grafica. Si tratta di una collezione di **poligoni adiacenti**, cioè che condividono un lato. La **risoluzione del modello** (alta risoluzione/bassa risoluzione) si riferisce al numero di facce (o vertici) che compongono la mesh poligonale. La risoluzione spesso è **adattiva**, cioè il numero di facce varia in base al dettaglio richiesto in uno specifico punto del modello.

Come si è visto parlando di [rasterizzazione](/theory/paradigmi-rendering), la GPU generalmente lavora meglio con triangoli. Per questo, le mesh poligonali vengono divise in **mesh triangolari**. Il nome formale è **maximal simplicial complex of order 2**. (Il simplesso in N dimensioni è l'inviluppo complesso di N+1 punti, il 2-simplesso è il triangolo. Un complesso è un insieme di simplessi).

Una caratteristica che definisce se un _complesso simpliciale_ è effettivamente il bordo di un volume o semplicemente un insieme di triangoli, è la **2-manifoldness** (varietà). Se la superficie è il bordo di un volume, si dice 2-manifold. In maniera intuitiva, si può verificare se posso attaccare un dischetto di gomma sulla superficie. Se immaginiamo due cubi con un vertice in comune, questa proprietà non è valida. In maniera formale, un internal edge è two-manifold se e solo se è condiviso da due facce. Un vertice è two-manifold se appartiene a un solo ventaglio (un insieme di facce adiacenti che condividono un vertice). Per il rendering la manifoldness non è **particolarmente rilevante, per il processing** sì.

Per il rendering è invece importante l'**orientamento della faccia**: l'ordine (orario/antiorario) in cui vengono dati i vertici definisce l'orientamento di una faccia (qual è il davanti e qual è il dietro). Una mesh 2-manifold dove tutte le facce adiacenti hanno lo stesso orientamento si dice **orientata**. Se una mesh 2-manifold può essere orientata "flippando" un sottoinsieme delle sue facce si dice **orientabile**. Diventa di fondamentale importanza per il calcolo delle normali, ad esempio.

Un'altra caratteristica che una mesh può avere è essere chiusa o aperta. Definendo un **border edge** come un edge non condiviso da due facce, una **mesh chiusa** è una mesh senza border edge, una **mesh aperta** è una mesh con border edge.

### Strutture dati per le mesh

Il modo più immediato per memorizzare una mesh è quello di utilizzare una "zuppa di poligoni", un **array di N poligoni**, ciascuno con i propri attributi. È molto semplice, ma per niente efficiente, presentando la **duplicazione** di diversi attributi e vertici: tutti i vertici condivisi da più poligono appaiono nell'array più volte. È inoltre piuttosto **complesso aggiornare** la mesh: ogni volta che si vuole spostare o modificare un vertice è necessario farlo in ognuna delle sue occorrenze.

L'alternativa è quella di utilizzare l'**indexed mesh**, costituita da un array di vertici, ognuno con i propri attributi, e da una **lista di indici** che definisce i poligoni facendo riferimento ai vertici precedentemente definiti.

### Attributi per le mesh

La posizione dei vertici non è l'unica informazione utile alla mesh. Vi sono diversi attributi di interesse per la superficie, alcuni esempi banali sono il colore e i vettori normale. Per associarli alla superficie si utilizzano due metodi principali: **per vertice**, il caso più comune, in cui si rende necessario capire come definire gli attributi per tutto il resto della faccia; o **per faccia**, più raro, significa che l'attributo è costante per tutta la faccia e provoca discontinuità tra facce adiacenti.

Per capire come calcolare gli attributi all'interno della faccia, avendoli definiti per vertice, occorre prima definire le **coordinate baricentriche**: si tratta di una somma pesata dei punti che definiscono la primitiva. Per le facce triangolari abbiamo $p = w_0p_0 + w_1p_1 + w_2p_2$, con $w_0 + w_1 + w_2 = 1$. Il calcolo dei pesi viene svolto utilizzando le aree dei tre sotto triangoli che compongono la faccia, definiti dal punto di cui si vogliono calcolare le coordinate.

## Superfici implicite

Come detto prima, le superfici implicite non sono altro che lo **zero di una funzione**, cioè $S = (x,y,z): f(x,y,z)=0$. Dividono "implicitamente" l'interno dall'esterno. Se $f(p) < 0$ allora il punto $p$ si trova all'interno, se $f(p) > 0$ si trova all'esterno, se $f(p) = 0$ si trova sulla superficie. Una caratteristica interessante è che è **facile combinare** diverse superfici implicite.

Il calcolo della normale viene svolto come il gradiente normalizzato di $f(p)$, si ha quindi una formula diretta piuttosto semplice.

Con le operazioni di **massimo** e **minimo** posso ottenere l'**unione**, l'**intersezione** e la **differenza** di diverse superfici implicite.

Le superfici implicite permettono di definire anche le cosiddette **metaballs**, definite come sommatoria di funzioni semplici, in cui ogni funzione dipende solamente dalla distanza da un punto tridimensionale.

## Superfici parametriche

Prima di vedere le superfici parametriche prendiamo in esame le curve parametriche.

Le **curve parametriche** sono funzioni $f: A \to B, A \subseteq \R, B \subseteq \R^3$, con un dominio dei parametri, e definite come $f(t) = \begin{pmatrix}x(t) \\ y(t) \\ z(t) \end{pmatrix}$. Si parla di **spline** quando si parla di curve polinomiali a tratti con grado maggiore di 1. Una curva polinomiale a tratti è definita da una serie di **punti di controllo**, e ogni punto è ottenuto sommando i punti di controllo pesati con un polinomio. Si dice **interpolante** quando passa per i punti di controllo, e **approssimante** se passa vicino.

Un esempio classico sono le **curve di Bèzier**, che utilizzano come funzione per i pesi i **polinomi di Bernstein**.

$f(t) = \sum_{i=0}^n p_i B_{i,n}(t) \;\;\;\;\;\; 0 \leq t \leq 1$

$B_{i,n}(t) = \binom{n}{i}t^i (1-t)^{n-1}$

Una **superficie parametrica** è invece una funzione che va da un dominio bidimensionale a un dominio tridimensionale.

$f\begin{pmatrix}s \\ t\end{pmatrix} = \begin{pmatrix}x \\ y \\ z\end{pmatrix}$

La **Bezier patch** è l'estensione a due dimensioni della curva di Bezier.
