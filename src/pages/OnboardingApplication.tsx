import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle, ShieldAlert } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../services/cloudinary';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const OnboardingApplication: React.FC = () => {
  const { submitApplication, applications } = useAdmin();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user already submitted
  const existingApplication = applications.find((app) => app.email === user?.email);

  const { toast, showToast, hideToast } = useToast();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const email = user?.email || '';

  const [idImage, setIdImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);

  const [backgroundDeclaration, setBackgroundDeclaration] = useState('');
  const [organization, setOrganization] = useState('');
  const [termsSigned, setTermsSigned] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hidden file inputs references
  const idInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !idImage ||
      !selfieImage ||
      !termsSigned ||
      digitalSignature.toLowerCase() !== name.toLowerCase()
    ) {
      showToast('Please complete all required fields and sign your full name exactly.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      // Try uploading to Cloudinary, but fall back to raw images if it fails
      let idUrl: string = idImage;
      let selfieUrlFinal: string = selfieImage;
      try {
        idUrl = await uploadToCloudinary(idImage);
        selfieUrlFinal = await uploadToCloudinary(selfieImage);
      } catch (uploadError) {
        console.warn('Cloudinary upload failed, using raw images:', uploadError);
      }

      await submitApplication({
        name,
        email,
        idImageUrl: idUrl,
        selfieUrl: selfieUrlFinal,
        backgroundCheckDeclaration: backgroundDeclaration,
        organizationAffiliation: organization,
        termsSigned: true,
      });

      setStep(4); // Success screen
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      showToast('Failed to submit application: ' + message, 'error');
    } finally {
      setIsSubmitting(false);
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 mb-2">
            Volunteer Onboarding
          </h1>
          <p className="text-gray-500">
            To maintain trust in our community, we require all our volunteers to verify their
            identity.
          </p>
        </div>

        {existingApplication && existingApplication.status === 'Verified' ? (
          <div className="bg-green-50 rounded-[2rem] p-10 text-center border border-green-200">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">You're Verified ✅</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Your account is fully approved! You can now start accepting food pickup requests
              across the city.
            </p>
            <button
              onClick={() => navigate('/volunteer')}
              className="bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-green-700 transition"
            >
              Go to Volunteer Dashboard
            </button>
          </div>
        ) : existingApplication &&
          (existingApplication.status === 'Pending' || existingApplication.status === 'Flagged') ? (
          <div className="bg-white rounded-[2rem] p-10 text-center border border-gray-100 shadow-sm mt-8">
            <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={48} className="text-yellow-600 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Under Review ⏳</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Thank you for submitting your volunteer application! Our administration team is
              manually verifying your ID and Selfie to ensure a safe community.
              <br />
              <br />
              Please check back soon. We will update your account status once the review is
              complete.
            </p>
          </div>
        ) : existingApplication && existingApplication.status === 'Rejected' ? (
          <div className="bg-red-50 rounded-[2rem] p-10 text-center border border-red-200 mt-8">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={48} className="text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Rejected ❌</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Unfortunately, your application to become a verified volunteer was declined by the
              administration team. If you believe this is a mistake, please contact support.
            </p>
          </div>
        ) : (
          <>
            {/* Progress Tracker */}
            {step < 4 && (
              <div className="flex gap-2 mb-8 h-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full ${step >= i ? 'bg-green-500' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            )}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold mb-4">Step 1: Basic Info & Background</h2>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Legal Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address (Locked to account)
                    </label>
                    <input
                      value={email}
                      disabled
                      className="w-full p-4 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Organization Affiliation (Optional)
                    </label>
                    <input
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                      placeholder="NGO Registration # or Organization Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <ShieldAlert size={18} className="text-orange-500" /> Background Declaration
                    </label>
                    <textarea
                      value={backgroundDeclaration}
                      onChange={(e) => setBackgroundDeclaration(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-24 focus:ring-2 focus:ring-green-500"
                      placeholder="Please declare any relevant history (e.g. food handling certifications, past infractions). Write 'None' if NA."
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (name) setStep(2);
                      else showToast('Name is required', 'warning');
                    }}
                    className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                  >
                    Continue to Identity Verification
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-xl font-bold mb-2">Step 2: Identity Verification</h2>

                  {/* ID Upload */}
                  <div className="space-y-4">
                    <p className="font-bold text-gray-700">1. Upload Government ID</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setIdImage)}
                      ref={idInputRef}
                      className="hidden"
                    />
                    <div
                      onClick={() => idInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${idImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
                    >
                      {idImage ? (
                        <div className="text-center text-green-700 font-bold flex flex-col items-center">
                          <CheckCircle size={40} className="mb-2" /> ID Uploaded Successfully
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 flex flex-col items-center">
                          <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                            <Upload size={24} className="text-gray-600" />
                          </div>
                          <span className="font-bold text-gray-700">Tap to Upload ID</span>
                          <span className="text-sm mt-1">Driver's License or Passport</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selfie Upload */}
                  <div className="space-y-4">
                    <p className="font-bold text-gray-700">2. Take a Selfie</p>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => handleImageUpload(e, setSelfieImage)}
                      ref={selfieInputRef}
                      className="hidden"
                    />
                    <div
                      onClick={() => selfieInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${selfieImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
                    >
                      {selfieImage ? (
                        <div className="text-center text-green-700 font-bold flex flex-col items-center">
                          <CheckCircle size={40} className="mb-2" /> Selfie Captured Successfully
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 flex flex-col items-center">
                          <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                            <Camera size={24} className="text-gray-600" />
                          </div>
                          <span className="font-bold text-gray-700">Tap to Take Selfie</span>
                          <span className="text-sm mt-1">Make sure you are in a well-lit area</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/3 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (idImage && selfieImage) setStep(3);
                        else showToast('Please upload both files.', 'warning');
                      }}
                      className="w-2/3 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                    >
                      Continue to Terms
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold mb-4">Step 3: Safe Food Handling Agreement</h2>
                  <div className="bg-gray-50 p-6 rounded-2xl text-sm text-gray-600 h-48 overflow-y-auto border border-gray-200">
                    <p className="font-bold mb-2">By checking agree, you confirm that you will:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Maintain strict hygiene and cleanliness during transport.</li>
                      <li>Deliver food directly to the recipient without unnecessary delays.</li>
                      <li>Not tamper with, open, or consume any part of the donated food.</li>
                      <li>
                        Transport perishable foods in temperature-appropriate containers if
                        required.
                      </li>
                      <li>
                        Provide photo evidence of the food drop-off to close the donation loop.
                      </li>
                      <li>Treat all donors and recipients with respect and professionalism.</li>
                    </ul>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={termsSigned}
                      onChange={(e) => setTermsSigned(e.target.checked)}
                      className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="font-medium text-gray-700">
                      I have read and agree to the Safe Food Handling Terms of Conduct and
                      acknowledge that violation may result in account termination.
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Digital Signature
                    </label>
                    <input
                      value={digitalSignature}
                      onChange={(e) => setDigitalSignature(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                      placeholder="Type your full legal name to sign"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="w-1/3 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-2/3 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:bg-green-400"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-12 space-y-6 animate-fade-in">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} />
                  </div>
                  <h2 className="text-3xl font-bold">Application Submitted!</h2>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Thank you for applying to be a volunteer. Our administrative team will review
                    your application shortly.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors mt-8"
                  >
                    Return to Home
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default OnboardingApplication;
