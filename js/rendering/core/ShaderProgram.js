export class ShaderProgram
{
    constructor(gl)
    {
        this.gl = gl;
        this.program = null;
        this.uniformLocations = new Map();
    }

    async load(vertexShaderPath, fragmentShaderPath)
    {
        const vertexShaderSource = await this.loadTextFile(vertexShaderPath);
        const fragmentShaderSource = await this.loadTextFile(fragmentShaderPath);

        const vertexShader =
            this.compileShader(
                this.gl.VERTEX_SHADER,
                vertexShaderSource
            );

        const fragmentShader =
            this.compileShader(
                this.gl.FRAGMENT_SHADER,
                fragmentShaderSource
            );

        this.program =
            this.linkProgram(
                vertexShader,
                fragmentShader
            );
    }

    async loadTextFile(path)
    {
        const response = await fetch(path);

        if (!response.ok)
        {
            throw new Error(
                `Unable to load file: ${path}`
            );
        }

        return await response.text();
    }

    compileShader(shaderType, shaderSource)
    {
        const shader = this.gl.createShader(shaderType);

        this.gl.shaderSource(
            shader,
            shaderSource
        );

        this.gl.compileShader(shader);

        const compileStatus =
            this.gl.getShaderParameter(
                shader,
                this.gl.COMPILE_STATUS
            );

        if (!compileStatus)
        {
            const errorMessage = this.gl.getShaderInfoLog(shader);

            this.gl.deleteShader(shader);

            throw new Error(
                `Shader compilation failed:\n${errorMessage}`
            );
        }

        return shader;
    }

    linkProgram(vertexShader, fragmentShader)
    {
        const program = this.gl.createProgram();

        this.gl.attachShader(
            program,
            vertexShader
        );

        this.gl.attachShader(
            program,
            fragmentShader
        );

        this.gl.linkProgram(program);

        const linkStatus =
            this.gl.getProgramParameter(
                program,
                this.gl.LINK_STATUS
            );

        if (!linkStatus)
        {
            const errorMessage = this.gl.getProgramInfoLog(program);

            this.gl.deleteProgram(program);

            throw new Error(
                `Program link failed:\n${errorMessage}`
            );
        }

        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);

        return program;
    }

    use()
    {
        this.gl.useProgram(this.program);
    }

    getUniformLocation(uniformName)
    {
        if (this.uniformLocations.has(uniformName))
            return this.uniformLocations.get(uniformName);

        const location =
            this.gl.getUniformLocation(
                this.program,
                uniformName
            );

        this.uniformLocations.set(
            uniformName,
            location
        );

        return location;
    }

    setMat4(uniformName, matrix)
    {
        this.gl.uniformMatrix4fv(
            this.getUniformLocation(uniformName),
            false,
            matrix
        );
    }

    setVec3(uniformName, vector)
    {
        this.gl.uniform3fv(
            this.getUniformLocation(uniformName),
            vector
        );
    }

    setFloat(uniformName, value)
    {
        this.gl.uniform1f(
            this.getUniformLocation(uniformName),
            value
        );
    }

    setInt(uniformName, value)
    {
        this.gl.uniform1i(
            this.getUniformLocation(uniformName),
            value
        );
    }
}