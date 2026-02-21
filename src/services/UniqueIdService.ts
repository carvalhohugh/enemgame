import { customAlphabet } from 'nanoid';

// Custom alphabet for cleaner, readable IDs (no confusing chars like 0/O or 1/I)
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 10);

export const UniqueIdService = {
    generateStudentId: () => `STU-${nanoid()}`,
    generateTeacherId: () => `TEA-${nanoid()}`,
    generateSchoolId: () => `SCH-${nanoid()}`,
    generateTransactionId: () => `TRX-${nanoid()}`,
    generateContractId: () => `CTR-${nanoid()}`,

    // Generic ID with custom prefix
    generateId: (prefix: string) => `${prefix.toUpperCase()}-${nanoid()}`
};
