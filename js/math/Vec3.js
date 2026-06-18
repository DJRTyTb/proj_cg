export class Vec3
{
    static create()
    {
        return new Float32Array([0, 0, 0]);
    }

    static fromValues(x, y, z)
    {
        return new Float32Array([x, y, z]);
    }

    static set(out, x, y, z)
    {
        out[0] = x;
        out[1] = y;
        out[2] = z;

        return out;
    }

    static copy(out, a)
    {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];

        return out;
    }

    static subtract(out, a, b)
    {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];

        return out;
    }

    static cross(out, a, b)
    {
        const ax = a[0];
        const ay = a[1];
        const az = a[2];

        const bx = b[0];
        const by = b[1];
        const bz = b[2];

        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;

        return out;
    }

    static normalize(out, a)
    {
        const x = a[0];
        const y = a[1];
        const z = a[2];

        const len = Math.hypot(x, y, z);

        if (len > 0)
        {
            out[0] = x / len;
            out[1] = y / len;
            out[2] = z / len;
        }
        else
        {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
        }

        return out;
    }
}