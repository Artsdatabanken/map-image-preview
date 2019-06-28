const fs = require("fs");
const draw = require("./draw");
const geometry = require("./geometry");

const meta = JSON.parse(fs.readFileSync("metadata.json"));
const geojson = JSON.parse(fs.readFileSync("polygon.32633.geojson"));

const bbox = geometry.bbox(geojson);
const grown = geometry.grow(bbox, 0.1);

const options = {
  width: 1000,
  height: 1000,
  stroke: "#4499ff",
  bounds: grown
};
const buffer = draw(geojson, meta, options);

fs.writeFileSync("preview.png", buffer);
