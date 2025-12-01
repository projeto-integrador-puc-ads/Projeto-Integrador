import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { GoogleMap, LoadScript, Circle, Marker, Autocomplete } from '@react-google-maps/api';

interface GeofenceMapProps {
  centerLat: number;
  centerLon: number;
  radiusMeters: number;
  onChange: (lat: number, lon: number, radius: number) => void;
}

export const GeofenceMap: React.FC<GeofenceMapProps> = ({
  centerLat,
  centerLon,
  radiusMeters,
  onChange,
}) => {
  const [lat, setLat] = useState(centerLat);
  const [lon, setLon] = useState(centerLon);
  const [radius, setRadius] = useState(radiusMeters);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    setLat(centerLat);
    setLon(centerLon);
    setRadius(radiusMeters);
  }, [centerLat, centerLon, radiusMeters]);

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const loc = place.geometry.location;
        setLat(loc.lat());
        setLon(loc.lng());
        onChange(loc.lat(), loc.lng(), radius);
      }
    }
  };

  const handleMarkerDrag = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLat = e.latLng.lat();
      const newLon = e.latLng.lng();
      setLat(newLat);
      setLon(newLon);
      onChange(newLat, newLon, radius);
    }
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = +e.target.value;
    setRadius(newRadius);
    onChange(lat, lon, newRadius);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceChanged}>
          <TextField label="Pesquisar endereço" fullWidth />
        </Autocomplete>
        <TextField
          label="Latitude"
          value={lat}
          InputProps={{ readOnly: true }}
          style={{ width: '120px' }}
        />
        <TextField
          label="Longitude"
          value={lon}
          InputProps={{ readOnly: true }}
          style={{ width: '120px' }}
        />
        <TextField
          label="Raio (metros)"
          type="number"
          value={radius}
          onChange={handleRadiusChange}
          style={{ width: '150px' }}
        />
      </div>

      <LoadScript googleMapsApiKey={import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <GoogleMap
          mapContainerStyle={{ height: '400px', width: '100%' }}
          center={{ lat, lng: lon }}
          zoom={14}
          onLoad={(map) => (mapRef.current = map)}
        >
          <Marker position={{ lat, lng: lon }} draggable onDragEnd={handleMarkerDrag} />
          <Circle center={{ lat, lng: lon }} radius={radius} options={{ fillOpacity: 0.2, fillColor: '#3178c8', strokeColor: '#3178c8' }} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};
