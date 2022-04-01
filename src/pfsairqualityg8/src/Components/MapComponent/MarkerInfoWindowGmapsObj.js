import React, { Component } from 'react';
import isEmpty from 'lodash.isempty';

// examples:
import GoogleMap from '../GoogleMap';

// consts: [34.0522, -118.2437]
// import LOS_ANGELES_CENTER from '../const/la_center';


const getInfoWindowString = (place) => `
    <div>
      <div style="font-size: 16px;">
        ${place.name}
      </div>

      <div style="font-size: 14px;">
        <span style="color: grey;">
        ${place.value} ${place.unit} ${place.scale}
        </span>
      </div>
    </div>`;

// Refer to https://github.com/google-map-react/google-map-react#use-google-maps-api
const handleApiLoaded = (map, maps, places) => {
  const markers = [];
  const infowindows = [];
  console.log(map, maps)
  console.log(places)
  places.forEach((place) => {
    console.log(Number(place.lat), typeof Math.floor(place.lat), Number(place.lon), typeof Math.floor(place.lon), place.name)
    markers.push(new maps.Marker({
      position: {
        lat: (Number(place.lat) + Math.floor(Math.random()*1)),// Math.floor(Math.random() * 100), // Math.floor(place.lat),
        lng: (Number(place.lon) + Math.floor(Math.random())),// Math.floor(Math.random() * 100),  // Math.floor(place.lon),
      },
      map,
    }));
    infowindows.push(new maps.InfoWindow({
      content: getInfoWindowString(place),
    }));
  });

  markers.forEach((marker, i) => {
    marker.addListener('click', () => {
      infowindows[i].open(map, marker);
    });
  });
};

class MarkerInfoWindowGmapsObj extends Component {
  constructor(props) {
    super(props);

    this.state = {
      places: [],
    };
  }

  componentDidMount() {
    fetch('https://api-220201.herokuapp.com/statistics')
      .then((response) => response.json())
      .then((data) => {
        console.log("fetch data =", data, typeof data)
        // data.forEach((result) => {
        //   result.show = false; // eslint-disable-line no-param-reassign
        // });
        this.setState({ places: data.data });
        console.log("this.state", this.state)
      });
  }

  render() {
    const { places } = this.state;
    const defaultProps = {
      center: {
        lat: 20.6764277,
        lng: -103.3496092
      },
      zoom: 4
    };
    return (
      <>
        {!isEmpty(places) && (
          <GoogleMap
            defaultZoom={8}
            defaultCenter={defaultProps.center}
            bootstrapURLKeys={{ key: "AIzaSyA92YogLOEY_i7LTMlZLTpSPCXM8mzw94Y" }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps, places)}
          />
        )}
      </>
    );
  }
}

export default MarkerInfoWindowGmapsObj;
