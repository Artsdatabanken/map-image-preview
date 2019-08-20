#! /usr/bin/env node
const fs = require("fs");
const path = require("path");
const draw = require("./draw");
const geometry = require("./geometry");
const commandLineArgs = require("./commandLineArgs");

const args = commandLineArgs.parse();

const meta = args.meta
  ? JSON.parse(fs.readFileSync(args.meta))
  : { farge: args.fillColor };

const geojsonFile = args._[0];
const geojson = JSON.parse(fs.readFileSync(geojsonFile));
const bbox = geometry.bbox(geojson);

const options = {
  bounds: geometry.grow(bbox, args.bboxscale - 1),
  colorProperty: args.colorProperty,
  output: args.output || geojsonFile,
  stroke: args.stroke,
  strokeColor: args.strokeColor,
  strokeWidth: args.strokeWidth,
  width: args.width
};
if (args.maxbounds)
  options.bounds = geometry.limitBounds(options.bounds, args.maxbounds);
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

const parsed = path.parse(options.output);
const basename = path.join(parsed.dir, parsed.name);
fs.writeFileSync(basename + ".json", JSON.stringify(summary));
fs.writeFileSync(basename + ".png", render.buffer);
