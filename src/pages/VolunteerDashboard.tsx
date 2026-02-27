import React, { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import {
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  ExternalLink,
  Camera,
  X,
  Truck,
  AlertTriangle,
} from 'lucide-react';
import type { DonationItem } from '../contexts/DonationContext';
import { useDonations } from '../contexts/DonationContext';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { uploadToCloudinary } from '../services/cloudinary';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const VolunteerDashboard: React.FC = () => {
  const { donations, claimDonation, completeDelivery } = useDonations();
  const { user, isVerifiedVolunteer } = useAuth();
  const { applications } = useAdmin();

  const [activeTab, setActiveTab] = useState<
    'available' | 'mydeliveries' | 'completed' | 'expired'
  >('available');

  // Helper: parse expiresIn string and check if a donation has expired
  const getExpiryInfo = (donation: DonationItem): { expired: boolean; remainingText: string } => {
    if (!donation.expiresIn || !donation.timestamp) {
      return { expired: false, remainingText: 'Unknown' };
    }

    const expiresIn = donation.expiresIn.toLowerCase();
    let totalMs = 0;

    // Parse "X hours" or "X days" or "X day"
    const hoursMatch = expiresIn.match(/(\d+)\s*hour/);
    const daysMatch = expiresIn.match(/(\d+)\s*day/);

    if (hoursMatch) totalMs += parseInt(hoursMatch[1]) * 60 * 60 * 1000;
    if (daysMatch) totalMs += parseInt(daysMatch[1]) * 24 * 60 * 60 * 1000;
    if (totalMs === 0) totalMs = 24 * 60 * 60 * 1000; // fallback: 1 day

    const donatedAt = new Date(donation.timestamp).getTime();
    const expiryTime = donatedAt + totalMs;
    const now = Date.now();
    const remaining = expiryTime - now;

    if (remaining <= 0) return { expired: true, remainingText: 'Expired' };

    const remainingHours = Math.floor(remaining / (60 * 60 * 1000));
    const remainingMins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    if (remainingHours >= 24) {
      const days = Math.floor(remainingHours / 24);
      const hrs = remainingHours % 24;
      return { expired: false, remainingText: `${days}d ${hrs}h left` };
    }
    if (remainingHours > 0) {
      return { expired: false, remainingText: `${remainingHours}h ${remainingMins}m left` };
    }
    return { expired: false, remainingText: `${remainingMins}m left` };
  };

  // Camera & Form States for Proof of Delivery
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Check verification: either from user's own role OR from the applications list
  const isVerified =
    isVerifiedVolunteer ||
    applications.some((app) => app.email === user?.email && app.status === 'Verified');

  // Filter donations with expiry awareness
  const allActive = donations.filter((d) => d.status === 'active');
  const availablePickups = allActive.filter((d) => !getExpiryInfo(d).expired);
  const expiredDonations = allActive.filter((d) => getExpiryInfo(d).expired);
  const myDeliveries = donations.filter(
    (d) => d.status === 'claimed' && d.claimedBy === user?.email
  );
  const completedDeliveries = donations.filter(
    (d) => d.status === 'delivered' && d.claimedBy === user?.email
  );

  // Helper to open Google Maps
  const openMaps = (address: string) => {
    // If it looks like coordinates (Lat: ..., Long: ...)
    if (address.includes('Lat:') && address.includes('Long:')) {
      // Extract numbers roughly for the query
      const query = address.replace('Lat:', '').replace('Long:', '').replace(/\s/g, '');
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    } else {
      // Standard address search
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
        '_blank'
      );
    }
  };

  // --- CAMERA LOGIC FOR PROOF ---
  const startCamera = async (id: string) => {
    setSelectedDonationId(id);
    setIsCameraOpen(true);
    setProofImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      showToast('Could not access camera.', 'error');
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      const photoData = canvas.toDataURL('image/jpeg');
      setProofImage(photoData);

      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setIsCameraOpen(false);
    }
  };

  const submitProof = async () => {
    if (selectedDonationId && proofImage) {
      setIsSubmitting(true);
      try {
        const cloudinaryUrl = await uploadToCloudinary(proofImage);
        await completeDelivery(selectedDonationId, cloudinaryUrl);
        setSelectedDonationId(null);
        setProofImage(null);
        showToast('Delivery recorded! Thank you for closing the loop.', 'success');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        showToast('Failed to upload proof: ' + message, 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Layout>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={hideToast}
      />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
          <p className="text-gray-500">
            Pick up food and upload proof of delivery to complete tickets.
          </p>
        </div>

        {/* TABS */}
        <div className="bg-gray-100/80 rounded-full p-1.5 mb-10 flex shadow-sm border border-gray-100 max-w-2xl">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-3 px-6 rounded-full text-sm font-bold transition-all ${
              activeTab === 'available'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Available Pickups ({availablePickups.length})
          </button>
          <button
            onClick={() => setActiveTab('mydeliveries')}
            className={`flex-1 py-3 px-6 rounded-full text-sm font-bold transition-all ${
              activeTab === 'mydeliveries'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            My Deliveries ({myDeliveries.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 px-6 rounded-full text-sm font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Completed ({completedDeliveries.length})
          </button>
          {expiredDonations.length > 0 && (
            <button
              onClick={() => setActiveTab('expired')}
              className={`flex-1 py-3 px-6 rounded-full text-sm font-bold transition-all ${
                activeTab === 'expired'
                  ? 'bg-white text-red-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Expired ({expiredDonations.length})
            </button>
          )}
        </div>

        {activeTab === 'available' && (
          <div className="grid gap-8">
            {availablePickups.map((pickup) => (
              <div
                key={pickup.id}
                className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:border-gray-200 transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    {pickup.imageUrl && (
                      <img
                        src={pickup.imageUrl}
                        alt={pickup.item}
                        className="w-24 h-24 rounded-xl object-cover bg-gray-100"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{pickup.item}</h3>
                      <p className="text-green-600 font-medium">{pickup.quantity}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                          {pickup.donorType}
                        </span>
                        {pickup.expiresIn && (
                          <span className="bg-orange-50 text-orange-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                            <Clock size={12} /> {getExpiryInfo(pickup).remainingText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    {new Date(pickup.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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
                      View Map <ExternalLink size={12} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  {/* CLAIM BUTTON */}
                  {isVerified ? (
                    <button
                      onClick={() => {
                        if (user?.email) {
                          claimDonation(pickup.id, user.email);
                          setActiveTab('mydeliveries'); // switch tabs automatically
                        } else {
                          showToast('Please log in to claim.', 'warning');
                        }
                      }}
                      className="flex-1 bg-green-600 text-white font-bold py-4 rounded-full hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <CheckCircle size={18} /> Accept Pickup
                    </button>
                  ) : (
                    <Link
                      to="/onboarding"
                      className="flex-1 bg-yellow-500 text-white font-bold py-3 rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Shield size={18} /> Verify ID to Accept Pickups
                    </Link>
                  )}

                  <a
                    href={`tel:${pickup.phone}`}
                    className="px-8 py-4 border border-gray-200 rounded-full hover:bg-green-50 text-green-700 flex items-center justify-center transition-colors"
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
        )}

        {/* MY DELIVERIES TAB */}
        {activeTab === 'mydeliveries' && (
          <div className="grid gap-8">
            {myDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-blue-50/50 hover:border-blue-100 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                      In Progress
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-3">{delivery.item}</h3>
                    <p className="text-gray-500 font-medium">{delivery.quantity}</p>
                  </div>
                </div>

                {/* Drop-off Location + Live Map */}
                <div className="bg-gray-50 p-5 rounded-2xl mb-4 border border-gray-100/50">
                  <p className="font-bold text-sm text-gray-700 flex items-center gap-2 mb-1">
                    <MapPin size={16} /> Drop-off Location
                  </p>
                  <p className="text-gray-600 text-sm ml-6 mb-3">{delivery.address}</p>

                  {/* Embedded Google Maps */}
                  <div className="rounded-xl overflow-hidden border border-gray-200 mb-3">
                    <iframe
                      title={`Map to ${delivery.item}`}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(delivery.address)}&output=embed`}
                    />
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const dest = delivery.address.includes('Lat:')
                          ? delivery.address
                              .replace('Lat:', '')
                              .replace('Long:', '')
                              .replace(/\s/g, '')
                          : encodeURIComponent(delivery.address);
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`,
                          '_blank'
                        );
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
                    >
                      <MapPin size={16} /> Navigate Now
                    </button>
                    <a
                      href={`tel:${delivery.phone}`}
                      className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-green-50 text-green-700 flex items-center justify-center transition-colors"
                    >
                      <Phone size={18} />
                    </a>
                  </div>
                </div>

                {/* Photo Evidence Section */}
                <div className="border-t pt-4">
                  <h4 className="font-bold text-sm mb-3">Require Proof of Delivery</h4>

                  {!proofImage && selectedDonationId !== delivery.id && !isCameraOpen && (
                    <button
                      onClick={() => startCamera(delivery.id)}
                      className="w-full bg-gray-900 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-black transition-transform hover:-translate-y-0.5 shadow-lg"
                    >
                      <Camera size={20} /> Take Delivery Photo
                    </button>
                  )}

                  {/* Camera view specifically for this item */}
                  {isCameraOpen && selectedDonationId === delivery.id && (
                    <div className="relative bg-black rounded-2xl overflow-hidden shadow-xl mb-4 mt-2">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 object-cover"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-8">
                        <button
                          onClick={() => setIsCameraOpen(false)}
                          className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white"
                        >
                          <X size={20} />
                        </button>
                        <button
                          onClick={capturePhoto}
                          className="bg-white p-1 rounded-full border-4 border-gray-200"
                        >
                          <div className="w-12 h-12 bg-white border-4 border-black rounded-full" />
                        </button>
                        <div className="w-12" />
                      </div>
                    </div>
                  )}

                  {/* Preview before submit */}
                  {proofImage && selectedDonationId === delivery.id && (
                    <div className="mt-4">
                      <img src={proofImage} className="w-full h-48 object-cover rounded-xl mb-4" />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setProofImage(null)}
                          className="flex-1 bg-gray-100 py-3 rounded-xl font-bold"
                        >
                          Retake
                        </button>
                        <button
                          onClick={submitProof}
                          disabled={isSubmitting}
                          className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg disabled:bg-green-400"
                        >
                          {isSubmitting ? 'Uploading...' : 'Submit & Close Ticket'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {myDeliveries.length === 0 && (
              <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <Truck size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900">No active deliveries</h3>
                <p className="text-gray-500">When you accept a pickup, it will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* COMPLETED DELIVERIES TAB */}
        {activeTab === 'completed' && (
          <div className="grid gap-8">
            {completedDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-green-50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                      ✅ Delivered
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-3">{delivery.item}</h3>
                    <p className="text-gray-500 font-medium">{delivery.quantity}</p>
                  </div>
                  {delivery.clappedByAdmin && (
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-full animate-bounce">
                      <span className="text-2xl">👏</span>
                      <span className="text-sm font-bold text-yellow-700">Admin Applauded!</span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100/50">
                  <p className="font-bold text-sm text-gray-700 flex items-center gap-2 mb-1">
                    <MapPin size={16} /> Delivered to
                  </p>
                  <p className="text-gray-600 text-sm ml-6">{delivery.address}</p>
                </div>

                {delivery.deliveryProofUrl && (
                  <div>
                    <p className="font-bold text-sm text-gray-700 mb-2">📸 Delivery Proof</p>
                    <img
                      src={delivery.deliveryProofUrl}
                      alt="Delivery proof"
                      className="w-full h-48 object-cover rounded-xl border border-gray-100"
                    />
                  </div>
                )}
              </div>
            ))}

            {completedDeliveries.length === 0 && (
              <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900">No completed deliveries yet</h3>
                <p className="text-gray-500">
                  Once you deliver food and submit proof, they will appear here.
                </p>
              </div>
            )}
          </div>
        )}
        {/* EXPIRED DONATIONS TAB */}
        {activeTab === 'expired' && (
          <div className="grid gap-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-700 font-medium">
                These food items have passed their estimated safe consumption window and can no
                longer be accepted for delivery.
              </p>
            </div>

            {expiredDonations.map((item) => (
              <div
                key={item.id}
                className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-red-100 opacity-75"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.item}
                        className="w-24 h-24 rounded-xl object-cover bg-gray-100 grayscale"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.item}</h3>
                      <p className="text-gray-400 font-medium">{item.quantity}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                          {item.donorType}
                        </span>
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <AlertTriangle size={12} /> Expired
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {item.expiresIn && (
                  <p className="text-xs text-gray-400 mt-3">
                    Original shelf life: {item.expiresIn} from donation
                  </p>
                )}
              </div>
            ))}

            {expiredDonations.length === 0 && (
              <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-300" />
                <h3 className="text-lg font-bold text-gray-900">No expired items</h3>
                <p className="text-gray-500">
                  All donations are still within their safe consumption window.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VolunteerDashboard;
