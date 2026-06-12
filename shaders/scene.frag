#version 300 es

precision highp float;

in vec3 vWorldPosition;
in vec3 vWorldNormal;

uniform vec3 uObjectColor;

uniform vec3 uLightDirection;
uniform vec3 uLightColor;

out vec4 fragColor;

void main()
{
    vec3 normalizedNormal = normalize(vWorldNormal);
    vec3 normalizedLightDirection = normalize(-uLightDirection);

    float diffuseFactor =
        max(
            dot(
                normalizedNormal,
                normalizedLightDirection
            ),
            0.0
        );

    float ambientStrength = 0.25;

    vec3 ambientComponent =
        ambientStrength *
        uObjectColor;

    vec3 diffuseComponent =
        diffuseFactor *
        uLightColor *
        uObjectColor;

    vec3 finalColor = ambientComponent + diffuseComponent;
    fragColor = vec4(finalColor, 1.0);
}