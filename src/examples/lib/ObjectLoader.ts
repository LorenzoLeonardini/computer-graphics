import { Vector2, Vector3 } from './Vector'

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
				if (vertices.length > Math.pow(2, 16)) {
					throw new Error('16 bit indices are not enough for this model')
				}
				data = Array(vertices.length * (3 + 2 + 3))
			}

			const triangle_indices = []

			for (let i = 1; i <= 3; i++) {
				const vertex = parts[i].split('/')
				const index = parseInt(vertex[0]) - 1
				const texture = parseInt(vertex[1]) - 1
				const normal = parseInt(vertex[2]) - 1
				indices.push(index)
				triangle_indices.push(index)
				data[index * (3 + 2 + 3 + 3) + 0] = vertices[index][0]
				data[index * (3 + 2 + 3 + 3) + 1] = vertices[index][1]
				data[index * (3 + 2 + 3 + 3) + 2] = vertices[index][2]
				data[index * (3 + 2 + 3 + 3) + 3] = textures[texture][0]
				data[index * (3 + 2 + 3 + 3) + 4] = 1 - textures[texture][1]
				data[index * (3 + 2 + 3 + 3) + 5] = normals[normal][0]
				data[index * (3 + 2 + 3 + 3) + 6] = normals[normal][1]
				data[index * (3 + 2 + 3 + 3) + 7] = normals[normal][2]
			}

			// Tangent space calculation
			// https://www.youtube.com/watch?v=4DUfwAEx4Ts
			// https://web.archive.org/web/20150515090411/http://www.terathon.com/code/tangent.html
			const deltaPos1 = new Vector3(
				data[triangle_indices[1] * (3 + 2 + 3 + 3) + 0] -
					data[triangle_indices[0] * (3 + 2 + 3 + 3) + 0],
				data[triangle_indices[1] * (3 + 2 + 3 + 3) + 1] -
					data[triangle_indices[0] * (3 + 2 + 3 + 3) + 1],
				data[triangle_indices[1] * (3 + 2 + 3 + 3) + 2] -
					data[triangle_indices[0] * (3 + 2 + 3 + 3) + 2]
			)
			const deltaPos2 = new Vector3(
				data[triangle_indices[2] * (3 + 2 + 3 + 3) + 0] -
					data[triangle_indices[0] * (3 + 2 + 3 + 3) + 0],
				data[triangle_indices[2] * (3 + 2 + 3 + 3) + 1] -
					data[triangle_indices[0] * (3 + 2 + 3 + 3) + 1],
				data[triangle_indices[2] * (3 + 2 + 3 + 3) + 2] -
					data[triangle_indices[0] * (3 + 2 + 3 + 3) + 2]
			)
			const deltaUv1 = new Vector2(
				data[triangle_indices[1] * (3 + 2 + 3 + 3) + 3] -
					data[triangle_indices[0] * (3 + 2 + 3 + 3) + 3],
				data[triangle_indices[1] * (3 + 2 + 3 + 3) + 4] -
					data[triangle_indices[0] * (3 + 2 + 3 + 3) + 4]
			)
			const deltaUv2 = new Vector2(
				data[triangle_indices[2] * (3 + 2 + 3 + 3) + 3] -
					data[triangle_indices[0] * (3 + 2 + 3 + 3) + 3],
				data[triangle_indices[2] * (3 + 2 + 3 + 3) + 4] -
					data[triangle_indices[0] * (3 + 2 + 3 + 3) + 4]
			)

			const r = 1 / (deltaUv1[0] * deltaUv2[1] - deltaUv1[1] * deltaUv2[0])
			const tangent = deltaPos1.mul(deltaUv2[1]).sub(deltaPos2.mul(deltaUv1[1])).mul(r).normalize()

			for (let i = 0; i < 3; i++) {
				data[triangle_indices[i] * (3 + 2 + 3 + 3) + 8] = tangent[0]
				data[triangle_indices[i] * (3 + 2 + 3 + 3) + 9] = tangent[1]
				data[triangle_indices[i] * (3 + 2 + 3 + 3) + 10] = tangent[2]
			}
		}
	})

	console.log(`Model loaded, ${indices.length} indices, ${data.length / 8} vertices`)
	return {
		indices: indices,
		vertices: data
	}
}
