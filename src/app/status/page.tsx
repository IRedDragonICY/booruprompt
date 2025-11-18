import StatusView from '../components/StatusView';

export const metadata = {
    title: 'API Status - BooruPrompt',
    description: 'Real-time status monitoring for all supported booru sites',
};

export default function StatusPage() {
    return (
        <div className="h-screen w-full bg-[rgb(var(--color-surface-rgb))]">
            <StatusView />
        </div>
    );
}
