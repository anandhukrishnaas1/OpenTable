import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Target, Heart, Lightbulb, FileText, Camera, Users, Truck, Activity } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useDonations } from '../contexts/DonationContext';

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const { donations } = useDonations();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderImages = [
    '/slider1.webp',
    '/slider2.webp',
    '/slider3.webp',
    '/slider4.webp',
    '/slider5.webp'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  return (
    <Layout>
      {/* --- HERO SECTION --- */}
      <div className="bg-warm-gradient relative overflow-hidden pb-12">
        {/* Decorative soft circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50/60 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Leaf size={12} />
              AI-Powered Food Rescue
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Every Meal <br className="hidden md:block" /> Mends a Heart. <br />
              <span className="text-green-600">Share Food.</span> <br />
              <span className="text-green-600">Share Hope.</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md leading-relaxed font-medium">
              OpenTable empowers communities by seamlessly connecting surplus, perfectly good food with local NGOs and shelters. Our platform ensures safety, dignity, and care in every donation.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Link
                to={user ? "/role-selection" : "/login"}
                className="bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition-all hover:scale-105 shadow-xl shadow-green-600/20 flex items-center gap-2"
              >
                Get Involved Today <ArrowRight size={20} />
              </Link>
              {/* REMOVED LEARN MORE BUTTON AS REQUESTED */}
            </div>
          </div>

          <div className="relative animate-in slide-in-from-right duration-700">
            {/* Image Frame with softer organic border radius */}
            <div className="relative w-full aspect-[4/3] rounded-[4rem_1rem_4rem_1rem] overflow-hidden shadow-2xl border-8 border-white">
              {sliderImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt="Food Donation Illustration"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTIONS --- */}
      <div className="bg-gray-50 py-24 relative overflow-hidden">
        {/* Soft floating background element */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 space-y-20 relative z-10">

          {/* 1. Our Purpose */}
          <section id="our-purpose" className="scroll-mt-24 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-full text-green-600"><Target size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-900">Our Purpose</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              OpenTable was founded with a simple yet powerful mission: to eliminate food waste while addressing hunger in our communities. Every day, tons of perfectly good food is discarded by restaurants, grocery stores, and households while millions of people struggle to find their next meal.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform uses cutting-edge AI technology to make food donation effortless and safe. By connecting donors directly with NGOs and food banks, we ensure that surplus food reaches those who need it most, quickly and efficiently.
            </p>
          </section>

          {/* 2. Why We Serve */}
          <section id="why-we-serve" className="scroll-mt-24 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Heart size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-900">Why We Serve</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-8">
              We serve because we believe in the power of community. Food insecurity affects families, children, and elderly individuals in every neighborhood. By making food donation accessible and simple, we empower everyone to make a difference.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">1 in 8</div>
                <div className="text-sm text-gray-500">people face hunger</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">40%</div>
                <div className="text-sm text-gray-500">of food is wasted</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">8%</div>
                <div className="text-sm text-gray-500">global emissions from food waste</div>
              </div>
            </div>
          </section>

          {/* 3. Why OpenTable */}
          <section id="why-freshlink" className="scroll-mt-24 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-full text-green-600"><Lightbulb size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-900">Why OpenTable</h2>
            </div>
            <p className="text-gray-600 mb-6">
              OpenTable stands apart because we combine technology with compassion. Our AI-powered food analysis ensures only safe, quality food is donated, protecting both donors and recipients.
            </p>
            <ul className="space-y-4">
              {[
                { title: 'AI Safety Verification', desc: 'Instant analysis ensures food is safe for donation' },
                { title: 'Real-time Tracking', desc: 'Know exactly where your donation goes' },
                { title: 'Local Impact', desc: 'Connect with NGOs and food banks in your community' },
                { title: 'Volunteer Network', desc: 'Dedicated volunteers ensure timely delivery' }
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900">{item.title}:</span> <span className="text-gray-600">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. How We Help */}
          <section id="how-we-help" className="scroll-mt-24 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Target size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-900">How We Help</h2>
            </div>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><Camera size={18} /> Snap & Analyze</h3>
                  <p className="text-sm text-gray-500 mt-1">Donors take a photo of their food. Our AI instantly analyzes safety, freshness, and categorizes the donation.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><Users size={18} /> Volunteer Accepts</h3>
                  <p className="text-sm text-gray-500 mt-1">Local volunteers receive notifications about available donations and accept pickups based on their location.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><Truck size={18} /> Pickup & Delivery</h3>
                  <p className="text-sm text-gray-500 mt-1">Volunteers collect the food and deliver it to partner NGOs, food banks, or shelters.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shrink-0">4</div>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><Activity size={18} /> Impact Tracked</h3>
                  <p className="text-sm text-gray-500 mt-1">Every donation is tracked from pickup to delivery. Donors receive updates on the real impact of their contribution.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Annual Reports */}
          <section id="annual-reports" className="scroll-mt-24 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-100 p-2 rounded-full text-yellow-700"><FileText size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-900">Annual Reports</h2>
            </div>
            <p className="text-gray-600 mb-8">
              We believe in transparency and accountability. Our annual reports detail our impact, financials, and plans for the future.
            </p>
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-300">
              <p className="font-bold text-gray-900 mb-1">Annual reports coming soon.</p>
              <p className="text-sm text-gray-500">As a new initiative, we are working to compile our first comprehensive report.</p>
            </div>
          </section>

          {/* 6. Major Donations (Updated) */}
          <section id="major-donations" className="scroll-mt-24 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
            <div className="flex items-center gap-3 mb-8">
              {/* Using 'Activity' icon since it is already imported */}
              <div className="bg-purple-100 p-2 rounded-full text-purple-600"><Activity size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Major Donations</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {donations.length > 0 ? (
                donations.slice(0, 6).map((d) => {
                  let timeDisplay = 'Recently';
                  if (d.timestamp) {
                    const date = new Date(d.timestamp);
                    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
                    if (diffSec < 60) timeDisplay = 'Just now';
                    else if (diffSec < 3600) timeDisplay = `${Math.floor(diffSec / 60)} mins ago`;
                    else if (diffSec < 86400) timeDisplay = `${Math.floor(diffSec / 3600)} hours ago`;
                    else timeDisplay = `${Math.floor(diffSec / 86400)} days ago`;
                  }

                  const cat = (d.category || '').toLowerCase();
                  let iconDisplay = '📦';
                  if (cat.includes('veg') || cat.includes('produce')) iconDisplay = '🥦';
                  else if (cat.includes('fruit')) iconDisplay = '🍎';
                  else if (cat.includes('meal') || cat.includes('cooked')) iconDisplay = '🍱';
                  else if (cat.includes('bake') || cat.includes('bread')) iconDisplay = '🥖';
                  else if (cat.includes('dairy')) iconDisplay = '🥛';

                  return (
                    <div key={d.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all hover:-translate-y-1">
                      <div className="text-4xl mb-3">{iconDisplay}</div>
                      <h3 className="font-bold text-gray-900">{d.donorType || 'Generous Donor'}</h3>
                      <p className="text-green-600 font-medium text-sm my-1">{d.quantity} {d.item}</p>
                      <p className="text-xs text-gray-400">{timeDisplay}</p>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <Activity className="mx-auto mb-2 opacity-50" size={32} />
                  <p>No recent donations found yet. Be the first to donate!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;