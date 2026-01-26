import React from 'react';
import { Layout } from '../components/Layout';
import { MapPin, Phone, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useDonations } from '../contexts/DonationContext'; // <--- IMPORT CONTEXT

const VolunteerDashboard: React.FC = () => {
  const { donations, claimDonation } = useDonations();

  // Filter only 'active' donations for the volunteer to see
  const availablePickups = donations.filter(d => d.status === 'active');

  // Helper to open Google Maps
  const openMaps = (address: string) => {
    // If it looks like coordinates (Lat: ..., Long: ...)
    if (address.includes('Lat:') && address.includes('Long:')) {
       // Extract numbers roughly for the query
       const query = address.replace('Lat:', '').replace('Long:', '').replace(/\s/g, '');
       window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    } else {
       // Standard address search
       window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
          <p className="text-gray-500">Find donations near you that need pickup.</p>
        </div>

        <div className="grid gap-6">
          {availablePickups.map((pickup) => (
            <div key={pickup.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4">
                  {pickup.imageUrl && (
                    <img src={pickup.imageUrl} alt={pickup.item} className="w-24 h-24 rounded-xl object-cover bg-gray-100" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{pickup.item}</h3>
                    <p className="text-green-600 font-medium">{pickup.quantity}</p>
                    <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                      {pickup.donorType}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-400">
                  {new Date(pickup.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                 {/* LOCATION ROW */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                   <div className="flex items-center gap-2 text-sm text-gray-700 truncate mr-2">
                      <MapPin size={16} className="text-gray-400 shrink-0" />
                      <span className="truncate">{pickup.address}</span>
                   </div>
                   <button 
                     onClick={() => openMaps(pickup.address)}
                     className="shrink-0 text-xs bg-white border border-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded hover:bg-gray-100 flex items-center gap-1"
                   >
                     View Map <ExternalLink size={12}/>
                   </button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {/* CLAIM BUTTON */}
                <button 
                  onClick={() => claimDonation(pickup.id)}
                  className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Accept Pickup
                </button>

                {/* CALL BUTTON (Uses real number) */}
                <a 
                  href={`tel:${pickup.phone}`}
                  className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-green-50 text-green-700 flex items-center justify-center transition-colors"
                >
                  <Phone size={20} />
                </a>
              </div>
            </div>
          ))}

          {availablePickups.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-gray-400 shadow-sm">
                 <CheckCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
              <p className="text-gray-500">No active donations needing pickup right now.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VolunteerDashboard;