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

// Centered around Varanasi (25.3176, 82.9739)
export const MOCK_INCIDENTS: IncidentRecord[] = [
  // High risk at night
  { id: 'i1', lat: 25.3200, lng: 82.9800, intensity: 0.8, activeTimes: ['evening', 'night'], description: 'History of muggings' },
  { id: 'i2', lat: 25.3150, lng: 82.9700, intensity: 0.9, activeTimes: ['night'], description: 'Unlit alleyways' },
  { id: 'i3', lat: 25.3110, lng: 82.9750, intensity: 0.7, activeTimes: ['evening', 'night'], description: 'Suspicious activities reported' },
  
  // Moderate risk during day
  { id: 'i4', lat: 25.3250, lng: 82.9650, intensity: 0.5, activeTimes: ['afternoon', 'evening'], description: 'Pickpocketing in crowded market' },
  { id: 'i5', lat: 25.3080, lng: 82.9850, intensity: 0.4, activeTimes: ['morning', 'afternoon'], description: 'Traffic hazard / unruly crowds' },
  
  // Constant risk (e.g. known dangerous intersection)
  { id: 'i6', lat: 25.3220, lng: 82.9900, intensity: 0.6, activeTimes: ['morning', 'afternoon', 'evening', 'night'], description: 'Known hotspot' },
];

export const MOCK_SAFE_ZONES: SafeZoneRecord[] = [
  { id: 's1', lat: 25.3180, lng: 82.9710, name: 'Cantonment Police Station', type: 'police' },
  { id: 's2', lat: 25.3100, lng: 82.9800, name: 'Heritage Hospital', type: 'hospital' },
  { id: 's3', lat: 25.3250, lng: 82.9750, name: 'Women\'s Shelter (24/7)', type: 'shelter' },
  { id: 's4', lat: 25.3140, lng: 82.9880, name: 'Main Square (Well-lit, CCTV)', type: 'well-lit' },
  { id: 's5', lat: 25.3300, lng: 82.9700, name: 'Traffic Police Checkpoint', type: 'police' },
];
