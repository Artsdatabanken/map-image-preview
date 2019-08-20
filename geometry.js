function limitBounds(bounds, maxboundsString) {
  const maxbounds = JSON.parse(maxboundsString);
  return {
    left: Math.max(bounds.left, maxbounds.left),
    right: Math.min(bounds.right, maxbounds.right),
    bottom: Math.max(bounds.bottom, maxbounds.bottom),
    top: Math.min(bounds.top, maxbounds.top)
  };
}

function bbox(geojson) {
  const bbox = { left: 9e9, bottom: 9e9, right: -9e9, top: -9e9 };
  geojson.features.forEach(feature => {
    if (!feature.geometry) return;
    bboxgeom(feature.geometry.coordinates, bbox);
  });
  return bbox;
}

function bboxgeom(coord, bbox) {
  if (Array.isArray(coord[0])) {
    coord.forEach(co2 => {
      bboxgeom(co2, bbox);
    });
  } else {
    bbox.left = Math.min(bbox.left, coord[0]);
    bbox.right = Math.max(bbox.right, coord[0]);
    bbox.bottom = Math.min(bbox.bottom, coord[1]);
    bbox.top = Math.max(bbox.top, coord[1]);
  }
  return bbox;
}

// Enlarge a bounding box by specified percentage
function grow(bbox, percentage) {
  const width = percentage * (bbox.right - bbox.left);
  const height = percentage * (bbox.top - bbox.bottom);
  const margin = Math.min(width, height) * 0.5;
  return {
    left: bbox.left - margin,
    bottom: bbox.bottom - margin,
    right: bbox.right + margin,
    top: bbox.top + margin
  };
}

function calculateHeightToMaintainAspect(width, bbox) {
  const height = Math.trunc(
    (width / (bbox.right - bbox.left)) * (bbox.top - bbox.bottom)
  );
  return height;
}

function polygonArea(polygon) {
  const numPoints = polygon.length;
  let area = 0;
  let prev = polygon[0];
  for (let i = 1; i <= numPoints; i++) {
    let cur = polygon[i % numPoints];
    area += (prev[0] + cur[0]) * (prev[1] - cur[1]);
    prev = cur;
  }
  return Math.abs(area / 2);
}

/**
 * Calculate area covered by geometry
 * Makes most sense to use on UTM coordinates - does not reproject coordinates
 * @return {number} Area in square meters (if input is UTM)
 */
function calculateArea(geojson) {
  if (geojson.features) return calculateArea(geojson.features);
  let area = 0;
  if (geojson[0].type === "Feature")
    geojson.forEach(
      feature => (area += calculateArea(feature.geometry.coordinates))
    );
  else if (Array.isArray(geojson[0][0]))
    geojson.forEach(geom => (area += calculateArea(geom)));
  else return polygonArea(geojson);
  return area;
}

module.exports = {
  bbox,
  calculateArea,
  grow,
  calculateHeightToMaintainAspect,
  limitBounds
};
