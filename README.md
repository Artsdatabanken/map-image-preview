# Features

Reads vector format map polygons and renders into to a bitmap file

- Automatically detect minimal bounding box
  - Adjustable margin as a percentage
- Selectable colors
- Selectable outline stroke

# Usage

```
Usage: node map-image-preview <options> [mapfile]

mapfile    GeoJSON map source file for the preview

Options:
   -W  --width [0..]         Set the output image width in pixels
   -S  --strokeWidth [0.0..] Set the outline line width in pixels
   -SC --strokeColor #222    Set the outline color (hex code)
   -C  --color #f84          Set the fill color (hex code)
   -B  --bboxscale [0.0..]   Set the bounding box scaling factor, 1.1 = 10% margin
   -M  --meta [file.json]    Optional file containing map layer colors
   -CP --colorProperty [key] GeoJSON property to use for color lookup.  Metadata must have keys with same name.
```

## Example

```bash
node map-image-preview.js --width 600 --strokeColor "rgba(0,0,255,0.7)" \
  --color "#ff6" --strokeWidth 0.5 example/world.geojson
```

![Sample](doc/world_example.png)

## Arguments

### Color property

```
node map-image-preview.js --width 600 --colorProperty admin \
  --meta example/world.json example/world.geojson
```

![Scale 0.8](doc/world_colorprop_example.png)

### Scale factor

The default scale factor of 1 will fit the map data precisely inside the target raster.

#### Scale factor 80%

```bash
npx map-image-preview --bboxscale 0.8 --width 300 example/world.geojson
```

![Scale 0.8](doc/world_scale_0.8.png)

#### Scale factor 120%

```bash
npx map-image-preview --bboxscale 0.8 --width 300 example/world.geojson
```

![Scale 1.2](doc/world_scale_1.2.png)

### Metafile

Optionally a metadata json file can be used to specify colors to be used in the map. To use this the GeoJSON currently must have a property named "kode", matching with the "kode" value set in the accompanying `meta.json` file.

```bash
npx map-image-preview --meta meta.json example/world.geojson
```

#### Format

```json
{
  "barn": [
    { "kode": "water", "farge": "#00f" },
    { "kode": "land", "farge": "#0f0" }
  ]
}
```
