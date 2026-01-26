import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, MapPin, CheckCircle, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { analyzeFoodImage } from '../services/geminiService';
import { saveDonationToCloud } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ScanResult } from '../types';
import { Layout } from '../components/Layout';

const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('snap');
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  
  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState('');

  // Location State
  const [gpsLocation, setGpsLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState('Locating...');

  // 1. Get Location immediately when opening the tab
  useEffect(() => {
    if (activeTab === 'snap') {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationStatus("GPS Ready");
        },
        (err) => {
          console.error("GPS Error:", err);
          setLocationStatus("GPS Failed (using default)");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [activeTab]);

  // 2. Start Live Camera
  const startCamera = async () => {
    setShowCamera(true);
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera on phones
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setCameraError("Could not access camera. Please allow permissions.");
      setShowCamera(false);
    }
  };

  // 3. Capture Photo from Video Stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw image
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to Base64
      const imageBase64 = canvas.toDataURL('image/jpeg');
      
      // Stop stream
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      
      setShowCamera(false);
      processImage(imageBase64);
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  // 4. Handle File Upload (Fallback)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  // 5. Shared Logic to Process Image (Gemini + Firebase)
  const processImage = async (base64Image: string) => {
    setIsScanning(true);
    setCurrentResult(null);

    try {
      const result = await analyzeFoodImage(base64Image);
      
      const fullResult = { 
        ...result, 
        id: Math.random().toString(36).substr(2, 9), 
        timestamp: Date.now(), 
        imageUrl: base64Image 
      };

      if (fullResult.safeToEat === 'Yes') {
         await saveDonationToCloud({
           item: fullResult.item,
           category: fullResult.category,
           expiresIn: fullResult.expiresIn,
           imageUrl: fullResult.imageUrl,
           // Use the state location we captured earlier
           location: gpsLocation || { lat: 0, lng: 0 }, 
           donorId: user?.uid,
           donorName: user?.displayName,
           donorPhoto: user?.photoURL
         });
      }
      setCurrentResult(fullResult);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Analysis failed");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.displayName?.split(' ')[0]}!</p>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
             <MapPin size={12} /> {locationStatus}
          </div>
        </div>

        {/* Live Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-black rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl border border-gray-800">
               <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
               
               {/* Camera Overlay Controls */}
               <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8">
                  <button onClick={closeCamera} className="p-4 rounded-full bg-gray-800/50 text-white backdrop-blur-sm">
                    <X size={24} />
                  </button>
                  <button onClick={capturePhoto} className="p-1 rounded-full border-4 border-white">
                    <div className="w-16 h-16 bg-white rounded-full"></div>
                  </button>
                  <button className="p-4 rounded-full bg-gray-800/50 text-white backdrop-blur-sm opacity-0">
                    <RefreshCw size={24} /> {/* Placeholder for alignment */}
                  </button>
               </div>
            </div>
            <p className="text-white mt-4 text-sm">Align food item within frame</p>
          </div>
        )}

        {/* Hidden Canvas for Capture */}
        <canvas ref={canvasRef} className="hidden"></canvas>

        {/* Main UI */}
        <div className="flex bg-green-50/50 p-1 rounded-xl mb-8 border border-green-100 max-w-2xl">
          <button className="flex-1 py-3 rounded-lg text-sm font-bold bg-white text-green-700 shadow-sm border border-green-100">
            Snap & Donate
          </button>
          <button className="flex-1 py-3 text-gray-500 hover:text-green-600 font-bold text-sm">Active</button>
          <button className="flex-1 py-3 text-gray-500 hover:text-green-600 font-bold text-sm">History</button>
        </div>

        {/* Scan Area */}
        {!isScanning && !currentResult ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-green-700 font-bold mb-6">
              <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</div>
              Capture Food Image
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
              <button 
                onClick={startCamera}
                className="bg-green-600 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                <Camera size={24} /> Open Live Camera
              </button>
              
              <label className="cursor-pointer bg-white text-gray-700 border border-gray-200 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <Upload size={24} /> Upload File
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            {cameraError && <p className="text-red-500 text-sm mt-4">{cameraError}</p>}
          </div>
        ) : isScanning ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center h-[400px] flex flex-col items-center justify-center shadow-sm">
            <div className="bg-green-50 p-6 rounded-full mb-6 animate-pulse">
              <Sparkles size={40} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing your food...</h3>
            <p className="text-gray-500">Checking freshness and identifying item</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg flex flex-col md:flex-row gap-8 animate-in slide-in-from-bottom">
             <div className="w-full md:w-1/3">
                <img src={currentResult?.imageUrl} alt="Scan" className="w-full h-64 object-cover rounded-2xl shadow-md" />
             </div>
             <div className="w-full md:w-2/3 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{currentResult?.category}</span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">{currentResult?.item}</h2>
                    </div>
                    {currentResult?.safeToEat === 'Yes' ? (
                        <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                            <CheckCircle size={20} /> Safe
                        </div>
                    ) : (
                        <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                            <AlertTriangle size={20} /> Unsafe
                        </div>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-500 text-sm">Expires In</p>
                        <p className="text-xl font-bold text-gray-800">{currentResult?.expiresIn}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-500 text-sm">Confidence</p>
                        <p className="text-xl font-bold text-gray-800">{currentResult?.confidence}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => setCurrentResult(null)} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">Scan Another</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DonorDashboard;