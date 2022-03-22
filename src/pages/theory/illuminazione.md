---
layout: ../../layouts/BaseLayout.astro
setup: |
  import Canvas from '../../components/Canvas.svelte'
  const dΦ = 'dΦ'
  const dA = 'dA'
  const dω = 'dω'
  const d2Φ = 'd2Φ'
  const d = 'd'
  const dAcosθdω = 'dAcosθdω'
title: Illuminazione
---

Il **lighting** indica il calcolo della quantità di luce che colpisce la scena. Lo **shading** calcola come interpolare il calcolo della quantità di luce sulle varie superfici.

Il problema fondamentale è quindi **quanta luce** colpisce un punto e di che **colore** è questa luce. Ciò dipende dalle **caratteristiche dell'oggetto** (il **materiale**), da **proprietà della luce** e dalla **forma dell'oggetto**.

Alcune quantità utili:

- $\Phi$ indica il flusso radiante, misurato in $Watt$, misura la quantità di luce che passa per un'area
- L'irradianza $E = \frac{dΦ}{dA}$ misura la quantità di flusso radiante per unità d'area. Si misura in $Watt/m^2$
- Intensità direzionale $I = \frac{dΦ}{dω}$ quantità di flusso per unità di angolo solido, cioè la luce che lascia un punto a un determinato angolo. Si misura in **steradianti**, ovvero la versione tridimensionale dei radianti.
- La radianza $L = \frac{d2Φ}{dAcosθdω}$ indica il flusso di radiazione per unità d'area per unità di angolo solido.

Generalmente quando si programma queste quantità non sono esplicite, vanno tenute presenti, ma nel primo approccio al lighting generalmente vi sono situazioni più semplici.

Vi sono diversi fenomeni che interessano i raggi luminosi e che determinano l'illuminazione e il colore di un oggetto:

- il più semplice è la **riflessione** della luce, il cui angolo dipende dal vettore normale al punto
- se l'oggetto non è completamente opaco, sorgenti luminose poste al di dietro contribuiscono con **rifrazione** (e opportuno **assorbimento** all'interno dell'oggetto). La rifrazione causa anche una **riflessione interna** che aumenta i raggi luminosi di cui tenere traccia
- tutti i materiali, in maniera diversa, presentano il fenomeno del **subsurface scattering**, per cui la luce viene assorbita dall'oggetto, riflessa e diffusa al suo interno, per poi fuoriuscire di nuovo
- le **ombre** proiettate da altri oggetti nella scena

Nella realtà poi non si ha a che fare con un solo oggetto, ma con una scena complessa, in cui ogni oggetto riflette i raggi luminosi e li disperde nell'ambiente, incidendo sull'illuminazione degli altri oggetti con **illuminazione indiretta**.

Nella [pipeline di render](/theory/paradigmi-rendering) con rasterizzazione, tenere traccia di tutti questi elementi è complesso, e a un'**illuminazione globale** si preferisce calcolare solo un'**illuminazione locale**, che tiene traccia solo posizione e caratteristiche delle varie sorgenti luminose, il punto della superficie che viene illuminato (con la sua noarmale e le proprietà del materiale) e la posizione dell'osservatore. Tutto il resto della scena viene ignorato.
