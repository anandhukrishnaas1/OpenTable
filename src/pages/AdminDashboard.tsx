import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAdmin, VolunteerApplication, ApplicationStatus } from '../contexts/AdminContext';
import { useDonations } from '../contexts/DonationContext';
import { Shield, Check, X, Flag, User, AlertTriangle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const { applications, updateApplicationStatus } = useAdmin();
    const { donations, clapForDelivery } = useDonations();
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

    const completedDeliveries = donations.filter(d => d.status === 'delivered');

    const selectedApp = applications.find(app => app.id === selectedAppId);

    const getStatusBadge = (status: ApplicationStatus) => {
        switch (status) {
            case 'Pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold ring-1 ring-yellow-200">Pending</span>;
            case 'Verified': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold ring-1 ring-green-200">Verified</span>;
            case 'Flagged': return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-bold ring-1 ring-orange-200">Flagged</span>;
            case 'Rejected': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold ring-1 ring-red-200">Rejected</span>;
        }
    };

    const pendingCount = applications.filter(a => a.status === 'Pending' || a.status === 'Flagged').length;
    const approvedCount = applications.filter(a => a.status === 'Verified').length;
    const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

    const displayedApps = applications.filter(a => {
        if (activeTab === 'pending') return a.status === 'Pending' || a.status === 'Flagged';
        if (activeTab === 'approved') return a.status === 'Verified';
        return a.status === 'Rejected';
    });

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Shield size={32} className="text-black" />
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        Admin Approval Dashboard
                    </h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: List of Applications */}
                    <div className="lg:col-span-1 border-r border-gray-200 pr-4">

                        {/* TABS */}
                        <div className="flex bg-gray-100/80 p-1.5 rounded-full mb-6 shadow-sm border border-gray-100">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-colors ${activeTab === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Pending {pendingCount > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingCount}</span>}
                            </button>
                            <button
                                onClick={() => setActiveTab('approved')}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-colors ${activeTab === 'approved' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Approved <span className="ml-1 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">{approvedCount}</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('rejected')}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-colors ${activeTab === 'rejected' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Rejected <span className="ml-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{rejectedCount}</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {displayedApps.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
                                    <User size={32} className="mx-auto mb-3 text-gray-400" />
                                    <p>No {activeTab} applications.</p>
                                </div>
                            ) : (
                                displayedApps.map(app => (
                                    <button
                                        key={app.id}
                                        onClick={() => setSelectedAppId(app.id)}
                                        className={`w-full text-left p-5 rounded-[1.5rem] transition-all hover:-translate-y-0.5 ${selectedAppId === app.id ? 'border border-green-500 bg-green-50 shadow-md shadow-green-600/10 scale-[1.02]' : 'border border-gray-100/50 hover:border-gray-200 bg-white shadow-sm hover:shadow-md'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold truncate pr-2 text-lg text-gray-900">{app.name}</h3>
                                            {getStatusBadge(app.status)}
                                        </div>
                                        <p className="text-sm text-gray-500 truncate font-medium">{app.email}</p>
                                        <p className="text-xs text-gray-400 mt-3 font-bold uppercase tracking-wider">{new Date(app.submittedAt).toLocaleDateString()}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Document Viewer */}
                    <div className="lg:col-span-2">
                        {selectedApp ? (
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 animate-fade-in">

                                {/* Header & Actions */}
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 border-b border-gray-100 pb-8 mb-8">
                                    <div>
                                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">{selectedApp.name}</h2>
                                        <p className="text-gray-500 font-medium">{selectedApp.email} <span className="mx-2 flex-inline items-center justify-center text-gray-300">•</span> <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-500 tracking-widest font-mono">ID: {selectedApp.id}</span></p>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedApp.status === 'Verified' ? (
                                            <button onClick={() => updateApplicationStatus(selectedApp.id, 'Rejected')} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-5 py-2.5 rounded-full font-bold transition-colors shadow-sm">
                                                <X size={18} /> Revoke Access
                                            </button>
                                        ) : (
                                            <>
                                                <button onClick={() => updateApplicationStatus(selectedApp.id, 'Verified', 50)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-bold transition-colors shadow-md shadow-green-600/20">
                                                    <Check size={18} /> Verify & Approve
                                                </button>
                                                <button onClick={() => updateApplicationStatus(selectedApp.id, 'Flagged')} className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-5 py-2.5 rounded-full font-bold transition-colors shadow-sm">
                                                    <Flag size={18} /> Flag Issue
                                                </button>
                                                <button onClick={() => updateApplicationStatus(selectedApp.id, 'Rejected')} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-5 py-2.5 rounded-full font-bold transition-colors shadow-sm">
                                                    <X size={18} /> Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h3 className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-wider">Background Declaration</h3>
                                        <div className="bg-gray-50 p-4 rounded-xl text-sm border border-gray-200 min-h-[100px]">
                                            {selectedApp.backgroundCheckDeclaration || <span className="text-gray-400 italic">No declaration provided.</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-wider">Organization Affiliation</h3>
                                        <div className="bg-gray-50 p-4 rounded-xl text-sm border border-gray-200 font-mono">
                                            {selectedApp.organizationAffiliation || <span className="text-gray-400 italic">None</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Signatures & Trust */}
                                <div className="flex flex-wrap gap-4 mb-8">
                                    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${selectedApp.termsSigned ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                        {selectedApp.termsSigned ? <Check size={20} className="text-green-600" /> : <AlertTriangle size={20} className="text-red-600" />}
                                        <span className="font-bold text-sm">Safe Food Handling Terms Signed</span>
                                    </div>
                                    {selectedApp.status === 'Verified' && (
                                        <div className="px-4 py-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl flex items-center gap-2 text-sm font-bold">
                                            <Shield size={20} className="text-blue-600" /> Initial Trust Score: {selectedApp.trustScore} / 100
                                        </div>
                                    )}
                                </div>

                                {/* Side-by-side Document Viewer */}
                                <h3 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-wider border-t pt-6">Identity Cross-Reference Viewer</h3>
                                <div className="grid md:grid-cols-2 gap-6 bg-gray-100 p-6 rounded-2xl border border-gray-200">
                                    <div>
                                        <span className="block text-center text-sm font-bold text-gray-500 mb-3">Govt Issued ID</span>
                                        <div className="bg-white rounded-xl aspect-[3/2] flex items-center justify-center overflow-hidden shadow-sm">
                                            {selectedApp.idImageUrl ? (
                                                <img src={selectedApp.idImageUrl} alt="ID" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-400">Missing</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-center text-sm font-bold text-gray-500 mb-3">Live Selfie Capture</span>
                                        <div className="bg-white rounded-xl aspect-[3/2] flex items-center justify-center overflow-hidden shadow-sm">
                                            {selectedApp.selfieUrl ? (
                                                <img src={selectedApp.selfieUrl} alt="Selfie" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-400">Missing</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-[2.5rem] border border-gray-200 border-dashed">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <Shield size={48} className="text-gray-300" />
                                </div>
                                <p className="text-2xl font-bold text-gray-600 tracking-tight">Select an application</p>
                                <p className="text-gray-500 mt-2 font-medium">Rigorous onboarding builds trust across our platform.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* COMPLETED DELIVERIES SECTION */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Check size={20} className="text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Completed Deliveries</h2>
                            <p className="text-gray-500 text-sm">Review proof photos and applaud your volunteers</p>
                        </div>
                    </div>

                    {completedDeliveries.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
                            <p>No completed deliveries yet.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {completedDeliveries.map(delivery => (
                                <div key={delivery.id} className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:border-green-200 transition-all">
                                    {delivery.deliveryProofUrl && (
                                        <img src={delivery.deliveryProofUrl} alt="Delivery proof" className="w-full h-40 object-cover rounded-xl mb-4 border border-gray-100" />
                                    )}
                                    <h3 className="text-lg font-bold text-gray-900">{delivery.item}</h3>
                                    <p className="text-green-600 font-medium text-sm">{delivery.quantity}</p>
                                    <p className="text-xs text-gray-400 mt-1 truncate">Delivered by: {delivery.claimedBy}</p>
                                    <p className="text-xs text-gray-400 truncate">Address: {delivery.address}</p>

                                    <div className="mt-4">
                                        {delivery.clappedByAdmin ? (
                                            <div className="flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-200 py-3 rounded-full">
                                                <span className="text-xl">👏</span>
                                                <span className="text-sm font-bold text-yellow-700">Applauded!</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => clapForDelivery(delivery.id)}
                                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-3 rounded-full hover:from-yellow-500 hover:to-orange-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                            >
                                                <span className="text-xl">👏</span> Clap for Volunteer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </Layout>
    );
};

export default AdminDashboard;
