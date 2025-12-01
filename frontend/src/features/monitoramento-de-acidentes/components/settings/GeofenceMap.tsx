import React, { useRef, useEffect } from 'react';
import { GoogleMap, Circle, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';

interface GeofenceMapProps {
  centerLat: number;
  centerLon: number;
  radiusMeters: number;
  onLocationSelect: (lat: number, lon: number) => void;
  onAddressSelect?: (lat: number, lon: number) => void;
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

export const GeofenceMap: React.FC<GeofenceMapProps> = ({
  centerLat,
  centerLon,
  radiusMeters,
  onLocationSelect,
  onAddressSelect,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  if (!isLoaded) return <div>Carregando mapa...</div>;

  const center = { lat: centerLat, lng: centerLon };

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onClick={(e) => {
          onLocationSelect(e.latLng?.lat() || 0, e.latLng?.lng() || 0);
        }}
        onLoad={(map) => (mapRef.current = map)}
      >
        <Marker position={center} />
        <Circle center={center} radius={radiusMeters} options={{ fillColor: '#3178c8', fillOpacity: 0.2, strokeColor: '#3178c8' }} />
      </GoogleMap>
    </div>
  );
};
