const STORAGE_KEY = 'student_xp';

export const XPService = {
    getXP: (): number => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? parseInt(stored, 10) : 15450; // Mock initial value
    },

    addXP: (amount: number): number => {
        const current = XPService.getXP();
        const updated = current + amount;
        localStorage.setItem(STORAGE_KEY, updated.toString());

        // Dispatch custom event for real-time UI updates across components
        window.dispatchEvent(new CustomEvent('xp_updated', { detail: updated }));

        return updated;
    },

    resetXP: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
