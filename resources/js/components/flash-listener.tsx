// components/FlashListener.tsx
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function FlashListener() {
    const { flash } = usePage().props as {
        flash?: {
            type: 'success' | 'error' | 'info';
            message: string;
        };
    };

    useEffect(() => {
        if (flash?.message) {
            toast[flash.type || 'info'](flash.message);
        }
    }, [flash]);

    return null;
}
