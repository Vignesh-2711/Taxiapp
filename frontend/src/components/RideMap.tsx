import 'mapbox-gl/dist/mapbox-gl.css';
import { Map, NavigationControl } from 'react-map-gl';

export default function RideMap() {
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden shadow">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{ longitude: -97.7431, latitude: 30.2672, zoom: 10 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <NavigationControl position="bottom-right" />
      </Map>
    </div>
  );
}