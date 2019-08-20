#! /usr/bin/env node
const fs = require("fs");
const path = require("path");
const draw = require("./draw");
const geometry = require("./geometry");
const commandLineArgs = require("./commandLineArgs");
const package = require("./package");

const args = commandLineArgs.parse();
console.log(package.name + " v" + package.version);

const meta = args.meta
  ? JSON.parse(fs.readFileSync(args.meta))
  : { farge: args.fillColor };

const geojsonFile = args._[0];
const geojson = JSON.parse(fs.readFileSync(geojsonFile));

let bbox = geometry.bbox(geojson);
if (args.maxbounds) bbox = geometry.limitBounds(bbox, args.maxbounds);

const options = {
  bounds: geometry.grow(bbox, args.bboxscale - 1),
  colorProperty: args.colorProperty,
  output: args.output || geojsonFile,
  stroke: args.stroke,
  strokeColor: args.strokeColor,
  strokeWidth: args.strokeWidth,
  width: args.width
};
console.log("bbox:    ", bbox);
console.log("bounds:  ", options.bounds);
console.log("bounds2: ", options.bounds);

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
