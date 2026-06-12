import { Mesh } from "../core/Mesh.js";

export class OBJLoader
{
    constructor(gl)
    {
        this.gl = gl;
    }

    async load(url)
    {
        const response = await fetch(url);
        const text = await response.text();

        return this.parse(text);
    }

    parse(objText)
    {
        const positions = [];
        const normals = [];

        const finalVertices = [];
        const finalNormals = [];
        const indices = [];

        const lines = objText.split("\n");

        for (const line of lines)
        {
            const trimmed = line.trim();
            if (!trimmed) continue;

            const parts = trimmed.split(/\s+/);

            switch (parts[0])
            {
                case "v":
                {
                    positions.push([
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    ]);
                    break;
                }

                case "vn":
                {
                    normals.push([
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    ]);
                    break;
                }

                case "f":
                {
                    const faceIndices = [];

                    for (let i = 1; i < parts.length; i++)
                    {
                        const [vStr, , vnStr] = parts[i].split("/");

                        const vIndex = parseInt(vStr) - 1;
                        const vnIndex = vnStr ? parseInt(vnStr) - 1 : 0;

                        const position = positions[vIndex];
                        const normal = normals[vnIndex] || [0, 1, 0];

                        finalVertices.push(
                            position[0],
                            position[1],
                            position[2]
                        );

                        finalNormals.push(
                            normal[0],
                            normal[1],
                            normal[2]
                        );

                        faceIndices.push(finalVertices.length / 3 - 1);
                    }

                    // triangulate (fan method)
                    for (let i = 1; i < faceIndices.length - 1; i++)
                    {
                        indices.push(
                            faceIndices[0],
                            faceIndices[i],
                            faceIndices[i + 1]
                        );
                    }

                    break;
                }
            }
        }

        return new Mesh(
            this.gl,
            finalVertices,
            finalNormals,
            indices
        );
    }
}