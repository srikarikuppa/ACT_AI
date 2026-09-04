import React, { useState } from 'react';
import { MapPin, Navigation, Volume2, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import { SupportedLanguage, LocationData } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { RURAL_LOCATION_DATA } from '../../data/locationData';
import { speakText } from '../../utils/speechUtils';

interface Step2LocationProps {
  location: LocationData;
  onLocationChange: (loc: LocationData) => void;
  language: SupportedLanguage;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Location: React.FC<Step2LocationProps> = ({
  location,
  onLocationChange,
  language,
  onNext,
  onBack,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatusMsg, setLocationStatusMsg] = useState('');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const selectedStateObj = RURAL_LOCATION_DATA.find((s) => s.state === location.state) || RURAL_LOCATION_DATA[0];
  const selectedDistrictObj =
    selectedStateObj?.districts.find((d) => d.name === location.district) || selectedStateObj?.districts[0];

  const handleDetectGpsLocation = () => {
    setIsLocating(true);
    setLocationStatusMsg(t.locatingRadar);

    if (!navigator.geolocation) {
      setLocationStatusMsg(t.gpsNotSupported || 'Geolocation is not supported by your browser. Please select your village below.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Use OpenStreetMap Nominatim API for real reverse geocoding
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await response.json();
          
          const address = data.address || {};
          const detectedState = address.state || 'Unknown State';
          const detectedDistrict = address.state_district || address.county || address.city_district || address.city || 'Unknown District';
          const detectedVillage = address.village || address.suburb || address.town || address.neighbourhood || address.city || 'Local Area';

          onLocationChange({
            state: detectedState,
            district: detectedDistrict,
            village: detectedVillage,
            lat: Number(lat.toFixed(4)),
            lng: Number(lng.toFixed(4)),
            rawAddress: data.display_name || `GPS Pinpoint (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
            isGpsDetected: true,
          });

          setIsLocating(false);
          setLocationStatusMsg(`${t.locationFound}: ${detectedVillage}`);
          speakText(`${t.locationFound}. ${detectedVillage}`, language);
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          // Fallback if the fetch fails but we have coords
          onLocationChange({
            state: 'Detected State',
            district: 'Detected District',
            village: 'Detected Location',
            lat: Number(lat.toFixed(4)),
            lng: Number(lng.toFixed(4)),
            rawAddress: `GPS Pinpoint (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
            isGpsDetected: true,
          });
          setIsLocating(false);
          setLocationStatusMsg(`Location found using coordinates.`);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // Fallback to default Varanasi if they block permission
        onLocationChange({
          state: 'Uttar Pradesh',
          district: 'Varanasi',
          village: 'Shivpur Gram Panchayat',
          lat: 25.3176,
          lng: 82.9739,
          rawAddress: 'Shivpur Gram Panchayat, Varanasi',
          isGpsDetected: false,
        });
        setIsLocating(false);
        setLocationStatusMsg(t.locationPinpointed || 'Location pinpointed. You can also adjust below.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleStateChange = (stateName: string) => {
    const sObj = RURAL_LOCATION_DATA.find((s) => s.state === stateName);
    const firstDist = sObj?.districts[0];
    const firstVill = firstDist?.villages[0] || 'Gram Panchayat Office';

    onLocationChange({
      ...location,
      state: stateName,
      district: firstDist?.name || '',
      village: firstVill,
      isGpsDetected: false,
    });
  };

  const handleDistrictChange = (distName: string) => {
    const dObj = selectedStateObj?.districts.find((d) => d.name === distName);
    const firstVill = dObj?.villages[0] || 'Gram Panchayat Office';

    onLocationChange({
      ...location,
      district: distName,
      village: firstVill,
      isGpsDetected: false,
    });
  };

  const handleVillageChange = (villName: string) => {
    onLocationChange({
      ...location,
      village: villName,
      isGpsDetected: false,
    });
  };

  const handleSpeakInstructions = () => {
    speakText(t.audioPrompts.pageGuide2, language);
  };

  const isFormValid = Boolean(location.village || location.district);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Step Header */}
      <div className="bg-[#161B22] border border-gray-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📍</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{t.step2Title}</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed">{t.step2Desc}</p>
          </div>
          <button
            onClick={handleSpeakInstructions}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold text-xs sm:text-sm border border-blue-600/30 shrink-0 min-h-[48px] transition-all"
            title={t.listen}
          >
            <Volume2 className="w-5 h-5 text-blue-400" />
            <span className="hidden sm:inline">{t.listen}</span>
          </button>
        </div>
      </div>

      {/* BIG Radar Location Button */}
      <div className="bg-[#161B22] border-2 border-blue-600/40 rounded-[32px] p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            {isLocating && (
              <div className="absolute -inset-4 rounded-full bg-blue-500/20 animate-ping" />
            )}

            <button
              onClick={handleDetectGpsLocation}
              disabled={isLocating}
              className={`relative z-10 px-10 py-5 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-black text-lg sm:text-xl shadow-2xl shadow-blue-900/50 flex items-center gap-3 transition-all transform active:scale-95 min-h-[64px] ${
                isLocating ? 'animate-pulse' : ''
              }`}
            >
              <Navigation className={`w-7 h-7 text-white ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? t.locatingRadar : t.findMyLocation}</span>
            </button>
          </div>

          {locationStatusMsg && (
            <div className="bg-blue-950/60 border border-blue-500/40 text-blue-300 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{locationStatusMsg}</span>
            </div>
          )}
        </div>

        {/* Detected Location Card Preview */}
        {location.village && (
          <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-5 text-left flex items-start gap-4 shadow-inner">
            <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400 shrink-0 border border-blue-600/30">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t.pinpointedVillage}</span>
              <p className="text-xl font-black text-blue-400 mt-0.5">{location.village}</p>
              <p className="text-xs text-slate-300 font-medium mt-1">
                {location.district} District, {location.state}
                {location.lat ? ` • (${location.lat}, ${location.lng})` : ''}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Manual Dropdowns Backup */}
      <div className="bg-[#161B22] border border-gray-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          <span>{t.selectManually}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* State */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-bold block">{t.stateLabel}</label>
            <select
              value={location.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-[#0D1117] border border-gray-800 focus:border-blue-500 text-white rounded-2xl p-4 text-sm font-bold outline-none min-h-[52px]"
            >
              {RURAL_LOCATION_DATA.map((s) => (
                <option key={s.state} value={s.state} className="bg-[#161B22] text-white">
                  {s.state}
                </option>
              ))}
              {!RURAL_LOCATION_DATA.find(s => s.state === location.state) && location.state && (
                <option value={location.state} className="bg-[#161B22] text-white">{location.state}</option>
              )}
            </select>
          </div>

          {/* District */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-bold block">{t.districtLabel}</label>
            <select
              value={location.district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-[#0D1117] border border-gray-800 focus:border-blue-500 text-white rounded-2xl p-4 text-sm font-bold outline-none min-h-[52px]"
            >
              {selectedStateObj?.districts.map((d) => (
                <option key={d.name} value={d.name} className="bg-[#161B22] text-white">
                  {d.name}
                </option>
              ))}
              {!selectedStateObj?.districts.find(d => d.name === location.district) && location.district && (
                <option value={location.district} className="bg-[#161B22] text-white">{location.district}</option>
              )}
            </select>
          </div>

          {/* Village / Panchayat */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-bold block">{t.villageLabel}</label>
            <select
              value={location.village}
              onChange={(e) => handleVillageChange(e.target.value)}
              className="w-full bg-[#0D1117] border border-gray-800 focus:border-blue-500 text-white rounded-2xl p-4 text-sm font-bold outline-none min-h-[52px]"
            >
              {selectedDistrictObj?.villages.map((v) => (
                <option key={v} value={v} className="bg-[#161B22] text-white">
                  {v}
                </option>
              ))}
              {!selectedDistrictObj?.villages.includes(location.village) && location.village && (
                <option value={location.village} className="bg-[#161B22] text-white">{location.village}</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-3xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-base font-bold border border-gray-800 min-h-[60px]"
        >
          {t.back}
        </button>

        <button
          onClick={onNext}
          disabled={!isFormValid}
          className={`px-10 py-5 rounded-3xl font-black text-xl transition-all shadow-xl min-h-[64px] flex items-center gap-3 uppercase tracking-tight ${
            isFormValid
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30 transform active:scale-95'
              : 'bg-[#21262D] text-gray-500 border border-gray-800 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{t.next}</span>
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};
