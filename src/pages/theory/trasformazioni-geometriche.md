---
layout: ../../layouts/BaseLayout.astro
setup: |
    import Canvas from '../../components/Canvas.svelte'
    const p = 'p'
    const bmatrix = 'bmatrix'
    const x = 'x'
    const y = 'y'
    const xx = 'xx'
    const xy = 'xy'
    const yx = 'yx'
    const yy = 'yy'
    const o = 'o'
    const u = 'u'
    const v = 'v'
title: Trasformazioni geometriche
---

Un **punto** rappresenta una **posizione** nello spazio. Un **vettore**, per noi, rappresenta uno **spostamento** nello spazio. Ha una direzione, una lunghezza (magnitudo), e non ha una posizione.

Le operazioni che quindi definiamo sono le seguenti:
- somma tra punto e vettore, il cui risultato è un punto: $\mathrm{p}_0 + v_0 = \mathrm{p}_1$
- differenza tra due punti, il cui risultato è un vettore: $\mathrm{p}_1 - \mathrm{p}_0 = v_0$
- somma tra vettori, il cui risultato è un vettore: $v_0 + v_1 = v_1 + v_0 = v_2$
- moltiplicazione tra scalare e vettore, il cui risulato è un vettore: $2v_0 = v_1$
- prodotto scalare tra due vettori, il cui risultato è uno scalare: $a \cdot b = \sum^n a_1b_1 + \ldots + a_nb_n = || a || || b || \cos(\theta)$, da cui abbiamo che il prodotto scalare tra due vettori è zero se i due vettori sono perpendicolari tra loro.
- prodotto vettoriale tra due vettori, il cui risultato è un vettore: $a \times b$. Restituisce un vettore ortogonale sia ad $a$ che a $b$. La norma del prodotto vettoriale

Ricordiamo velocemente anche le **coordiate polari**: un metodo alternativo alle coordinate x-y per rappresentare una posizione. Sono composte di due valori (in contesto bidimensionale): $\alpha$ è un angolo rispetto all'asse $x$ e $\rho$ è la distanza del punto dall'origine.

Per passare da coordinate x-y a coordinate polari:

$\rho = \sqrt{x^2+y^2} \\ \alpha = \arctan2(y, x)$

Per passare da coordinate polari a coordinate x-y:

$x = \rho \cos(\alpha) \\ y = \rho \sin(\alpha)$

## Le trasformazioni

Una **trasformazione geometrica** è una funzione che mappa punti a punti e vettori a vettori. Trasformare un oggetto significa applicare la trasformazione a tutti i punti dell'oggetto.

### Traslazione

La traslazione è tipicamente utilizzata per spostare gli oggetti. Si definisce un **vettore di traslazione**, che indica direzione e magnitudo dello spostamento, e lo si somma ad ogni punto dell'oggetto.

### Scalatura

Consiste nel ridimensionare un oggetto cambiandone la scala. Si calcola moltiplicando le componenti dei punti che compongono l'oggetto per dei **fattori di scala** (scaling factor).

$S(\mathrm{p}) = \begin{bmatrix}s_x \cdot \mathrm{p}_x \\ s_y \cdot \mathrm{p}_y \end{bmatrix}$

Se $s_x = s_y$ si dice che la scalatura è **uniforme** (o **isotropica**), significa che le proporzioni dell'oggetto non cambiano. Altrimenti si dice che la scalatura è **non uniforme** (**anisotropica**).

### Rotazione

Consiste nel ruotare un oggetto attorno all'asse $z$ (nel caso bidimensionale). Dato un punto $p$ espresso in coordinate polari

$\mathrm{p} = \begin{bmatrix}\rho \cos(\beta) \\ \rho \sin(\beta)\end{bmatrix}$

la rotazione di un angolo $\alpha$ si calcola

$R(\mathrm{p}) = \begin{bmatrix}\rho \cos(\beta + \alpha) \\ \rho \sin(\beta + \alpha)\end{bmatrix} = \begin{bmatrix}\cos(\alpha)\mathrm{p}_x - \sin(\alpha)\mathrm{p}_y \\ \sin(\alpha)\mathrm{p}_x + \cos(\alpha)\mathrm{p}_y\end{bmatrix}$

### Shear

Consiste nel traslare ogni punto lungo un asse in maniera proporzionale alla posizione sull'altro asse.

## Trasformazioni attraverso matrici

Il modo più comodo per calcolare in realtà le varie trasformazioni, è effettuando moltiplicazioni di oppurtune **matrici di trasformazione**. Ad esempio, scalatura e rotazione sappiamo si possono rappresentare entrambe come

$\mathrm{p}'_x = a_{xx}\mathrm{p}_x + a_{xy}\mathrm{p}_y \\ \mathrm{p}'_y = a_{yx}\mathrm{p}_x + a_{yy}\mathrm{p}_y$

e quindi, più comodamente

$\mathrm{p}' = \begin{bmatrix} a_{xx} & a_{xy} \\ a_{yx} & a_{yy}\end{bmatrix}\mathrm{p}$

**Matrice di rotazione:**

$R_\alpha = \begin{bmatrix} \cos(\alpha) & -\sin(\alpha) \\ \sin(\alpha) & \cos(\alpha)\end{bmatrix}$

**Matrice di scalatura:**

$S = \begin{bmatrix} s_x & 0 \\ 0 & s_y\end{bmatrix}$

Tutta via, la moltiplicazione matrice-vettore esprime combinazioni lineari, che non sono applicabili per la traslazione, a meno di non utilizzare **coordinate omogenee**

$\mathrm{p} = \begin{bmatrix}p_x \\ p_y \\ 1\end{bmatrix} \;\;\;\;\;\; v = \begin{bmatrix}v_x \\ v_y \\ 0\end{bmatrix}$

Si aggiunge un ulteriore "coordinata", impostata a 1 per i punti e a 0 per i vettori.

Per compiere una **traslazione con matrici** si ottiene dunque:

$\begin{bmatrix}1 & 0 & v_x \\ 0 & 1 & v_y \\ 0 & 0 & 1\end{bmatrix}\begin{bmatrix}p_x \\ p_y \\ 1\end{bmatrix} = \begin{bmatrix}p_x + v_x \\ p_y + v_x \\ 1\end{bmatrix}$

Una matrice che compie traslazione, rotazione e scalatura ha quindi la forma

$\begin{bmatrix}a_{xx} & a_{xy} & v_x \\ a_{yx} & a_{yy} & v_y \\ 0 & 0 & 1\end{bmatrix}$

## Proprietà delle trasformazioni

Una trasformazione si dice **affine** se e solo se
- preserva collinearità
- preserva il rapporto tra le distanze di coppie punti su linee parallele
- preserva il parallelismo: linee parallele rimangono parallele

Traslazione, scalatura e rotazione sono tutte e tre trasformazioni affini.

In generale, qualsiasi trasformazione la cui matrice ha l'ultima riga di soli zeri (escluso l'elemento in basso a destra) ed è invertibile è una trasformazione affine.

## Comporre trasformazioni

Se voglio compiere più trasformazioni in serie, una dopo l'altra, posso limitarmi a moltiplicare il punto di partenza per le matrici di trasformazione, in successione.

## Frame

Un frame è un **sistema di riferimento**, in cui andiamo a definire punti e vettori. Un frame è caratterizzato da un'origine $o$, un'asse orizzontale $u$ e un'asse verticale $v$. Si chiama frame canonico quello per cui $o = \begin{bmatrix}0 \\ 0 \\ 1\end{bmatrix}$, $u = \begin{bmatrix}1 \\ 0 \\ 0\end{bmatrix}$ e $v = \begin{bmatrix}0 \\ 1 \\ 0\end{bmatrix}$

Dato un frame $F = [o, u, v]$ lo si può rappresentare come una matrice

$F = \begin{bmatrix}u_x & v_x & o_x \\ u_y & v_y & o_y \\ 0 & 0 & 1\end{bmatrix}$

Se $\mathrm{p}_F$ sono le coordinate di un punto in un frame $F$, $F\mathrm{p}_F$ sono le coordinate nel frame canonico.

## Estensione a tre dimensioni

I concetti di base rimangono gli stessi, vengono utilizzate matrici e vettori a quattro dimensioni invece che a tre (rimane il bisogno delle coordinate omogenee). L'unico aspetto richiedente un minimo di cura in più è quello legato alle rotazioni.

In tre dimensioni, infatti, si può scegliere di ruotare un oggetto attorno a uno qualsiasi dei **tre assi di rotazione**.

$R_x = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & \cos(\alpha) & -\sin(\alpha) & 0 \\ 0 & \sin(\alpha) & \cos(\alpha) & 0 \\ 0 & 0 & 0 & 1\end{bmatrix}$

$R_y = \begin{bmatrix} \cos(\alpha) & 0 & -\sin(\alpha) & 0 \\ 0 & 1 & 0 & 0 \\ \sin(\alpha) & 0 & \cos(\alpha) & 0 \\ 0 & 0 & 0 & 1\end{bmatrix}$

$R_z = \begin{bmatrix} \cos(\alpha) & -\sin(\alpha) & 0 & 0 \\ \sin(\alpha) & \cos(\alpha) & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1\end{bmatrix}$