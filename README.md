# Features

Reads vector format map polygons and renders into to a bitmap file

- Automatically detect minimal bounding box
  - Adjustable margin as a percentage
- Selectable colors
- Selectable outline stroke

# Usage

## Example

```bash
npx map-image-preview map.geojson
```

## Arguments

### Scale factor

#### Scale factor 1.2

```bash
npx map-image-preview --bboxscale 0.8 example/world.geojson
```

![Scale 0.8](doc/world_scale_0.8.png)

#### Scale factor 1.2

```bash
npx map-image-preview --bboxscale 0.8 example/world.geojson
```

![Scale 1.2](doc/world_scale_1.2.png)
