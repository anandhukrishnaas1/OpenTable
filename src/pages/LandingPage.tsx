import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Target, Heart, Lightbulb, FileText, Camera, Users, Truck, Activity } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {/* --- HERO SECTION --- */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Leaf size={12} />
            AI-Powered Food Rescue
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Every Meal Matters. <br />
            <span className="text-green-600">Share Freshness,</span> <br />
            <span className="text-green-600">Share Hope.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-md leading-relaxed">
            FreshLink connects surplus food from restaurants, stores, and households with NGOs and food banks in your community. Our AI instantly analyzes food safety so you can donate with confidence.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <Link 
              to={user ? "/role-selection" : "/login"} 
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            {/* REMOVED LEARN MORE BUTTON AS REQUESTED */}
          </div>
        </div>

        <div className="relative animate-in slide-in-from-right duration-700">
           <img 
            src="/restaurant.jpeg" 
            alt="Food Donation Illustration" 
            className="w-full rounded-2xl shadow-2xl border-4 border-white"
          />
        </div>
      </div>

      {/* --- CONTENT SECTIONS --- */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-16">

          {/* 1. Our Purpose */}
          <section id="our-purpose" className="scroll-mt-24 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-full text-green-600"><Target size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-900">Our Purpose</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              FreshLink was founded with a simple yet powerful mission: to eliminate food waste while addressing hunger in our communities. Every day, tons of perfectly good food is discarded by restaurants, grocery stores, and households while millions of people struggle to find their next meal.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform uses cutting-edge AI technology to make food donation effortless and safe. By connecting donors directly with NGOs and food banks, we ensure that surplus food reaches those who need it most, quickly and efficiently.
            </p>
          </section>

          {/* 2. Why We Serve */}
          <section id="why-we-serve" className="scroll-mt-24 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
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

          {/* 3. Why FreshLink */}
          <section id="why-freshlink" className="scroll-mt-24 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-full text-green-600"><Lightbulb size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-900">Why FreshLink</h2>
            </div>
            <p className="text-gray-600 mb-6">
              FreshLink stands apart because we combine technology with compassion. Our AI-powered food analysis ensures only safe, quality food is donated, protecting both donors and recipients.
            </p>
            <ul className="space-y-4">
              {[
                { title: 'AI Safety Verification', desc: 'Instant analysis ensures food is safe for donation' },
                { title: 'Real-time Tracking', desc: 'Know exactly where your donation goes' },
                { title: 'Local Impact', desc: 'Connect with NGOs and food banks in your community' },
                { title: 'Volunteer Network', desc: 'Dedicated volunteers ensure timely delivery' }
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0"></div>
                  <div>
                    <span className="font-bold text-gray-900">{item.title}:</span> <span className="text-gray-600">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. How We Help */}
          <section id="how-we-help" className="scroll-mt-24 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
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
          <section id="annual-reports" className="scroll-mt-24 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
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
          <section id="major-donations" className="scroll-mt-24 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              {/* Using 'Activity' icon since it is already imported */}
              <div className="bg-purple-100 p-2 rounded-full text-purple-600"><Activity size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Major Donations</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { donor: "Grand Plaza Hotel", item: "150 Gourmet Meals", time: "Just now", icon: "🏨" },
                { donor: "City Harvest Market", item: "300kg Fresh Veggies", time: "2 hours ago", icon: "🥦" },
                { donor: "Daily Bread Bakery", item: "200 Loaves & Pastries", time: "4 hours ago", icon: "🥖" },
                { donor: "Tech Summit 2026", item: "500 Catering Boxes", time: "6 hours ago", icon: "🍱" },
                { donor: "Green Valley Farm", item: "10 Crates of Apples", time: "12 hours ago", icon: "🍎" },
                { donor: "Downtown Bistro", item: "80kg Surplus Pasta", time: "1 day ago", icon: "🍝" }
              ].map((d, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="text-4xl mb-3">{d.icon}</div>
                  <h3 className="font-bold text-gray-900">{d.donor}</h3>
                  <p className="text-green-600 font-medium text-sm my-1">{d.item}</p>
                  <p className="text-xs text-gray-400">{d.time}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;