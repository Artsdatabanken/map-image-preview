#! /usr/bin/env node
const fs = require("fs");
const draw = require("./draw");
const geometry = require("./geometry");
const commandLineArgs = require("./commandLineArgs");

const args = commandLineArgs.parse();

const meta = args.meta
  ? JSON.parse(fs.readFileSync(args.meta))
  : { farge: args.color };

const geojsonFile = args._[0];
const geojson = JSON.parse(fs.readFileSync(geojsonFile));
const bbox = geometry.bbox(geojson);

const options = {
  bounds: geometry.grow(bbox, args.bboxscale - 1),
  colorProperty: args.colorProperty,
  stroke: args.stroke,
  strokeColor: args.strokeColor,
  strokeWidth: args.strokeWidth,
  width: args.width
};
const render = draw(geojson, meta, options);
const { width, height } = render;

const summary = {
  bbox: options.bounds,
  image: { width, height },
  color: meta.farge,
  strokeColor: options.strokeColor,
  strokeWidth: args.stroke,
  crs: geojson.crs && geojson.crs.properties && geojson.crs.properties.name
};

fs.writeFileSync("thumbnail.json", JSON.stringify(summary));
fs.writeFileSync("thumbnail.png", render.buffer);
