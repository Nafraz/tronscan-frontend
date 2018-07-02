/* eslint-disable no-undef */
import React, {Component} from 'react';
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "leaflet/dist/leaflet-src.js";
import "leaflet.markercluster/dist/leaflet.markercluster-src.js";
import "leaflet-echarts/src/leaflet-echarts.js";
import "leaflet-echarts/lib/echarts.source.js";
import config from '../../common/chart.config.js'

export default class NodeMap extends Component {

  componentDidMount() {
    let {nodes} = this.props;
    let points = [];
    let geoCoord = {};
    let data = [];
    config.mapChart.series[0].geoCoord = {};
    config.mapChart.series[1].markPoint.data = [];
    for (let node in nodes) {
      /*  if(nodes[node].city!=='') {
          points.push([nodes[node].lat,nodes[node].lng,node]);
          geoCoord[nodes[node].city] = [nodes[node].lng, nodes[node].lat];
          data.push({name: nodes[node].city, ip: nodes[node].ip});
        }
      */
      points.push([nodes[node].lat, nodes[node].lng, nodes[node].ip]);
      geoCoord[nodes[node].ip] = [nodes[node].lng, nodes[node].lat];
      data.push({name: nodes[node].ip, ip: nodes[node].ip});

    }
    console.log(points);
    console.log(geoCoord);
    console.log(data);
    var addressPoints = points;
    var map = L.map(this.$ref);
    var baseLayers = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemtsaSIsImEiOiJjamhzbjFiZWYwNG9mM3ZwM3BpM2xudjBpIn0.BeVbGjUROg5szZiCmYZfnQ',
        {
          maxZoom: 18,
          minZoom: 2
        }).addTo(map);


    map.setView(L.latLng(0, 13.114129), 1);
    var markers = L.markerClusterGroup();

    for (var i = 0; i < addressPoints.length; i++) {
      var a = addressPoints[i];
      var title = a[2];
      var marker = L.marker(new L.LatLng(a[0], a[1]), {title: title});
      marker.bindPopup(title);
      markers.addLayer(marker);
    }

    map.addLayer(markers);

    var overlay = new L.echartsLayer(map, echarts);
    var chartsContainer = overlay.getEchartsContainer();
    var myChart = overlay.initECharts(chartsContainer);
    window.onresize = myChart.onresize;

    config.mapChart.series[0].geoCoord = geoCoord;
    config.mapChart.series[1].markPoint.data = data;
    console.log(config.mapChart);
    overlay.setOption(config.mapChart);

  }

  componentDidUpdate() {

  }

  render() {

    let {className} = this.props;

    return (
        <div
            style={{height: 600}}
            className={className + " map-2d"}
            ref={(cmp) => this.$ref = cmp}/>
    )
  }
}
