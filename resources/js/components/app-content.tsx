import { SidebarInset } from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/react';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({
    variant = 'header',
    children,
    ...props
}: AppContentProps) {
    // show flash messages globally
    const { flash } = usePage().props as any;

    // control visibility for auto-dismiss
    const [showFlash, setShowFlash] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (flash?.error || flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.error, flash?.success]);

    const messages = showFlash ? (
        <>
            {flash?.error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {flash.error}
                </div>
            )}
            {flash?.success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {flash.success}
                </div>
            )}
        </>
    ) : null;

    if (variant === 'sidebar') {
        return (
            <SidebarInset {...props}>
                {messages}
                {children}
            </SidebarInset>
        );
    }

    return (
        <main
            className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl"
            {...props}
        >
            {messages}
            {children}
        </main>
    );
}
