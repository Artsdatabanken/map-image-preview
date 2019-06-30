#! /usr/bin/env node
const fs = require("fs");
const draw = require("./draw");
const geometry = require("./geometry");
const args = require("./args");

const argv = args.parse();
const meta = argv.meta
  ? JSON.parse(fs.readFileSync(metajsonFile))
  : { farge: argv.color };

const geojsonFile = argv._[0];
const geojson = JSON.parse(fs.readFileSync(geojsonFile));
const bbox = geometry.bbox(geojson);

const options = {
  width: argv.width,
  stroke: argv.stroke,
  bounds: geometry.grow(bbox, argv.bboxscale)
};
const render = draw(geojson, meta, options);
const { width, height } = render;

const bb = options.bounds;
const bbs = bb.left + "," + bb.bottom + "," + bb.right + "," + bb.top;
const wms = `wget -q https://openwms.statkart.no/skwms1/wms.topo4.graatone?request=GetMap&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&BBOX=${bbs}&SRS=EPSG:32633&WIDTH=${width}&HEIGHT=${height}&LAYERS=topo4graatone_WMS&STYLES=&FORMAT=image/png&DPI=96&MAP_RESOLUTION=96&FORMAT_OPTIONS=dpi:96&TRANSPARENT=TRUE -O ${process.cwd()}/topo4.png`;

const summary = {
  bbox: options.bounds,
  image: { width, height },
  color: meta.farge,
  stroke: argv.stroke,
  crs: geojson.crs && geojson.crs.properties && geojson.crs.properties.name
};
console.log(wms);
console.log(summary);

fs.writeFileSync("thumbnail.png", render.buffer);
