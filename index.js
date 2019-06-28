#! /usr/bin/env node
const fs = require("fs");
const draw = require("./draw");
const geometry = require("./geometry");

const meta = JSON.parse(fs.readFileSync("metadata.json"));

const geojson = JSON.parse(fs.readFileSync("polygon.32633.geojson"));
const bbox = geometry.bbox(geojson);

const options = {
  width: 1000,
  lineWidth: 0,
  bounds: geometry.grow(bbox, 0.1)
};
const buffer = draw(geojson, meta, options);

fs.writeFileSync("thumbnail.png", buffer);
