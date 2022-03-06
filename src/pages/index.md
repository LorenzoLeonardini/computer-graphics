---
layout: ../layouts/BaseLayout.astro
setup: import Canvas from '../components/Canvas.svelte'
---

Raccolta di appunti, esempi e _robe_ riguardanti il corso di Computer Grafica di UniPi. L'idea è di espandere il contenuto del corso, specialmente per la parte pratica, aggiungendo nozioni da [TheCherno](https://www.youtube.com/playlist?list=PLlrATfBNZ98foTJPJ_Ev03o2oq3-GGOS2), [Raytracing in one week](https://raytracing.github.io/) e [Learn OpenGL](https://learnopengl.com). Almeno quella è l'idea, poi vediamo quanta voglia e tempo mi rimangono.

Gli snippet di codice usano [TypeScript](https://www.typescriptlang.org/) invece di JavaScript perché è obiettivamente meglio. Consiglio personale: usare TypeScript per WebGL è anche molto più comodo per debugging e simili perché fornisce la signature e l'autocompletamento delle funzioni.

Il codice completo è disponibile su [GitHub](https://github.com/LorenzoLeonardini/computer-graphics).

<Canvas example='colored-square' client:only />