import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DonationItem {
  id: string;
  item: string;
  category: string;
  quantity: string;
  donorType: string;
  phone: string;
  address: string;
  status: 'active' | 'claimed'; 
  timestamp: Date;
  imageUrl?: string;
}

interface DonationContextType {
  donations: DonationItem[];
  addDonation: (donation: DonationItem) => void;
  claimDonation: (id: string) => void;
}

const DonationContext = createContext<DonationContextType>({} as DonationContextType);

export const useDonations = () => useContext(DonationContext);

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage if available, or start empty
  const [donations, setDonations] = useState<DonationItem[]>(() => {
    const saved = localStorage.getItem('donations');
    return saved ? JSON.parse(saved, (key, value) => key === 'timestamp' ? new Date(value) : value) : [];
  });

  // Save to localStorage whenever donations change
  useEffect(() => {
    localStorage.setItem('donations', JSON.stringify(donations));
  }, [donations]);

  const addDonation = (donation: DonationItem) => {
    setDonations((prev) => [donation, ...prev]);
  };

  const claimDonation = (id: string) => {
    setDonations((prev) => 
      prev.map(item => item.id === id ? { ...item, status: 'claimed' } : item)
    );
  };

  return (
    <DonationContext.Provider value={{ donations, addDonation, claimDonation }}>
      {children}
    </DonationContext.Provider>
  );
};