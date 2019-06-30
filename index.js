#! /usr/bin/env node
const fs = require("fs");
const draw = require("./draw");
const geometry = require("./geometry");
const minimist = require("minimist");

var argv = minimist(process.argv.slice(2), {
  stopEarly: true,
  alias: { B: "bboxscale", C: "color", W: "width", S: "stroke", M: "meta" },
  default: { bboxscale: 1, color: "#f44", width: 408, stroke: 0.5 }
});
if (argv._.length !== 1) {
  console.log("Usage: node map-image-preview <options> [mapfile]");
  console.log("");
  console.log("mapfile    GeoJSON map source file for the preview");
  console.log("");
  console.log("Options:");
  console.log(
    "   -W --width [0..]          Set the output image width in pixels"
  );
  console.log(
    "   -S --stroke [0.0..]      Set the outline line width in pixels"
  );

  console.log(
    "   -B --bboxscale [0.0..]    Set the bounding box scaling factor, 1.1 = 10% margin"
  );
  console.log(
    "   -M --meta [file.json]     Optional file containing map layer colors"
  );
  console.log("");
  process.exit(1);
}
console.log(argv);

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

const summary = { bbox: options.bounds, image: { width, height } };
console.log(wms);
console.log(summary);

fs.writeFileSync("thumbnail.png", render.buffer);
