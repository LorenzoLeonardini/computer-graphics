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

## [Modelli di superficie](/theory/rappresentazione-superfici)

## [Modelli di volume](/theory/rappresentazione-volumi)

## [Nuvole di punti](/theory/rappresentazione-punti)
