import { supabase } from '@/lib/supabase';

// ---- Types ----

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    duration_months: number;
    max_students: number | null;
    features: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface School {
    id: string;
    name: string;
    cnpj: string;
    city: string;
    state: string;
    contact_email: string;
    contact_phone: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Teacher {
    id: string;
    full_name: string;
    email: string;
    subject: string;
    school_id: string | null;
    school_name?: string;
    school_name?: string;
    coupon_code?: string;
    commission_rate?: number; // percentage
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface StudentEnrollment {
    userId: string;
    fullName: string;
    email: string;
    planId: string | null;
    schoolId: string | null;
    teacherId: string | null;
}

// ---- Helpers ----

function assertSupabase() {
    if (!supabase) {
        throw new Error('Supabase não configurado.');
    }
    return supabase;
}

// ---- Mock Data (fallback when Supabase tables don't exist) ----

const MOCK_PLANS: Plan[] = [
    { id: '1', name: 'Gratuito', description: 'Acesso básico à plataforma', price: 0, duration_months: 12, max_students: null, features: ['Questões limitadas', 'Ranking básico'], is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', name: 'Estudante', description: 'Acesso completo individual', price: 29.90, duration_months: 1, max_students: 1, features: ['Questões ilimitadas', 'Correção de redação AI', 'Simulados', 'Analytics avançado'], is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '3', name: 'Escola Básico', description: 'Até 50 alunos', price: 499.90, duration_months: 6, max_students: 50, features: ['Painel administrativo', 'Relatórios por turma', 'Suporte prioritário'], is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '4', name: 'Escola Premium', description: 'Até 200 alunos + funcionalidades avançadas', price: 999.90, duration_months: 12, max_students: 200, features: ['Tudo do Escola Básico', 'API de integração', 'White-label', 'Gerente de conta'], is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const MOCK_SCHOOLS: School[] = [
    { id: '1', name: 'Colégio Dom Bosco', cnpj: '12.345.678/0001-00', city: 'Goiânia', state: 'GO', contact_email: 'contato@dombosco.edu.br', contact_phone: '(62) 3333-4444', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', name: 'Escola Municipal São Paulo', cnpj: '', city: 'Aparecida de Goiânia', state: 'GO', contact_email: 'secretaria@emsaopaulo.edu.br', contact_phone: '(62) 3222-1111', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const MOCK_TEACHERS: Teacher[] = [
    { id: '1', full_name: 'Prof. Maria Silva', email: 'maria.silva@dombosco.edu.br', subject: 'Matemática', school_id: '1', school_name: 'Colégio Dom Bosco', coupon_code: 'MARIA10', commission_rate: 10, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', full_name: 'Prof. João Santos', email: 'joao.santos@emsaopaulo.edu.br', subject: 'Redação', school_id: '2', school_name: 'Escola Municipal São Paulo', coupon_code: 'JOAO2024', commission_rate: 15, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// ---- CRUD Operations ----

export const AdminCrudService = {
    // ---- Plans ----
    async listPlans(): Promise<Plan[]> {
        try {
            const sb = assertSupabase();
            const { data, error } = await sb.from('plans').select('*').order('price', { ascending: true });
            if (error) throw error;
            return data as Plan[];
        } catch {
            return [...MOCK_PLANS];
        }
    },

    async createPlan(plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>): Promise<Plan> {
        try {
            const sb = assertSupabase();
            const { data, error } = await sb.from('plans').insert(plan).select().single();
            if (error) throw error;
            return data as Plan;
        } catch {
            const newPlan: Plan = { ...plan, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
            MOCK_PLANS.push(newPlan);
            return newPlan;
        }
    },

    async updatePlan(id: string, updates: Partial<Plan>): Promise<void> {
        try {
            const sb = assertSupabase();
            const { error } = await sb.from('plans').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
            if (error) throw error;
        } catch {
            const idx = MOCK_PLANS.findIndex(p => p.id === id);
            if (idx >= 0) MOCK_PLANS[idx] = { ...MOCK_PLANS[idx], ...updates, updated_at: new Date().toISOString() };
        }
    },

    async deletePlan(id: string): Promise<void> {
        try {
            const sb = assertSupabase();
            const { error } = await sb.from('plans').delete().eq('id', id);
            if (error) throw error;
        } catch {
            const idx = MOCK_PLANS.findIndex(p => p.id === id);
            if (idx >= 0) MOCK_PLANS.splice(idx, 1);
        }
    },

    // ---- Schools ----
    async listSchools(): Promise<School[]> {
        try {
            const sb = assertSupabase();
            const { data, error } = await sb.from('schools').select('*').order('name');
            if (error) throw error;
            return data as School[];
        } catch {
            return [...MOCK_SCHOOLS];
        }
    },

    async createSchool(school: Omit<School, 'id' | 'created_at' | 'updated_at'>): Promise<School> {
        try {
            const sb = assertSupabase();
            const { data, error } = await sb.from('schools').insert(school).select().single();
            if (error) throw error;
            return data as School;
        } catch {
            const newSchool: School = { ...school, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
            MOCK_SCHOOLS.push(newSchool);
            return newSchool;
        }
    },

    async updateSchool(id: string, updates: Partial<School>): Promise<void> {
        try {
            const sb = assertSupabase();
            const { error } = await sb.from('schools').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
            if (error) throw error;
        } catch {
            const idx = MOCK_SCHOOLS.findIndex(s => s.id === id);
            if (idx >= 0) MOCK_SCHOOLS[idx] = { ...MOCK_SCHOOLS[idx], ...updates, updated_at: new Date().toISOString() };
        }
    },

    async deleteSchool(id: string): Promise<void> {
        try {
            const sb = assertSupabase();
            const { error } = await sb.from('schools').delete().eq('id', id);
            if (error) throw error;
        } catch {
            const idx = MOCK_SCHOOLS.findIndex(s => s.id === id);
            if (idx >= 0) MOCK_SCHOOLS.splice(idx, 1);
        }
    },

    // ---- Teachers ----
    async listTeachers(): Promise<Teacher[]> {
        try {
            const sb = assertSupabase();
            const { data, error } = await sb.from('teachers').select('*, schools(name)').order('full_name');
            if (error) throw error;
            return (data || []).map((t: any) => ({ ...t, school_name: t.schools?.name || '' })) as Teacher[];
        } catch {
            return [...MOCK_TEACHERS];
        }
    },

    async createTeacher(teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at' | 'school_name'>): Promise<Teacher> {
        try {
            const sb = assertSupabase();
            const { data, error } = await sb.from('teachers').insert(teacher).select().single();
            if (error) throw error;
            return data as Teacher;
        } catch {
            const newTeacher: Teacher = { ...teacher, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
            MOCK_TEACHERS.push(newTeacher);
            return newTeacher;
        }
    },

    async updateTeacher(id: string, updates: Partial<Teacher>): Promise<void> {
        try {
            const sb = assertSupabase();
            const { error } = await sb.from('teachers').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
            if (error) throw error;
        } catch {
            const idx = MOCK_TEACHERS.findIndex(t => t.id === id);
            if (idx >= 0) MOCK_TEACHERS[idx] = { ...MOCK_TEACHERS[idx], ...updates, updated_at: new Date().toISOString() };
        }
    },

    async deleteTeacher(id: string): Promise<void> {
        try {
            const sb = assertSupabase();
            const { error } = await sb.from('teachers').delete().eq('id', id);
            if (error) throw error;
        } catch {
            const idx = MOCK_TEACHERS.findIndex(t => t.id === id);
            if (idx >= 0) MOCK_TEACHERS.splice(idx, 1);
        }
    },

    // ---- Student Enrollment ----
    async enrollStudent(enrollment: StudentEnrollment): Promise<void> {
        try {
            const sb = assertSupabase();
            const { error } = await sb.from('profiles').update({
                plan_id: enrollment.planId,
                school_id: enrollment.schoolId,
                teacher_id: enrollment.teacherId,
                updated_at: new Date().toISOString(),
            }).eq('id', enrollment.userId);
            if (error) throw error;
        } catch {
            console.warn('Mock enrollment: student', enrollment.userId);
        }
    },
};
