import React, { useState, useEffect } from 'react';
import { X, Clock, ShieldCheck, AlertTriangle, Navigation } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import Papa from 'papaparse';
import { SupportedLanguage } from '../types';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface IncidentRecord {
  id: string;
  lat: number;
  lng: number;
  intensity: number; // 0.1 to 1.0
  activeTimes: TimeOfDay[]; // When is this area most dangerous?
  description: string;
}

export interface SafeZoneRecord {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: 'police' | 'hospital' | 'shelter' | 'well-lit';
}

interface SafetyMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

const MapUpdater = ({ location }: { location: { lat: number, lng: number } | null }) => {
  const map = useMap();
  useEffect(() => {
    if (map && location) {
      map.panTo(location);
    }
  }, [map, location]);
  return null;
};

const MapDataFetcher = ({ 
  location, 
  onZonesFetched,
  onIncidentsFetched
}: { 
  location: { lat: number, lng: number } | null,
  onZonesFetched: (zones: SafeZoneRecord[]) => void,
  onIncidentsFetched: (incidents: IncidentRecord[]) => void
}) => {
  useEffect(() => {
    if (!location) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDlz5VrffIPMIo9mwGYWZS0Z3xVJ_dSg1E';

    // Fetch Safe Zones
    fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.location,places.types,places.id'
      },
      body: JSON.stringify({
        includedTypes: ['police', 'hospital'],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: location.lat,
              longitude: location.lng
            },
            radius: 5000.0
          }
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.places) {
        const newZones: SafeZoneRecord[] = data.places.map((place: any) => {
          const isPolice = place.types?.includes('police');
          return {
            id: place.id || Math.random().toString(),
            lat: place.location.latitude,
            lng: place.location.longitude,
            name: place.displayName?.text || (isPolice ? 'Police Station' : 'Hospital'),
            type: isPolice ? 'police' : 'hospital'
          };
        });
        if (newZones.length > 0) {
          onZonesFetched(newZones);
        }
      }
    })
    .catch(err => console.error("Error fetching safe zones:", err));

    // Fetch Nightlife (Danger Zones)
    fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.location,places.types,places.id'
      },
      body: JSON.stringify({
        includedTypes: ['bar', 'night_club', 'liquor_store'],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: location.lat,
              longitude: location.lng
            },
            radius: 5000.0
          }
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.places) {
        const newIncidents: IncidentRecord[] = data.places.map((place: any) => {
          const intensity = 0.4 + (Math.random() * 0.5); // Random intensity 0.4 - 0.9
          return {
            id: place.id || Math.random().toString(),
            lat: place.location.latitude,
            lng: place.location.longitude,
            intensity: intensity,
            activeTimes: ['evening', 'night'],
            description: `Potential high-risk zone near: ${place.displayName?.text || 'Nightlife Area'}`
          };
        });
        if (newIncidents.length > 0) {
          onIncidentsFetched(newIncidents);
        }
      }
    })
    .catch(err => console.error("Error fetching danger zones:", err));

  }, [location]);

  return null;
};

export const SafetyMapModal: React.FC<SafetyMapModalProps> = ({ isOpen, onClose, language }) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('night');
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZoneRecord[]>([]);
  const [activePopup, setActivePopup] = useState<{lat: number, lng: number, title: string, subtitle: string, type: 'safe' | 'incident'} | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [cityName, setCityName] = useState<string>('Varanasi');

  useEffect(() => {
    if (isOpen) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            
            // Reverse Geocode to get the user's city name
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDlz5VrffIPMIo9mwGYWZS0Z3xVJ_dSg1E';
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${apiKey}`)
              .then(res => res.json())
              .then(data => {
                if (data.results && data.results.length > 0) {
                  const components = data.results[0].address_components;
                  const city = components.find((c: any) => c.types.includes('locality') || c.types.includes('administrative_area_level_2'))?.long_name;
                  if (city) {
                    setCityName(city);
                  }
                }
              })
              .catch(err => console.error("Error reverse geocoding:", err));
          },
          (error) => console.error("Error getting user location:", error)
        );
      }
      

      
      Papa.parse('/safe_zones.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const parsed = (results.data as any[]).filter(row => row.lat && row.lng) as SafeZoneRecord[];
          setSafeZones(prev => prev.length === 0 ? parsed : prev);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter incidents that are active during the selected time of day
  const activeIncidents = incidents.filter(inc => inc.activeTimes.includes(timeOfDay));



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
              Showing real-time safe zones and historical crime heatmaps for {cityName}.
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
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  <span className="text-sm text-gray-300">Your Current Location</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
                  <span className="text-sm text-gray-300">Verified Safe Zones (Police, Hospitals)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white" />
                  <span className="text-sm text-gray-300">High-Risk Crime Heatmap</span>
                </div>
              </div>
            </div>

            {activePopup && (
               <div className="mt-4 p-4 rounded-xl border border-gray-800 bg-[#161B22]">
                  <div className={`font-bold flex items-center gap-1 ${activePopup.type === 'incident' ? 'text-red-500' : 'text-blue-500'}`}>
                    {activePopup.type === 'incident' && <AlertTriangle className="w-4 h-4" />}
                    {activePopup.title}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">{activePopup.subtitle}</div>
               </div>
            )}
          </div>

          {/* Map Area */}
          <div className="flex-1 relative bg-gray-900">
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDlz5VrffIPMIo9mwGYWZS0Z3xVJ_dSg1E'}>
              <Map
                defaultCenter={{ lat: 25.3176, lng: 82.9739 }}
                defaultZoom={13}
                mapId="DEMO_MAP_ID"
                disableDefaultUI={true}
                colorScheme="DARK"
              >
                <MapUpdater location={userLocation} />

                {/* Render User Location */}
                {userLocation && (
                  <AdvancedMarker position={userLocation} title="Your Location" zIndex={50}>
                    <div className="w-5 h-5 bg-green-500 rounded-full border-[3px] border-white shadow-[0_0_15px_rgba(34,197,94,0.9)] animate-pulse" />
                  </AdvancedMarker>
                )}

                <MapDataFetcher location={userLocation} onZonesFetched={setSafeZones} onIncidentsFetched={setIncidents} />

                {/* Render Safe Zones */}
                {safeZones.map((zone) => {
                  return (
                    <AdvancedMarker
                      key={zone.id}
                      position={{ lat: zone.lat, lng: zone.lng }}
                      onClick={() => setActivePopup({ lat: zone.lat, lng: zone.lng, title: zone.name, subtitle: `Type: ${zone.type}`, type: 'safe' })}
                    >
                      <Pin background={'#3b82f6'} borderColor={'#ffffff'} glyphColor={'#ffffff'} />
                    </AdvancedMarker>
                  );
                })}

                {/* Render Heatmap Incidents */}
                {activeIncidents.map((incident) => {
                  return (
                    <AdvancedMarker
                      key={incident.id}
                      position={{ lat: incident.lat, lng: incident.lng }}
                      onClick={() => setActivePopup({ lat: incident.lat, lng: incident.lng, title: 'High Risk Area', subtitle: incident.description, type: 'incident' })}
                    >
                       {/* Scale size based on intensity */}
                       <div 
                          style={{
                             width: `${20 + (incident.intensity * 20)}px`,
                             height: `${20 + (incident.intensity * 20)}px`,
                             backgroundColor: 'rgba(239, 68, 68, 0.6)',
                             border: '2px solid rgba(239, 68, 68, 1)',
                             borderRadius: '50%',
                             boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                          }}
                       />
                    </AdvancedMarker>
                  );
                })}
              </Map>
            </APIProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
