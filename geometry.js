function bbox(geojson) {
  const bbox = { left: 9e9, bottom: 9e9, right: -9e9, top: -9e9 };
  geojson.features.forEach(feature => {
    feature.geometry.coordinates.forEach(coordinates => {
      coordinates.forEach(coord => {
        bbox.left = Math.min(bbox.left, coord[0]);
        bbox.right = Math.max(bbox.right, coord[0]);
        bbox.bottom = Math.min(bbox.bottom, coord[1]);
        bbox.top = Math.max(bbox.top, coord[1]);
      });
    });
  });
  return bbox;
}

// Enlarge a bounding box by specified percentage
function grow(bbox, percentage) {
  const width = percentage * (bbox.right - bbox.left);
  const height = percentage * (bbox.top - bbox.bottom);
  return {
    left: bbox.left - width,
    bottom: bbox.bottom - height,
    right: bbox.right + width,
    top: bbox.top + height
  };
}

function calculateHeightToMaintainAspect(width, bbox) {
  const height = Math.trunc(
    (width / (bbox.right - bbox.left)) * (bbox.top - bbox.bottom)
  );
  return height;
}

module.exports = { bbox, grow, calculateHeightToMaintainAspect };
