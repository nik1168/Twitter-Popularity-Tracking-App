import React from 'react';
import L from 'leaflet';

class MapNik extends React.Component {
    componentDidMount() {
        // create map
        this.map = L.map('map', {
            center: [33.858631, -118.279602],
            zoom: 7,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
            ]
        });
        // this.marker = L.marker(this.props.markerPosition).addTo(this.map);
    }

    render() {
        return <div id="map"></div>
    }
}

export default MapNik;
