import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import {circular} from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';
import {Circle, Fill, Stroke, Style} from 'ol/style';


const source = new VectorSource();
const layer = new VectorLayer({
  source: source,

  style: new Style({

    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.1)'
    }),
    stroke: new Stroke({
      color: '#3333ff',
      width: 4
    }),
    image: new Circle({
      radius: 8,
      fill: new Fill({
        color: '#3333ff'
      })
    })
  })
});

let map = new Map({
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    layer,
  ],

  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

navigator.geolocation.watchPosition(function(pos) {
  let coords = [pos.coords.longitude, pos.coords.latitude];
  let accuracy = circular(coords, pos.coords.accuracy);
  source.clear(true);
  source.addFeatures([
    new Feature(accuracy.transform('EPSG:4326', map.getView().getProjection())),
    new Feature(new Point(fromLonLat(coords)))
  ]);
}, function(error) {
  alert(`ERROR: ${error.message}`);
}, {
  enableHighAccuracy: true
});

document.getElementById('coordForm').addEventListener('submit', function (event) {
  event.preventDefault();
  let lat = document.getElementsByName('Latitude')[0].value;

  if(lat > 90) lat = 90;
  if(lat < -90) lat = -90;

  let long = document.getElementsByName('Longtitude')[0].value;

   if(long > 180) long = 180;
  if(long < -180) long = -180;

  let coords = [long, lat];
  document.getElementsByName('Latitude')[0].value = '';
  document.getElementsByName('Longtitude')[0].value = '';
  source.addFeatures([
    new Feature(new Point(fromLonLat(coords)))
  ]);
});




