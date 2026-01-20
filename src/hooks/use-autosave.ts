import { toast } from '@/hooks/use-toast';

export const useAutosave = (key: string, data: any, interval: number = 2000) => {
    useEffect(() => {
        const handler = setTimeout(() => {
            if (data) {
                const savedDrafts = localStorage.getItem(key);
                let drafts = savedDrafts ? JSON.parse(savedDrafts) : [];

                // Add new draft to top, keep last 10
                drafts = [data, ...drafts].slice(0, 10);

                localStorage.setItem(key, JSON.stringify(drafts));
                // Optional: dispatch event or toast if needed, but keeping it silent is "sleek"
                // Only toast on deliberate save
            }
        }, interval);

        return () => clearTimeout(handler);
    }, [key, data, interval]);
};
