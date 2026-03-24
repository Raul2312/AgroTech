import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";

const cows = [
  { id: 1, lat: 30.377750, lng: -107.910, name: "Vaca 0427" },
  { id: 2, lat: 30.415, lng: -107.915, name: "Vaca 0478" },
  { id: 3, lat: 30.422, lng: -107.905, name: "Vaca 0856" },
];

const MapComponent = () => {

  const [selectedCow, setSelectedCow] = useState<any>(null);

  return (
    <Map
      initialViewState={{
        longitude: -107.795611,
        latitude: 30.377750,
        zoom: 14
      }}
      // -107.795611
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
    >

      {/* 🐄 MARCADORES */}
      {cows.map((cow) => (
        <Marker
          key={cow.id}
          longitude={cow.lng}
          latitude={cow.lat}
          anchor="bottom"
        >
          <div
            style={{ cursor: "pointer", fontSize: "24px" }}
            onClick={() => setSelectedCow(cow)}
          >
            🐄
          </div>
        </Marker>
      ))}

      {/* 🔥 POPUP */}
      {selectedCow && (
        <Popup
          longitude={selectedCow.lng}
          latitude={selectedCow.lat}
          onClose={() => setSelectedCow(null)}
        >
          <strong>{selectedCow.name}</strong>
          <p>Estado: Activa 🟢</p>
        </Popup>
      )}

    </Map>
  );
};

export default MapComponent;