export default function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  document.body.appendChild(canvas);

  return {
    canvas, context,
    resize: function () {
      const dpr = window.devicePixelRatio || 1;
      const windowWidth = innerWidth * dpr;
      const windowHeight = innerHeight * dpr;

      if (canvas.width != windowWidth || canvas.height != windowHeight) {
        canvas.width = windowWidth;
        canvas.height = windowHeight;

        const sx = canvas.width / width;
        const sy = canvas.height / height;

        if (sx < sy) {
          context.scale(sx, sx);
          context.translate(0, (windowHeight / sx - height) / 2);
        } else {
          context.scale(sy, sy);
          context.translate((windowWidth / sy - width) / 2, 0);
        }
      }
    }
  };
}