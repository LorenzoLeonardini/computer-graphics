export function showErrorModal(title: string, src: string, line: number) {
	const backdrop = document.createElement('div')
	backdrop.classList.add('modal-backdrop')
	document.body.appendChild(backdrop)

	const modal = document.createElement('div')
	modal.classList.add('modal')

	const container = document.createElement('div')
	container.classList.add('h-full')

	const modalTitle = document.createElement('h3')
	modalTitle.textContent = title
	container.appendChild(modalTitle)

	const codeContainer = document.createElement('div')
	codeContainer.classList.add('code-container')

	const lines = document.createElement('pre')
	lines.innerHTML = Array(src.split('\n').length)
		.fill(0)
		.map((_, i) => (i + 1).toString())
		.map((c, i) => (i + 1 === line ? `<span>${c}</span>` : c))
		.join('\n')
	codeContainer.appendChild(lines)

	const code = document.createElement('pre')
	code.innerHTML = src
		.split('\n')
		.map(escapeHtml)
		.map((c, i) => (i + 1 === line ? `<span>${c}</span>` : c))
		.join('\n')
	codeContainer.appendChild(code)

	container.appendChild(codeContainer)

	modal.appendChild(container)

	document.body.appendChild(modal)
}

function escapeHtml(unsafe: string): string {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
}
