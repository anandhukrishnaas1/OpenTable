import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from "firebase/database";
import { db } from "../services/firebase";
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Package, MapPin, ExternalLink } from 'lucide-react';

interface Donation {
  id: string;
  item: string;
  category: string;
  expiresIn: string;
  imageUrl: string;
  status: 'available' | 'reserved' | 'picked_up';
  timestamp: number;
  location?: { lat: number, lng: number };
}

const VolunteerDashboard: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const donationsRef = ref(db, 'donations');

    const unsubscribe = onValue(donationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const donationList = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        setDonations(donationList.reverse());
      } else {
        setDonations([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleClaim = async (id: string) => {
    try {
      const donationRef = ref(db, `donations/${id}`);
      await update(donationRef, {
        status: 'reserved',
        pickedUpBy: 'Volunteer 1',
        pickedUpAt: Date.now()
      });
    } catch (e) {
      console.error("Error claiming item:", e);
      alert("Failed to claim item. It might have been taken.");
    }
  };

  const openMaps = (lat: number, lng: number) => {
    // FIX: Use https and standard query format
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            Volunteer Feed <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
          </h2>
          <p className="text-xs text-gray-500">Real-time donation alerts</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading donations...</div>
        ) : donations.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-200 p-6 rounded-full inline-block mb-4 text-gray-400">
              <Package size={48} />
            </div>
            <p className="text-gray-500">No active donations right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div key={donation.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 animate-in slide-in-from-bottom-2">
                <div className="relative w-20 h-20 shrink-0">
                   <img 
                    src={donation.imageUrl} 
                    alt={donation.item} 
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    {donation.category}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 truncate">{donation.item}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{donation.expiresIn}</span>
                      </div>
                      
                      {/* ROBUST LOCATION CHECK */}
                      {donation.location && typeof donation.location.lat === 'number' ? (
                        <button 
                          onClick={() => openMaps(donation.location!.lat, donation.location!.lng)}
                          className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          <MapPin size={10} />
                          <span>{donation.location.lat.toFixed(4).slice(0, 6)}...</span>
                          <ExternalLink size={8} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                           No GPS
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleClaim(donation.id)}
                    disabled={donation.status === 'reserved'}
                    className={`mt-3 w-full py-2 text-xs font-bold rounded-lg transition-all ${
                      donation.status === 'reserved' 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-900 text-white active:scale-95'
                    }`}
                  >
                    {donation.status === 'reserved' ? 'Claimed / Reserved' : 'Claim for Pickup'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;