const minimist = require("minimist");
const pkg = require("./package");

function parse() {
  var argv = minimist(process.argv.slice(2), {
    stopEarly: true,
    alias: {
      B: "bboxscale",
      F: "fillColor",
      CP: "colorProperty",
      W: "width",
      L: "strokeWidth",
      X: "maxbounds",
      S: "strokeColor",
      M: "meta",
      O: "output"
    },
    default: {
      bboxscale: 1,
      fillColor: "#f44",
      colorProperty: "kode",
      width: 408,
      strokeWidth: 0.5
    }
  });
  if (argv._.length !== 1) {
    usage();
    process.exit(1);
  }
  return argv;
}

function usage() {
  console.log(pkg.name + " v" + pkg.version);
  console.log("");
  console.log("Usage: node map-image-preview <options> [mapfile]");
  console.log("");
  console.log("mapfile    GeoJSON map source file for the preview");
  console.log("");
  console.log("Options:");
  console.log(
    "   -W  --width [0..]         Set the output image width in pixels"
  );
  console.log(
    "   -S  --strokeWidth [0.0..] Set the outline line width in pixels"
  );
  console.log("   -SC --strokeColor #222    Set the outline color (hex code)");
  console.log("   -C  --color #f84          Set the fill color (hex code)");

  console.log(
    "   -B  --bboxscale [0.0..]   Set the bounding box scaling factor, 1.1 = 10% margin"
  );
  console.log(
    "   -M  --meta [file.json]    Optional file containing map layer colors"
  );
  console.log(
    "   -CP --colorProperty [key] GeoJSON property to use for color lookup.  Metadata must have keys with same name."
  );
  console.log(
    "   -O  --output [file]       Filename of output files, file extension will be added."
  );
  console.log(
    "   -X  --maxbounds {left:1,bottom:2,right:3,top:4}  The maximum bounds for limiting image extents."
  );
  console.log("");
}
module.exports = { parse };
