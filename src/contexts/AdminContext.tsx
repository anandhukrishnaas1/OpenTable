import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';

export type ApplicationStatus = 'Pending' | 'Verified' | 'Flagged' | 'Rejected';

export interface VolunteerApplication {
    id: string;
    name: string;
    email: string;
    idImageUrl: string | null;
    selfieUrl: string | null;
    backgroundCheckDeclaration: string;
    organizationAffiliation: string;
    termsSigned: boolean;
    status: ApplicationStatus;
    trustScore: number;
    submittedAt: Date;
}

interface AdminContextType {
    applications: VolunteerApplication[];
    submitApplication: (app: Omit<VolunteerApplication, 'id' | 'status' | 'trustScore' | 'submittedAt'>) => void;
    updateApplicationStatus: (id: string, status: ApplicationStatus, score?: number) => void;
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType);

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [applications, setApplications] = useState<VolunteerApplication[]>([]);

    useEffect(() => {
        console.log("AdminContext: Setting up Firestore listener on 'applications' collection...");
        const q = collection(db, 'applications');
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const apps: VolunteerApplication[] = [];
            snapshot.forEach((docSnap) => {
                apps.push({ id: docSnap.id, ...docSnap.data() } as VolunteerApplication);
            });
            // Sort to show pending first, or by date
            apps.sort((a, b) => {
                const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
                const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
                return timeB - timeA;
            });
            console.log("AdminContext: Loaded", apps.length, "applications from Firestore:", apps.map(a => ({ id: a.id, status: a.status, email: a.email })));
            setApplications(apps);
        }, (error) => {
            console.error("AdminContext: Firestore onSnapshot ERROR:", error.code, error.message);
            console.error("This usually means your Firestore Security Rules are blocking reads. Go to Firebase Console → Firestore → Rules and allow authenticated read/write.");
        });
        return () => unsubscribe();
    }, []);

    const submitApplication = async (appData: Omit<VolunteerApplication, 'id' | 'status' | 'trustScore' | 'submittedAt'>) => {
        try {
            const newId = Math.random().toString(36).substr(2, 9);
            const appRef = doc(db, 'applications', newId);
            const payload = {
                ...appData,
                status: 'Pending',
                trustScore: 0,
                submittedAt: new Date().toISOString()
            };
            console.log("Submitting application to Firestore:", newId, payload);
            await setDoc(appRef, payload);
            console.log("Application saved successfully:", newId);
        } catch (error: any) {
            console.error("Error submitting application to Firestore:", error.code, error.message);
            throw error;
        }
    };

    const updateApplicationStatus = async (id: string, status: ApplicationStatus, score?: number) => {
        try {
            const appRef = doc(db, 'applications', id);
            const updatePayload: any = { status };
            if (score !== undefined) {
                updatePayload.trustScore = score;
            }
            await updateDoc(appRef, updatePayload);
        } catch (error) {
            console.error("Error updating application status:", error);
        }
    };

    return (
        <AdminContext.Provider value={{ applications, submitApplication, updateApplicationStatus }}>
            {children}
        </AdminContext.Provider>
    );
};
