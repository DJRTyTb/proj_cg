import { Vec3 } from "./Vec3.js";

export class Mat4
{
    static create()
    {
        const matrix = new Float32Array(16);

        matrix[0] = 1;
        matrix[5] = 1;
        matrix[10] = 1;
        matrix[15] = 1;

        return matrix;
    }

    static identity(out)
    {
        out.fill(0);

        out[0] = 1;
        out[5] = 1;
        out[10] = 1;
        out[15] = 1;

        return out;
    }

    static perspective(
        out,
        fieldOfViewRadians,
        aspect,
        near,
        far
    )
    {
        const f = 1.0 / Math.tan(fieldOfViewRadians / 2);

        const nf = 1 / (near - far);

        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;

        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;

        out[8] = 0;
        out[9] = 0;
        out[10] = (far + near) * nf;
        out[11] = -1;

        out[12] = 0;
        out[13] = 0;
        out[14] = 2 * far * near * nf;
        out[15] = 0;

        return out;
    }

    static multiply(out, a, b)
    {
        const a00 = a[0],  a01 = a[1],  a02 = a[2],  a03 = a[3];
        const a10 = a[4],  a11 = a[5],  a12 = a[6],  a13 = a[7];
        const a20 = a[8],  a21 = a[9],  a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        const b00 = b[0],  b01 = b[1],  b02 = b[2],  b03 = b[3];
        const b10 = b[4],  b11 = b[5],  b12 = b[6],  b13 = b[7];
        const b20 = b[8],  b21 = b[9],  b22 = b[10], b23 = b[11];
        const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];

        out[0]  = a00*b00 + a10*b01 + a20*b02 + a30*b03;
        out[1]  = a01*b00 + a11*b01 + a21*b02 + a31*b03;
        out[2]  = a02*b00 + a12*b01 + a22*b02 + a32*b03;
        out[3]  = a03*b00 + a13*b01 + a23*b02 + a33*b03;

        out[4]  = a00*b10 + a10*b11 + a20*b12 + a30*b13;
        out[5]  = a01*b10 + a11*b11 + a21*b12 + a31*b13;
        out[6]  = a02*b10 + a12*b11 + a22*b12 + a32*b13;
        out[7]  = a03*b10 + a13*b11 + a23*b12 + a33*b13;

        out[8]  = a00*b20 + a10*b21 + a20*b22 + a30*b23;
        out[9]  = a01*b20 + a11*b21 + a21*b22 + a31*b23;
        out[10] = a02*b20 + a12*b21 + a22*b22 + a32*b23;
        out[11] = a03*b20 + a13*b21 + a23*b22 + a33*b23;

        out[12] = a00*b30 + a10*b31 + a20*b32 + a30*b33;
        out[13] = a01*b30 + a11*b31 + a21*b32 + a31*b33;
        out[14] = a02*b30 + a12*b31 + a22*b32 + a32*b33;
        out[15] = a03*b30 + a13*b31 + a23*b32 + a33*b33;

        return out;
    }

    static translate(out, a, v)
    {
        const x = v[0];
        const y = v[1];
        const z = v[2];

        if (out !== a) out.set(a);

        out[12] = a[0] * x + a[4] * y + a[8]  * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9]  * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];

        return out;
    }

    static scale(out, a, v)
    {
        const x = v[0];
        const y = v[1];
        const z = v[2];

        out[0] = a[0] * x;
        out[1] = a[1] * x;
        out[2] = a[2] * x;
        out[3] = a[3] * x;

        out[4] = a[4] * y;
        out[5] = a[5] * y;
        out[6] = a[6] * y;
        out[7] = a[7] * y;

        out[8] = a[8] * z;
        out[9] = a[9] * z;
        out[10] = a[10] * z;
        out[11] = a[11] * z;

        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];

        return out;
    }

    static rotateX(out, matrix, angle)
    {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        const rotation = Mat4.create();

        rotation[5] = c;
        rotation[6] = s;
        rotation[9] = -s;
        rotation[10] = c;

        return Mat4.multiply(
            out,
            matrix,
            rotation
        );
    }

    static rotateY(out, matrix, angle)
    {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        const rotation = Mat4.create();

        rotation[0] = c;
        rotation[2] = -s;
        rotation[8] = s;
        rotation[10] = c;

        return Mat4.multiply(
            out,
            matrix,
            rotation
        );
    }

    static rotateZ(out, matrix, angle)
    {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        const rotation = Mat4.create();

        rotation[0] = c;
        rotation[1] = s;
        rotation[4] = -s;
        rotation[5] = c;

        return Mat4.multiply(
            out,
            matrix,
            rotation
        );
    }

    static lookAt(
        out,
        eye,
        target,
        up
    )
    {
        const z = Vec3.create();
        Vec3.subtract(z, eye, target);
        Vec3.normalize(z, z);

        const x = Vec3.create();
        Vec3.cross(x, up, z);
        Vec3.normalize(x, x);

        const y = Vec3.create();
        Vec3.cross(y, z, x);

        out[0] = x[0];
        out[1] = y[0];
        out[2] = z[0];
        out[3] = 0;

        out[4] = x[1];
        out[5] = y[1];
        out[6] = z[1];
        out[7] = 0;

        out[8] = x[2];
        out[9] = y[2];
        out[10] = z[2];
        out[11] = 0;

        out[12] =
            -(x[0] * eye[0] +
              x[1] * eye[1] +
              x[2] * eye[2]);

        out[13] =
            -(y[0] * eye[0] +
              y[1] * eye[1] +
              y[2] * eye[2]);

        out[14] =
            -(z[0] * eye[0] +
              z[1] * eye[1] +
              z[2] * eye[2]);

        out[15] = 1;

        return out;
    }

    static toRadian(degrees)
    {
        return degrees * Math.PI / 180.0;
    }
}