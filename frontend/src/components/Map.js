import React from 'react';
import L from 'leaflet';
import {identity} from "rxjs";
import * as Rx from 'rx-dom';

class MapNik extends React.Component {

    identity = identity;


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
        this.codeLayers = {};
        this.tweetsLayer =  L.layerGroup([]).addTo(this.map);
        this.updateCircles(this.props.data);
    }

    componentDidUpdate({data}) {
        console.log("Component did update map");
        console.log("this.props.data.length: ", this.props.data.length);
        console.log("data: ", data.length);
        // check if position has changed
        this.updateCircles(this.props.data);
        // TODO: Implement hover with observables and lets finish this
        // this.marker.setLatLng(this.props.markerPosition);

    }

    updateCircles(circles) {
        console.log("Update circles!!!");
        this.layer.clearLayers();
        const self = this
        circles.forEach(tweet => {
            const {coordinates} = tweet.coordinates;
            const circle = L.circle([coordinates[1], coordinates[0]],  {radius: 800}).addTo(this.layer);
            const mark = L.marker([coordinates[1], coordinates[0]]).addTo(this.layer);
            this.tweetsLayer.addLayer(circle);
            this.codeLayers[tweet.id] = this.tweetsLayer.getLayerId(circle);
            const element = document.getElementById(tweet.id);
            console.log("ELement");
            console.log(element);
            this.isHovering(element).subscribe(function(hovering) {
                console.log("Is hovering???");
                console.log(hovering);
                element.style.cursor = hovering? 'pointer' : 'default';
                circle.setStyle({ color: hovering ? '#ff0000' : '#0000ff' });
                // mark.setStyle({color: hovering ? '#ff0000' : '#0000ff' });
            });
            Rx.DOM.click(element).subscribe(function() { self.map.panTo(circle.getLatLng(),5);
            });
        });
    }

    isHovering(element) {
        const over = Rx.DOM.mouseover(element).map(identity(true)); // Observable that emits true whenever the user hovers over the element
        const out = Rx.DOM.mouseout(element).map(identity(false)); // Observable that emits false whenever the user hovers over the element
        return over.merge(out); // Merges both over and out, returning an observable that emits true when the mouse is over an element, and false when it leaves it.
    }

    render() {

        return <div id="map"></div>
    }
}

export default MapNik;
