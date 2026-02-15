import HeroDashboard from './components/HeroDashboard';
import RankingSection from './components/RankingSection';
import BadgesSection from './components/BadgesSection';
import ClanDashboard from '@/features/clans/ClanDashboard';
import { useAuthProfile } from '@/context/AuthProfileContext';

export default function DashboardPage() {
    const { profile } = useAuthProfile();

    return (
        <div className="space-y-12">
            <HeroDashboard />
            {profile.clanId && <ClanDashboard />}
            <div className="grid lg:grid-cols-2 gap-8">
                <RankingSection />
                <BadgesSection />
            </div>
        </div>
    );
}
