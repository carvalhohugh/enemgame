import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '@/context/AuthProfileContext';
import ClanSortingForm from './ClanSortingForm';
import ClanReveal from './ClanReveal';

export default function ClanSortingPage() {
    const { profile } = useAuthProfile();
    const navigate = useNavigate();
    const [phase, setPhase] = useState<'sorting' | 'reveal'>('sorting');

    // If user already has a clan, redirect
    if (profile.clanId) {
        navigate('/app', { replace: true });
        return null;
    }

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center">
            {phase === 'sorting' ? (
                <ClanSortingForm onComplete={() => setPhase('reveal')} />
            ) : (
                <ClanReveal
                    clanId={profile.clanId!}
                    onContinue={() => navigate('/app')}
                />
            )}
        </div>
    );
}
