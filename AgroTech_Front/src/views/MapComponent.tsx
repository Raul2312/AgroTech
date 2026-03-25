import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";

const mapStyles = {
  streets: "mapbox://styles/mapbox/streets-v12",
  satellite: "mapbox://styles/mapbox/satellite-v9",
  dark: "mapbox://styles/mapbox/dark-v11",
  light: "mapbox://styles/mapbox/light-v11",
  outdoors: "mapbox://styles/mapbox/outdoors-v12"
};

const MapComponent = ({ lat, lng }: any) => {

  const [style, setStyle] = useState(mapStyles.streets);

  const [viewState, setViewState] = useState({
    longitude: Number(lng),
    latitude: Number(lat),
    zoom: 14
  });

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>

      {/* 🔥 BOTONES DE ESTILO */}
      <div style={{
        position: "absolute",
        zIndex: 10,
        padding: "10px"
      }}>
        {Object.keys(mapStyles).map((key) => (
          <button
            key={key}
            onClick={() => setStyle(mapStyles[key as keyof typeof mapStyles])}
            style={{
              margin: "3px",
              padding: "6px 10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: "#16a34a",
              color: "#fff"
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={style}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
      >

        <Marker longitude={viewState.longitude} latitude={viewState.latitude}>
        </Marker>

      </Map>

    </div>
  );
};

export default MapComponent;