import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';

export interface DonationItem {
  id: string;
  item: string;
  category: string;
  quantity: string;
  donorType: string;
  phone: string;
  address: string;
  status: 'active' | 'claimed' | 'delivered';
  timestamp: Date;
  imageUrl?: string;
  claimedBy?: string;
  deliveryProofUrl?: string;
}

interface DonationContextType {
  donations: DonationItem[];
  addDonation: (item: DonationItem) => void;
  claimDonation: (id: string, volunteerEmail: string) => void;
  completeDelivery: (id: string, proofUrl: string) => void;
}

export const DonationContext = React.createContext<DonationContextType>({} as DonationContextType);

export const useDonations = () => React.useContext(DonationContext);

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [donations, setDonations] = useState<DonationItem[]>([]);

  useEffect(() => {
    const q = collection(db, 'donations');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: DonationItem[] = [];
      querySnapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as DonationItem);
      });
      // Sort by newest first based on timestamp (assuming timestamp is a Date string or Firebase Timestamp)
      items.sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      });
      setDonations(items);
    });

    return () => unsubscribe();
  }, []);

  const addDonation = async (item: DonationItem) => {
    try {
      // Use the pre-generated ID or a new one
      const donationRef = doc(db, 'donations', item.id || Math.random().toString(36).substr(2, 9));
      // Convert Date object to string or Timestamp if needed, but setDoc handles JS Dates gracefully sometimes. Just in case:
      await setDoc(donationRef, {
        ...item,
        timestamp: item.timestamp instanceof Date ? item.timestamp.toISOString() : item.timestamp
      });
    } catch (error) {
      console.error("Error adding donation:", error);
    }
  };

  const claimDonation = async (id: string, volunteerEmail: string) => {
    try {
      const donationRef = doc(db, 'donations', id);
      await updateDoc(donationRef, {
        status: 'claimed',
        claimedBy: volunteerEmail
      });
    } catch (error) {
      console.error("Error claiming donation:", error);
    }
  };

  const completeDelivery = async (id: string, proofUrl: string) => {
    try {
      const donationRef = doc(db, 'donations', id);
      await updateDoc(donationRef, {
        status: 'delivered',
        deliveryProofUrl: proofUrl
      });
    } catch (error) {
      console.error("Error completing delivery:", error);
    }
  };

  return (
    <DonationContext.Provider value={{ donations, addDonation, claimDonation, completeDelivery }}>
      {children}
    </DonationContext.Provider>
  );
};