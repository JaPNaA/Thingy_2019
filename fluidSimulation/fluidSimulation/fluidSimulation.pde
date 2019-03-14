// Following a tutorial by Daniel Shiffman
// https://www.youtube.com/watch?v=alhpH6ECFvQ

final int SIZE = 128;

Fluid fluid;

void settings() {
  size(SIZE, SIZE);
}

void setup() {
  fluid = new Fluid(SIZE, 0.1, 0, 0.00001);
}

void mouseDragged() {
  int dx = (mouseX - pmouseX) * 100;
  int dy = (mouseY - pmouseY) * 100;

  for (int x = mouseX - 1; x <= mouseX + 1; x++) {
    for (int y = mouseY - 1; y <= mouseY + 1; y++) {
      fluid.addDye(x, y, 128);
      fluid.addVelocity(x, y, dx, dy);
    }
  }
}

void draw() {
  //background(0);
  fluid.step();
  fluid.render();
}
