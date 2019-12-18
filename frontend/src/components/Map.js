import React from 'react';
import L from 'leaflet';

class MapNik extends React.Component {

    componentDidMount() {
        console.log("Component did mount map")

        // create map
        this.map = L.map('map', {
            center: [33.858631, -118.279602],
            zoom: 2,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
            ]
        });
        // this.marker = L.marker(this.props.markerPosition).addTo(this.map);
        this.layer = L.layerGroup().addTo(this.map);
        this.updateCircles(this.props.data);
    }

    componentDidUpdate({data}) {
        console.log("Component did update map");
        console.log("this.props.data.length: ", this.props.data.length);
        console.log("data: ", data.length);
        // check if position has changed
        this.updateCircles(this.props.data);
        // this.marker.setLatLng(this.props.markerPosition);

    }

    updateCircles(circles) {
        console.log("Update circles!!!")
        this.layer.clearLayers();
        circles.forEach(marker => {
            L.circle([marker[0], marker[1]],  {radius: marker[2]}).addTo(this.layer);
            L.marker([marker[0], marker[1]]).addTo(this.layer);
        });
    }

    render() {
        return <div id="map"></div>
    }
}

export default MapNik;
