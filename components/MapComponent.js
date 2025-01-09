import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader} from '@react-google-maps/api';

const MapComponent = () => {
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: 'AIzaSyBoewLVHg2e9yXfVaAsesSg4DCVNNf0j3Y'
    });
    const center = { lat: 40.7128, lng: -74.0060 }; // Replace with your desired coordinates
    return (
        isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={center}
            zoom={10}
          >
            {/* This is going to be deprecated by AdvancedMarkerElement but there's currently no support for that component from
            @react-google-maps/api so I'm continuing to use Marker for now */}
            <Marker position={center} />
          </GoogleMap>
        )
      );
};

export default MapComponent;