export function loadObjModel(file: string): {
	vertices: number[]
	indices: number[]
} {
	const vertices: [number, number, number][] = []
	const textures: [number, number][] = []
	const normals: [number, number, number][] = []
	const indices: number[] = []
	let data: number[] = null

	const lines = file.split('\n').map((line) => line.trim())
	lines.forEach((line) => {
		const parts = line.split(' ')
		if (line.startsWith('v ')) {
			vertices.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])])
		} else if (line.startsWith('vt ')) {
			textures.push([parseFloat(parts[1]), parseFloat(parts[2])])
		} else if (line.startsWith('vn ')) {
			normals.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])])
		} else if (line.startsWith('f ')) {
			if (data === null) {
				if (vertices.length !== textures.length || vertices.length !== normals.length) {
					// throw new Error('Weird sizes')
				}
				data = Array(vertices.length * (3 + 2 + 3))
			}

			for (let i = 1; i <= 3; i++) {
				const vertex = parts[i].split('/')
				const index = parseInt(vertex[0]) - 1
				const texture = parseInt(vertex[1]) - 1
				const normal = parseInt(vertex[2]) - 1
				indices.push(index)
				data[index * (3 + 2 + 3) + 0] = vertices[index][0]
				data[index * (3 + 2 + 3) + 1] = vertices[index][1]
				data[index * (3 + 2 + 3) + 2] = vertices[index][2]
				data[index * (3 + 2 + 3) + 3] = textures[texture][0]
				data[index * (3 + 2 + 3) + 4] = 1 - textures[texture][1]
				data[index * (3 + 2 + 3) + 5] = normals[normal][0]
				data[index * (3 + 2 + 3) + 6] = normals[normal][1]
				data[index * (3 + 2 + 3) + 7] = normals[normal][2]
			}
		}
	})

	return {
		indices: indices,
		vertices: data
	}
}
