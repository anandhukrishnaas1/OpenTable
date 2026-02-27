import React, { useState, useRef } from 'react';
import { Camera, Upload, X, MapPin, Package, RefreshCw } from 'lucide-react';
import { Layout } from '../components/Layout';
import type { ScanResult } from '../services/geminiService';
import { analyzeFoodImage } from '../services/geminiService';
import type { DonationItem } from '../contexts/DonationContext';
import { useDonations } from '../contexts/DonationContext';
import { uploadToCloudinary } from '../services/cloudinary';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const DonorDashboard: React.FC = () => {
  const { donations, addDonation } = useDonations();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'scan' | 'active' | 'history'>('scan');
  const { toast, showToast, hideToast } = useToast();

  // Camera & Form States
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const [donorType, setDonorType] = useState('Individual');
  const [quantity, setQuantity] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- CAMERA LOGIC (Same as before) ---
  const startCamera = async () => {
    setIsCameraOpen(true);
    setImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      showToast("Could not access camera.", 'error');
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
      setImage(photoData);

      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOpen(false);
      performAnalysis(photoData);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        performAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = async (imageBase64: string) => {
    setAnalyzing(true);
    try {
      const result = await analyzeFoodImage(imageBase64);
      setScanResult(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      showToast("Analysis failed: " + message, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setAddress(`Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)}`);
          setIsLocating(false);
        },
        () => { showToast("Location failed", 'error'); setIsLocating(false); }
      );
    }
  };

  const handleFinalSubmit = async () => {
    if (!scanResult || !quantity || !contactPhone || !address) {
      showToast("Please fill in all details.", 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined = undefined;
      if (image) {
        try {
          imageUrl = await uploadToCloudinary(image);
        } catch (uploadError) {
          console.warn("Cloudinary upload failed, saving without image:", uploadError);
        }
      }

      const newDonation: DonationItem = {
        id: Math.random().toString(36).substr(2, 9),
        item: scanResult.item,
        category: scanResult.category,
        quantity: quantity,
        donorType: donorType,
        phone: contactPhone,
        address: address,
        status: 'active',
        timestamp: new Date(),
        imageUrl: imageUrl,
        expiresIn: scanResult.expiresIn,
        donorEmail: user?.email || undefined
      };

      await addDonation(newDonation);

      // Reset
      setImage(null);
      setScanResult(null);
      setQuantity('');
      setContactPhone('');
      setAddress('');
      setActiveTab('active');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      showToast("Failed to save donation: " + message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only show this donor's donations
  const myDonations = donations.filter(d => d.donorEmail === user?.email);
  // Active = Status is 'active'
  const activeDonations = myDonations.filter(d => d.status === 'active');
  // History = Volunteer picked it up (claimed) or delivered
  const historyDonations = myDonations.filter(d => d.status === 'claimed' || d.status === 'delivered');

  return (
    <Layout>
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={hideToast} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* TABS */}
        <div className="bg-gray-100/80 rounded-full p-1.5 mb-10 flex shadow-sm border border-gray-100">
          {['scan', 'active', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'scan' | 'active' | 'history')}
              className={`flex-1 py-3 px-6 rounded-full text-sm font-bold transition-all capitalize ${activeTab === tab ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              {tab === 'scan' ? 'Snap & Donate' : tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT: SCAN */}
        {activeTab === 'scan' && (
          <div className="space-y-6">
            {/* 1. CAMERA / UPLOAD BUTTONS */}
            {!image && !isCameraOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={startCamera} className="bg-green-600 text-white rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 hover:bg-green-700 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
                  <div className="bg-white/20 p-5 rounded-full"><Camera size={48} /></div>
                  <span className="font-bold text-xl">Open Camera</span>
                </button>
                <label className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className="bg-green-50 p-5 rounded-full text-green-600"><Upload size={48} /></div>
                  <span className="font-bold text-gray-700 text-xl">Upload Photo</span>
                </label>
              </div>
            )}

            {/* 2. CAMERA VIEWFINDER */}
            {isCameraOpen && (
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-xl">
                <video ref={videoRef} autoPlay playsInline className="w-full h-96 object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8">
                  <button onClick={() => setIsCameraOpen(false)} className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white"><X size={24} /></button>
                  <button onClick={capturePhoto} className="bg-white p-1 rounded-full border-4 border-gray-200 hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-white border-4 border-black rounded-full" />
                  </button>
                  <div className="w-14" />
                </div>
              </div>
            )}

            {/* 3. PREVIEW & FORM */}
            {image && (
              <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden border border-gray-100">
                <div className="relative h-72 bg-gray-100">
                  <img src={image} alt="Scan" className="w-full h-full object-cover" />
                  <button onClick={() => { setImage(null); setScanResult(null); }} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-gray-600 hover:text-red-600"><RefreshCw size={20} /></button>
                  {analyzing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-3"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />Analyzing...</div>
                    </div>
                  )}
                </div>

                {scanResult && scanResult.safeToEat === 'Yes' && (
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-gray-900">{scanResult.item}</h2>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{scanResult.category}</span>
                    </div>

                    {/* Expiry & Confidence */}
                    <div className="flex gap-3">
                      <div className="flex-1 bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-lg">⏰</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Expires In</p>
                          <p className="text-lg font-bold text-orange-700">{scanResult.expiresIn}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-lg">🎯</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Confidence</p>
                          <p className="text-lg font-bold text-blue-700">{scanResult.confidence}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-bold mb-4">Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-gray-500 mb-1 ml-1">Donor Type</label>
                          <select
                            value={donorType}
                            onChange={e => setDonorType(e.target.value)}
                            className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="Individual">Individual</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Grocery Store">Grocery Store</option>
                            <option value="Bakery">Bakery</option>
                            <option value="Food Bank">Food Bank</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>                         <input value={quantity} onChange={e => setQuantity(e.target.value)} className="p-3 bg-gray-50 border rounded-xl" placeholder="Quantity (e.g. 5kg)" />
                      </div>
                      <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="w-full mt-4 p-3 bg-gray-50 border rounded-xl" placeholder="Phone Number" type="tel" />
                    </div>

                    <div className="border-t pt-8">
                      <h3 className="font-bold text-gray-800 mb-5">Location</h3>
                      <button onClick={handleUseCurrentLocation} className="w-full bg-green-50 hover:bg-green-100 text-green-700 font-bold py-4 rounded-full mb-4 transition-colors">
                        {isLocating ? 'Locating...' : 'Use My GPS Location'}
                      </button>
                      <input value={address} onChange={e => setAddress(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow" placeholder="Or type address manually..." />
                    </div>

                    <div className="pt-4">
                      <button onClick={handleFinalSubmit} disabled={isSubmitting} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-full shadow-lg transition-transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed">{isSubmitting ? 'Saving...' : 'Confirm Donation'}</button>
                    </div>
                  </div>
                )}
                {scanResult && scanResult.safeToEat === 'No' && (
                  <div className="p-6 bg-red-50 text-red-700 font-bold text-center">Item Unsafe to Donate</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ACTIVE & HISTORY TABS */}
        {activeTab !== 'scan' && (
          <div className="space-y-4">
            {(activeTab === 'active' ? activeDonations : historyDonations).map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex gap-5 transition-all hover:border-gray-200">
                {item.imageUrl && <img src={item.imageUrl} className="w-24 h-24 rounded-2xl object-cover bg-gray-100 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-gray-900 truncate">{item.item}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${item.status === 'active' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}>
                      {item.status === 'active' ? 'Waiting for Pick Up' : 'Claimed / Delivered'}
                    </span>
                    <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">{item.category}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 flex items-center gap-1.5 truncate"><Package size={14} /> {item.quantity}  •  <MapPin size={14} /> {item.address}</p>
                </div>
              </div>
            ))}
            {activeTab === 'active' && activeDonations.length === 0 && <p className="text-center text-gray-400 py-10">No active donations.</p>}
            {activeTab === 'history' && historyDonations.length === 0 && <p className="text-center text-gray-400 py-10">No history yet.</p>}
          </div>
        )}
      </div>
    </Layout>
  );
};
export default DonorDashboard;