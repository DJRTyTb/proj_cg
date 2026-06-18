export class Framebuffer
{
    constructor(gl, width, height)
    {
        this.gl = gl;

        this.width = width;
        this.height = height;

        this.framebuffer = null;
        this.colorTexture = null;
        this.depthRenderbuffer = null;
    }

    initialize()
    {
        this.createColorTexture();
        this.createDepthBuffer();
        this.createFramebuffer();

        this.validateFramebuffer();
    }

    createColorTexture()
    {
        this.colorTexture = this.gl.createTexture();

        this.gl.bindTexture(
            this.gl.TEXTURE_2D,
            this.colorTexture
        );

        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.width,
            this.height,
            0,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            null
        );

        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MIN_FILTER,
            this.gl.LINEAR
        );

        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MAG_FILTER,
            this.gl.LINEAR
        );

        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_S,
            this.gl.CLAMP_TO_EDGE
        );

        this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_T,
            this.gl.CLAMP_TO_EDGE
        );

        this.gl.bindTexture(
            this.gl.TEXTURE_2D,
            null
        );
    }

    createDepthBuffer()
    {
        this.depthRenderbuffer = this.gl.createRenderbuffer();

        this.gl.bindRenderbuffer(
            this.gl.RENDERBUFFER,
            this.depthRenderbuffer
        );

        this.gl.renderbufferStorage(
            this.gl.RENDERBUFFER,
            this.gl.DEPTH_COMPONENT16,
            this.width,
            this.height
        );

        this.gl.bindRenderbuffer(
            this.gl.RENDERBUFFER,
            null
        );
    }

    createFramebuffer()
    {
        this.framebuffer = this.gl.createFramebuffer();

        this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,
            this.framebuffer
        );

        this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER,
            this.gl.COLOR_ATTACHMENT0,
            this.gl.TEXTURE_2D,
            this.colorTexture,
            0
        );

        this.gl.framebufferRenderbuffer(
            this.gl.FRAMEBUFFER,
            this.gl.DEPTH_ATTACHMENT,
            this.gl.RENDERBUFFER,
            this.depthRenderbuffer
        );

        this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,
            null
        );
    }

    validateFramebuffer()
    {
        this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,
            this.framebuffer
        );

        const status =
            this.gl.checkFramebufferStatus(
                this.gl.FRAMEBUFFER
            );

        this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,
            null
        );

        if (status !== this.gl.FRAMEBUFFER_COMPLETE)
        {
            throw new Error(
                "Framebuffer is incomplete."
            );
        }
    }

    bind()
    {
        this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,
            this.framebuffer
        );

        this.gl.viewport(
            0,
            0,
            this.width,
            this.height
        );
    }

    unbind(screenWidth, screenHeight)
    {
        this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,
            null
        );

        this.gl.viewport(
            0,
            0,
            screenWidth,
            screenHeight
        );
    }
}