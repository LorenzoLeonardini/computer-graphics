---
layout: ../../layouts/BaseLayout.astro
setup: import Canvas from '../../components/Canvas.svelte'
title: Errori
---

Il debugging in OpenGL non è particolarmente simpatico. In generale OpenGL ci avvisa quando si verifica un errore, e ci si potrebbe ritrovare davanti uno schermo nero senza avere minima idea del perché.

Quello che però fa OpenGL è settare delle flag interne ogni volta che un errore viene generato. Il metodo classico per la gestione degli errori è quindi quello di chiamare `getError()`, una funzione che restituisce un enum (intero) associato a un errore e nello stesso tempo ne resetta la flag.

Il workflow quindi è il seguente: resettare gli errori (nel caso ne siano rimasti da operazioni precedenti), chiamare la funzione interessata, controllare in un while loop se ci sono nuovi errori settati. Ecco un esempio:

```cpp
// Reset
while(glGetError() != GL_NO_ERROR);
// Chiamata funzione
glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, indices);
// Controllo errori
while((GLenum error = glGetError()) != GL_NO_ERROR) {
	std::cout << 'Errore: ' << error << std::endl;
}
```

```ts
// Reset
while (gl.getError() !== gl.NO_ERROR);
// Chiamata funzione
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices)
// Controllo errori
let error = gl.getError()
while (error !== gl.NO_ERROR) {
	console.error(`Errore: ${error}`)
	error = gl.getError()
}
```

Chiaramente, svolgere tutti questi passi ad _ogni_ chiamata di funzione, non è particolarmente piacevole. Per questo generalmente si costruiscono degli appositi wrapper (il codice è ispirato da [The Cherno](https://www.youtube.com/watch?v=FBbPWSOQ0-w)):

```cpp
#define ASSERT(x) if(!(x)) __debugbreak(); // VSCode specific
#define glCall(x) ClearErrors();\
	x;\
	ASSERT(glLogCall())

static void ClearErrors() {
	while (gl.getError() !== gl.NO_ERROR);
}

static void glLogCall() {
	bool anyError = false;
	while(GLenum error = glGetError()) {
		std::cout << 'Errore: ' << error << std::endl;
		anyError = true;
	}
	return !anyError;
}
```

```ts
function glCall<F extends (...args: any) => any>(
	gl: WebGLRenderingContext,
	fn: F,
	...args: Parameters<F>
): ReturnType<F> {
	// Clearing errors
	while (gl.getError() !== gl.NO_ERROR);

	let returnValue = fn.call(gl, ...args)

	// Getting errors
	let error = gl.getError()
	let anyError = error !== gl.NO_ERROR
	while (error !== gl.NO_ERROR) {
		console.error(`[WebGL Error] ${error}`)
		error = gl.getError()
	}
	if (anyError) {
		debugger
		throw new Error('WebGL error, stopping execution')
	}

	return returnValue
}
```

e poi i wrapper si possono usare in questo modo:

```cpp
glCall(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, indices));
```

```ts
glCall(gl, gl.bindBuffer, gl.ELEMENT_ARRAY_BUFFER, indices)
```

**NOTA:** nell'ultima versione di OpenGL (e non in WebGL) è presente una [funzione](https://docs.gl/gl4/glDebugMessageCallback) che permette di registrare un callback da chiamare in caso di errore, in modo che non si debba fare "polling" dopo l'esecuzione di ogni funzione.
