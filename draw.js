const { createCanvas } = require("canvas");

function render(geojson, meta, options = {}) {
  const width = parseInt(options.width) || 512;
  const height = parseInt(options.height) || 512;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const bounds = options.bounds;
  const scaling = {
    x: { offset: -bounds.left, scale: width / (bounds.right - bounds.left) },
    y: { offset: -bounds.bottom, scale: height / (bounds.top - bounds.bottom) }
  };
  ctx.lineWidth = 1;
  ctx.antialias = options.antialias || "default";
  if (options.stroke) ctx.strokeStyle = options.stroke;
  geojson.features.forEach(feature => {
    ctx.fillStyle = meta.farge;
    drawGeometries(ctx, options.stroke, feature, scaling);
  });

  return canvas.toBuffer();
}

function drawGeometries(ctx, stroke, feature, scaling) {
  feature.geometry.coordinates.forEach(coordinates =>
    drawGeometry(ctx, feature.properties, stroke, coordinates, scaling)
  );
}

function drawGeometry(ctx, props, stroke, coordinates, scaling) {
  ctx.beginPath();
  coordinates.forEach(coordIn => {
    const x = (coordIn[0] + scaling.x.offset) * scaling.x.scale;
    const y = (coordIn[1] + scaling.y.offset) * scaling.y.scale;
    ctx.lineTo(x, y);
  });

  if (stroke) {
    ctx.stroke();
  }
  ctx.fill();
}

module.exports = render;
