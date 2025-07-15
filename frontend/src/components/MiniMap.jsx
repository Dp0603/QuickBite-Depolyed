// src/components/MiniMap.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Optional custom rider icon
const riderIcon = new L.Icon({
  iconUrl: "/rider-icon.png", // Or remove this line to use default icon
  iconSize: [32, 32],
});

const MiniMap = ({ lat, lng, riderName }) => {
  if (!lat || !lng) return null;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "200px", borderRadius: "0.5rem" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={riderIcon}>
        <Popup>{riderName || "Delivery Agent"}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MiniMap;
