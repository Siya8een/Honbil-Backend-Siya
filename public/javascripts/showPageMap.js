mapboxgl.accessToken = mapToken;
console.log(campground);
const map = new mapboxgl.Map({
  container: "cluster-map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: campground.features.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
  projection: "globe", // displ ay the map as a 3D globe
});

map.addControl(new mapboxgl.NavigationControl());
map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});

new mapboxgl.Marker()
  .setLngLat(campground.features.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${campground.features.username}</h3> <p>${campground.features.email}</p>`
    )
  )
  .addTo(map);
