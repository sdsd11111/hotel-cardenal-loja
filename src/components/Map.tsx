'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Hotel Cardenal Coordinates (Exact for Gladiolos 154-42, Loja, Ecuador)
const position: [number, number] = [-4.0196126, -79.2019715];

// Custom Circular Logo Marker
const customIcon = typeof window !== 'undefined' ? L.divIcon({
    className: 'custom-marker',
    html: `
    <div style="display: flex; flex-direction: column; align-items: center; background: transparent; border: none; padding: 0;">
      <div style="width: 70px; height: 70px; background: white; border-radius: 50% !important; padding: 6px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2); border: 4px solid #c4a484; display: flex; align-items: center; justify-content: center; overflow: hidden !important;">
        <img 
          src="/logo.png" 
          alt="Hotel El Cardenal" 
          style="width: 100%; height: 100%; object-fit: contain; border-radius: 50% !important; display: block;"
        />
      </div>
      <!-- Pin Triangle -->
      <div style="width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 15px solid #c4a484; margin-top: -3px; z-index: 10;"></div>
    </div>
  `,
    iconSize: [80, 95],
    iconAnchor: [40, 92], // Anchor at the very bottom tip
}) : null;

export default function Map() {
    return (
        <div className="w-full h-full min-h-[400px] relative z-0">
            <MapContainer
                center={position}
                zoom={16}
                scrollWheelZoom={true}
                className="w-full h-full absolute inset-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {customIcon && (
                    <Marker position={position} icon={customIcon}>
                        <Popup>
                            <div className="text-center p-1">
                                <p className="font-bold text-cardenal-green font-serif m-0">Hotel El Cardenal</p>
                                <p className="text-[10px] m-0 text-gray-600">Gladiolos 154-42, Loja, Ecuador</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
