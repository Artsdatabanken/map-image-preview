const geometry = require("./geometry");
const { createCanvas } = require("canvas");
const tinycolor = require("tinycolor2");

function render(geojson, meta, options = {}) {
  const bounds = options.bounds;
  const width = parseInt(options.width) || 512;
  const height =
    parseInt(options.height) ||
    geometry.calculateHeightToMaintainAspect(width, bounds);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const scaling = {
    x: { offset: -bounds.left, scale: width / (bounds.right - bounds.left) },
    y: { offset: bounds.top, scale: height / (bounds.top - bounds.bottom) }
  };
  ctx.lineWidth = options.lineWidth;
  ctx.antialias = options.antialias || "default";

  geojson.features.forEach(feature => {
    ctx.fillStyle = meta.farge;
    ctx.strokeStyle =
      options.stroke ||
      tinycolor(meta.farge)
        .darken(40)
        .toString();
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
    const y = (scaling.y.offset - coordIn[1]) * scaling.y.scale;
    ctx.lineTo(x, y);
  });

  ctx.fill();
  ctx.stroke();
}

module.exports = render;
