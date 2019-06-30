const minimist = require("minimist");

function parse() {
  var argv = minimist(process.argv.slice(2), {
    stopEarly: true,
    alias: { B: "bboxscale", C: "color", W: "width", S: "stroke", M: "meta" },
    default: { bboxscale: 1, color: "#f44", width: 408, stroke: 0.5 }
  });
  if (argv._.length !== 1) {
    usage();
    process.exit(1);
  }
  console.log(argv);
  return argv;
}

function usage() {
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
}
module.exports = { parse };
