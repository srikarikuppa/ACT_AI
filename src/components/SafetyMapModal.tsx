import React, { useState } from 'react';
import { X, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Circle, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MOCK_INCIDENTS, MOCK_SAFE_ZONES, TimeOfDay } from '../data/safetyMapData';
import { SupportedLanguage } from '../types';

interface SafetyMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const SafetyMapModal: React.FC<SafetyMapModalProps> = ({ isOpen, onClose, language }) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('night');

  if (!isOpen) return null;

  // Filter incidents that are active during the selected time of day
  const activeIncidents = MOCK_INCIDENTS.filter(inc => inc.activeTimes.includes(timeOfDay));

  const times: { id: TimeOfDay; label: string }[] = [
    { id: 'morning', label: 'Morning (6AM - 12PM)' },
    { id: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
    { id: 'evening', label: 'Evening (5PM - 9PM)' },
    { id: 'night', label: 'Night (9PM - 6AM)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#0D1117] border border-gray-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-[#161B22]">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
              Dynamic Safety & Safe Zone Map
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Showing real-time safe zones and historical crime heatmaps for Varanasi.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          {/* Sidebar Controls */}
          <div className="w-full md:w-80 border-r border-gray-800 bg-[#0D1117] p-6 flex flex-col gap-8 overflow-y-auto">
            <div>
              <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-purple-400" />
                Time of Day Simulator
              </h3>
              <div className="space-y-3">
                {times.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTimeOfDay(t.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      timeOfDay === t.id 
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300' 
                        : 'bg-[#161B22] border-gray-800 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Map Legend</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500/50 border-2 border-blue-400" />
                  <span className="text-sm text-gray-300">Verified Safe Zones (Police, Hospitals, 24/7 Shelters)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500/30 border-2 border-red-500" />
                  <span className="text-sm text-gray-300">High-Risk Crime Heatmap (Varies by time)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative bg-gray-900">
            {/* The map container */}
            <MapContainer 
              center={[25.3176, 82.9739]} 
              zoom={14} 
              style={{ width: '100%', height: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />

              {/* Render Safe Zones */}
              {MOCK_SAFE_ZONES.map((zone) => (
                <CircleMarker
                  key={zone.id}
                  center={[zone.lat, zone.lng]}
                  radius={12}
                  pathOptions={{ 
                    color: '#3b82f6', 
                    fillColor: '#3b82f6', 
                    fillOpacity: 0.6,
                    weight: 2
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="font-bold text-gray-900">{zone.name}</div>
                    <div className="text-sm text-gray-600 capitalize">Type: {zone.type}</div>
                  </Popup>
                </CircleMarker>
              ))}

              {/* Render Heatmap Incidents */}
              {activeIncidents.map((incident) => (
                <Circle
                  key={incident.id}
                  center={[incident.lat, incident.lng]}
                  radius={400 * incident.intensity} // The radius grows based on intensity
                  pathOptions={{ 
                    color: '#ef4444', 
                    fillColor: '#ef4444', 
                    fillOpacity: incident.intensity * 0.5,
                    stroke: false
                  }}
                >
                  <Popup>
                    <div className="font-bold text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> High Risk Area
                    </div>
                    <div className="text-sm text-gray-700">{incident.description}</div>
                  </Popup>
                </Circle>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
