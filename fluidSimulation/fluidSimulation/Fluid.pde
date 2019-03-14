public class Fluid {
  int size;
  float dt;
  float diff;
  float visc;

  float[] s;
  float[] density;

  float[] vx;
  float[] vy;

  float[] vx0;
  float[] vy0;

  private final static int ITERATIONS = 10;

  public Fluid(int size, float dt, float diff, float visc) {
    this.size = size;
    this.dt = dt;
    this.diff = diff;
    this.visc = visc;

    this.s = new float[size * size];
    this.density = new float[size * size];

    this.vx = new float[size * size];
    this.vy = new float[size * size];

    this.vx0 = new float[size * size];
    this.vy0 = new float[size * size];
  }

  public void addDye(int x, int y, float amount) {
    density[ix(x, y)] += amount;
  }

  public void addVelocity(int x, int y, float dx, float dy) {
    int index = ix(x, y);
    vx[index] = dx;
    vy[index] = dy;
  }

  public void step() {
    int size = this.size;
    float visc = this.visc;
    float diff = this.diff;
    float dt = this.dt;
    float[] vx = this.vx;
    float[] vy = this.vy;
    float[] vx0 = this.vx0;
    float[] vy0 = this.vy0;
    float[] s = this.s;
    float[] density = this.density;

    diffuse(1, vx0, vx, visc, dt);
    diffuse(2, vy0, vy, visc, dt);

    project(vx0, vy0, vx, vy);

    advect(1, vx, vx0, vx0, vy0);
    advect(2, vy, vy0, vx0, vy0);

    project(vx, vy, vx0, vy0);

    diffuse(0, s, density, diff, dt);
    advect(0, density, s, vx, vy); // POSSIBLE ERROR: missing argument `dt`
  }

  public void render() {
    loadPixels();

    for (int y = 0; y < size; y++) {
      for (int x = 0; x < size; x++) {
        pixels[ix(x, y)] = color(floor(density[ix(x, y)]));
      }
    }

    updatePixels();
  }

  private void diffuse(int b, float[] x, float[] x0, float diff, float dt) {
    float a = dt * diff * (size - 2) * (size - 2);
    lin_solve(b, x, x0, a, 1 + 6 * a);
  }

  private void lin_solve(int b, float[] x, float[] x0, float a, float c) {
    float cRecip = 1f / c;

    for (int k = 0; k < ITERATIONS; k++) {
      for (int j = 1; j < size - 1; j++) {
        for (int i = 1; i < size - 1; i++) {
          x[ix(i, j)] = (
            x0[ix(i, j)] +
            a * (
            x[ix(i + 1, j)] +
            x[ix(i - 1, j)] +
            x[ix(i, j + 1)] +
            x[ix(i, j - 1)]
            )
            ) * cRecip;
        }
      }
    }

    set_bnd(b, x);
  }


  private void project(float[] velX, float[] velY, float[] p, float[] div) { 
    for (int j = 1; j < size - 1; j++) {
      for (int i = 1; i < size - 1; i++) {
        div[ix(i, j)] = -0.5 * (
          velX[ix(i + 1, j)] -
          velX[ix(i - 1, j)] +
          velY[ix(i, j + 1)] -
          velY[ix(i, j - 1)]
          ) / size;

        p[ix(i, j)] = 0;
      }
    }

    set_bnd(0, div);
    set_bnd(0, p);
    lin_solve(0, p, div, 1, 6);

    for (int j = 1; j < size - 1; j++) {
      for (int i = 1; i < size - 1; i++) {
        velX[ix(i, j)] -= 0.5 * (p[ix(i + 1, j)] - p[ix(i - 1, j)]);
        velY[ix(i, j)] -= 0.5 * (p[ix(i, j + 1)] - p[ix(i, j - 1)]);
      }
    }

    set_bnd(1, velX);
    set_bnd(2, velY);
  }

  private void advect(int b, float[] d, float[] d0, float[] velX, float[] velY) {
    float i0, i1, j0, j1;

    float dtx = dt * (size - 2);
    float dty = dt * (size - 2);

    float s0, s1, t0, t1;
    float tmp1, tmp2, x, y;

    float sizef = (float)this.size;
    float ifloat, jfloat;
    int i, j;

    for (j = 1, jfloat = 1; j < size - 1; j++, jfloat++) {
      for (i = 1, ifloat = 1; ifloat < size - 1; i++, ifloat++) {
        tmp1 = dtx * velX[ix(i, j)];
        tmp2 = dty * velY[ix(i, j)];
        x = ifloat - tmp1;
        y = jfloat - tmp2;

        if (x < 0.5) { 
          x = 0.5;
        }
        if (x > sizef + 0.5) { 
          x = sizef + 0.5;
        }
        i0 = floor(x);
        i1 = i0 + 1f;
        if (y < 0.5) { 
          y = 0.5;
        }
        if (y > sizef + 0.5) { 
          y = sizef + 0.5;
        }
        j0 = floor(y);
        j1 = j0 + 1f;

        s1 = x - i0;
        s0 = 1f - s1;
        t1 = y - j0;
        t0 = 1f - t1;

        int i0i = int(i0);
        int i1i = int(i1);
        int j0i = int(j0);
        int j1i = int(j1);

        d[ix(i, j)] =
          s0 * (t0 * d0[ix(i0i, j0i)] + t1 * d0[ix(i0i, j1i)]) +
          s1 * (t0 * d0[ix(i1i, j0i)] + t1 * d0[ix(i1i, j1i)]);
      }
    }

    set_bnd(b, d);
  }

  private void set_bnd(int b, float[] x) {
    for (int i = 1; i < size - 1; i++) {
      x[ix(i, 0)] = (b == 2 ? -x[ix(i, 1)] : x[ix(i, 1)]);
      x[ix(i, size - 1)] = (b == 2 ? -x[ix(i, size - 2)] : x[ix(i, size - 2)]);
    }

    for (int j = 1; j < size - 1; j++) {
      x[ix(0, j)] = (b == 1? -x[ix(1, j)] : x[ix(1, j)]); 
      x[ix(size - 1, j)] = (b == 1 ? -x[ix(size - 2, j)] : x[ix(size - 2, j)]);
    }

    x[ix(0, 0)] = 0.5 * (x[ix(1, 0)] + x[ix(0, 1)]);
    x[ix(0, size - 1)] = 0.5 * (x[ix(1, size - 1)] + x[ix(0, size - 2)]);
    x[ix(size - 1, 0)] = 0.5 * (x[ix(size - 2, 0)] + x[ix(size - 1, 1)]);
    x[ix(size - 1, size - 1)] = 0.5 * (x[ix(size - 2, size - 1)] + x[ix(size - 1, size - 2)]);
  }

  private int ix(int x, int y) {
    if (x >= size) { 
      x = size - 1;
    } else if (x < 0) { 
      x = 0;
    }
    if (y >= size) { 
      y = size - 1;
    } else if (y < 0) { 
      y = 0;
    }

    return y * size + x;
  }
}
