import React from 'react';
import { Layout } from '../components/Layout';
import { Leaf, Users, Star, Truck, Award, TrendingUp } from 'lucide-react';
import { useDonations } from '../contexts/DonationContext';
import { useAdmin } from '../contexts/AdminContext';

/**
 * Parses a free-text quantity string into an estimated weight in kilograms.
 * Only extracts numeric values — uses conservative 1kg fallback for unparseable strings.
 */
const parseKg = (qty: string): number => {
    if (!qty) return 0;
    const match = qty.match(/(\d+(\.\d+)?)/);
    if (match) {
        const num = parseFloat(match[1]);
        const lower = qty.toLowerCase();
        if (lower.includes('gram') || lower.includes('gm') || lower.includes('g')) return num / 1000;
        if (lower.includes('pound') || lower.includes('lbs') || lower.includes('lb')) return num * 0.45;
        if (lower.includes('ton')) return num * 1000;
        if (lower.includes('box') || lower.includes('boxes')) return num * 3;
        if (lower.includes('plate') || lower.includes('meal') || lower.includes('serving')) return num * 0.4;
        if (lower.includes('piece') || lower.includes('pcs') || lower.includes('item')) return num * 0.2;
        if (lower.includes('kg') || lower.includes('kilo')) return num;
        return num; // assume kg if no unit specified
    }
    return 1; // conservative fallback: 1kg for unparseable entries
};

const TransparencyLedger: React.FC = () => {
    const { donations } = useDonations();
    const { applications } = useAdmin();

    // Only count delivered donations for impact stats
    const deliveredDonations = donations.filter(d => d.status === 'delivered');
    const totalDeliveries = deliveredDonations.length;

    // Kilograms rescued: sum weight from ALL donations (available + claimed + delivered)
    const totalKg = Math.round(donations.reduce((acc, d) => acc + parseKg(d.quantity), 0));

    // Meals provided: each delivered donation = 1 meal served (real count, not formula)
    const totalMeals = totalDeliveries;

    // Active volunteers: count verified volunteers from admin applications
    const activeVolunteersCount = applications.filter(a => a.status === 'Verified').length;

    // Leaderboards
    const donorStats: Record<string, { kg: number, count: number }> = {};
    donations.forEach(d => {
        // Anonymize donor slightly for public ledger
        const id = `${d.donorType} (*${d.phone?.slice(-4) || 'Unk'})`;
        if (!donorStats[id]) donorStats[id] = { kg: 0, count: 0 };
        donorStats[id].kg += parseKg(d.quantity);
        donorStats[id].count += 1;
    });

    const topDonors = Object.entries(donorStats)
        .sort((a, b) => b[1].kg - a[1].kg)
        .slice(0, 3)
        .map(([name, stats]) => ({
            name,
            amount: `${Math.round(stats.kg)} kg`,
            score: Math.min(100, 80 + stats.count * 2) // compute relative trust
        }));

    const volStats: Record<string, { deliveries: number, email: string }> = {};
    donations.filter(d => d.status === 'delivered' && d.claimedBy).forEach(d => {
        if (d.claimedBy) {
            if (!volStats[d.claimedBy]) volStats[d.claimedBy] = { deliveries: 0, email: d.claimedBy };
            volStats[d.claimedBy].deliveries += 1;
        }
    });

    const topVolunteers = Object.values(volStats)
        .sort((a, b) => b.deliveries - a.deliveries)
        .slice(0, 3)
        .map(vs => {
            const app = applications.find(a => a.email === vs.email);
            // Fallback display if not found
            const name = app ? app.name.split(' ')[0] + ' ' + (app.name.split(' ')[1]?.[0] || '') + '.' : vs.email.split('@')[0];
            const trustScore = app && app.trustScore > 0 ? app.trustScore : 95; // Default 95 if new
            const rating = (Math.min(100, trustScore) / 20).toFixed(1); // Converts 95 to 4.7, 100 to 5.0
            return { name, deliveries: vs.deliveries, rating };
        });

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* Header Section */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-100/50 rounded-full blur-3xl -z-10"></div>
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm mb-6 shadow-sm">
                        <TrendingUp size={16} /> Live Impact Dashboard
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Public Transparency Ledger
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
                        We believe in total accountability. Every kilogram of food donated, every meal served, and every volunteer verifying a drop-off is tracked here for the community to see.
                    </p>
                </div>

                {/* Core Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                            <Leaf size={40} />
                        </div>
                        <div className="text-5xl font-black text-gray-900 mb-2 tracking-tight">{totalKg.toLocaleString()}</div>
                        <div className="text-gray-500 font-bold uppercase tracking-wider text-sm">Kilograms Rescued</div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                            <Users size={40} />
                        </div>
                        <div className="text-5xl font-black text-gray-900 mb-2 tracking-tight">{totalMeals.toLocaleString()}</div>
                        <div className="text-gray-500 font-bold uppercase tracking-wider text-sm">Deliveries Completed</div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                        <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-6">
                            <Truck size={40} />
                        </div>
                        <div className="text-5xl font-black text-gray-900 mb-2 tracking-tight">{activeVolunteersCount.toLocaleString()}</div>
                        <div className="text-gray-500 font-bold uppercase tracking-wider text-sm">Active Volunteers</div>
                    </div>
                </div>

                {/* Leaderboards */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Top Donors */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
                                <Award className="text-yellow-500" size={32} /> Top Donors
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {topDonors.length > 0 ? topDonors.map((donor, idx) => (
                                <div key={idx} className="flex items-center p-5 bg-gray-50/80 rounded-[1.5rem] transition-colors hover:bg-gray-100">
                                    <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-700 font-black flex items-center justify-center mr-5 shrink-0 text-lg">
                                        #{idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{donor.name}</h3>
                                        <p className="text-sm text-gray-500 font-medium">Trust Score: {donor.score}</p>
                                    </div>
                                    <div className="text-right font-black text-green-600 text-xl tracking-tight">
                                        {donor.amount}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 py-6 font-medium">No donations yet. Be the first!</p>
                            )}
                        </div>
                    </div>

                    {/* Top Volunteers */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
                                <Star className="text-blue-500" fill="currentColor" size={32} /> Top Volunteers
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {topVolunteers.length > 0 ? topVolunteers.map((vol, idx) => (
                                <div key={idx} className="flex items-center p-5 bg-gray-50/80 rounded-[1.5rem] transition-colors hover:bg-gray-100">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center mr-5 shrink-0 text-lg">
                                        #{idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{vol.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1.5 font-medium mt-0.5">
                                            {vol.rating} <Star size={14} fill="currentColor" className="text-yellow-500" /> Avg Rating
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-black text-gray-900 text-2xl tracking-tight leading-none">{vol.deliveries}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deliveries</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 py-6 font-medium">No completed deliveries yet.</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Feed Disclaimer */}
                <div className="mt-16 text-center text-sm text-gray-500 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    Note: To protect recipient privacy, real-time map tracking data is only visible to the specific donor and volunteer assigned to an active delivery ticket. This public ledger shows aggregated statistics.
                </div>

            </div>
        </Layout>
    );
};

export default TransparencyLedger;
