'use client';
import Script from "next/script";



// Tipado opcional para window.iniciarMap:
declare global {
  interface Window {
    iniciarMap: () => void;
  }
}

export default function Mapa() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Mapa (Google Maps)</h2>

      {/* Contenedor igual que en tu index.html */}
      <div id="map" style={{
        height: 500,       // mismo estilo que estilo.css
        width: "60%",      // puedes cambiarlo a 100% si gustas
        borderRadius: 12
      }} />

      {/* Tu función iniciarMap del script.js */}
      <Script id="init-callback" strategy="afterInteractive">
        {`
          window.iniciarMap = function () {
            var coord = { lat: 20.2792, lng: -97.9614 };
            var map = new google.maps.Map(document.getElementById('map'), {
              zoom: 10,
              center: coord
            });
            new google.maps.Marker({
              position: coord,
              map: map
            });
          };
        `}
      </Script>

      {/* Carga de la API: igual que tu index.html pero con env var */}
      <Script
        src={
          "https://maps.googleapis.com/maps/api/js?key="
          + (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "")
          + "&v=weekly&callback=iniciarMap"
        }
        strategy="afterInteractive"
      />
    </div>
  );
}
