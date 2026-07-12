import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom divIcon built from inline SVG so we never depend on Leaflet's
// default marker image assets (which break under Vite bundling).
const hospitalIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:38px;height:38px;border-radius:9999px;
      background:linear-gradient(135deg,#10B981,#06B6D4);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 8px 24px rgba(16,185,129,0.45);
      border:3px solid white;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L3 7v13h6v-6h6v6h6V7z"></path>
        <path d="M12 11v4M10 13h4"></path>
      </svg>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -20],
});

export default function MapEmbed({
  lat = 12.3072,
  lng = 76.6425,
  name = "Quantum Hospital",
  address = "4th Cross, Kadri Hills, Mangaluru, Karnataka 575002",
  className = "",
}) {
  return (
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", minHeight: "260px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={[lat, lng]}
          radius={450}
          pathOptions={{ color: "#10B981", fillColor: "#10B981", fillOpacity: 0.08, weight: 1 }}
        />
        <Marker position={[lat, lng]} icon={hospitalIcon}>
          <Popup>
            <strong>{name}</strong>
            <br />
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
