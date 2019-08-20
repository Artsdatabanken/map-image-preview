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
  debugger;
  ctx.lineWidth = options.strokeWidth;
  ctx.antialias = options.antialias || "default";
  ctx.antialias = "none";
  ctx.globalCompositeOperation = "multiply";
  ctx.quality = "nearest";
  //  ctx.globalCompositeOperation = "multiply";
  const area = geometry.calculateArea(geojson.features);
  const ssArea = area * scaling.x.scale * scaling.y.scale;
  const coverageFraction = ssArea / height / width;
  ctx.lineWidth *= 0.1 * Math.pow(2.3, Math.log10(1 / coverageFraction));
  ctx.lineWidth = 0.5;
  geojson.features.forEach(feature => {
    ctx.fillStyle = lookupColor(
      meta,
      feature.properties,
      options.colorProperty
    );
    ctx.strokeStyle =
      options.strokeColor ||
      tinycolor(ctx.fillStyle)
        .darken(10)
        .toString();
    drawGeometries(ctx, feature, scaling);
  });

  return { buffer: canvas.toBuffer(), width, height };
}

function drawGeometries(ctx, feature, scaling) {
  feature.geometry &&
    feature.geometry.coordinates.forEach(coordinates =>
      drawGeometry(ctx, coordinates, scaling)
    );
}

function drawGeometry(ctx, coordinates, scaling) {
  if (Array.isArray(coordinates[0])) {
    coordinates.forEach(coord => {
      drawGeometry(ctx, coord, scaling);
      return;
    });
  }
  ctx.beginPath();
  coordinates.forEach(coordIn => {
    const x = (coordIn[0] + scaling.x.offset) * scaling.x.scale;
    const y = (scaling.y.offset - coordIn[1]) * scaling.y.scale;
    ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function lookupColor(meta, properties, colorProperty) {
  if (!properties) return meta.farge;
  if (!meta.barn) return meta.farge;
  let key = properties[colorProperty] || properties.code; //HACK
  if (!key) return meta.farge;
  key = key.replace("LA-", "-");
  key = key.replace("NA-", "-");
  for (var barn of meta.barn) {
    if (barn[colorProperty].indexOf(key) >= 0) return barn.farge;
  }
  return meta.farge;
}

module.exports = render;
