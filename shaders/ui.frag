#version 300 es

precision highp float;

in vec2 vTextureCoordinates;

uniform sampler2D uRenderedTexture;

out vec4 fragColor;

void main()
{
    vec4 textureColor =
        texture(
            uRenderedTexture,
            vTextureCoordinates
        );

    fragColor = textureColor;
}