import { create } from 'zustand';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuthStore = create((set) => ({
    user: null,
    loading: true, 

    setUser: (user) => set({ user, loading: false }),

    clearUser: () => set({ user: null, loading: false }),

    // escuchar cambios de autenticación
    initializeAuth: () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                set({
                    user: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName
                    },
                    loading: false
                });
            } else {
                set({ user: null, loading: false });
            }
        });
    }
}));