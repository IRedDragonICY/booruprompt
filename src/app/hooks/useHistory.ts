import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '../types/settings';
import type { HistoryEntry, ImageHistoryEntry, StoredHistoryItem, StoredImageHistoryItem } from '../types/history';
import { HISTORY_STORAGE_KEY, IMAGE_HISTORY_STORAGE_KEY } from '../constants';

export function useHistory(settings: Settings) {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [imageHistory, setImageHistory] = useState<ImageHistoryEntry[]>([]);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const loadStoredItem = <T,>(key: string, defaultValue: T, validator?: (item: unknown) => boolean): T => {
        if (typeof window === 'undefined') return defaultValue;
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        try {
            const parsed = JSON.parse(item);
            return validator ? (validator(parsed) ? parsed : defaultValue) : parsed;
        } catch {
            return defaultValue;
        }
    };

    useEffect(() => {
        const isValidHistory = (i: unknown): i is StoredHistoryItem[] => Array.isArray(i) && i.every(it => typeof it === 'object' && it !== null && 'id' in it && 'url' in it && 'timestamp' in it);
        const isValidImageHistory = (i: unknown): i is StoredImageHistoryItem[] => Array.isArray(i) && i.every(it => typeof it === 'object' && it !== null && 'id' in it && 'fileName' in it && 'timestamp' in it);

        setHistory(loadStoredItem<HistoryEntry[]>(HISTORY_STORAGE_KEY, [], isValidHistory).map(i => ({ ...i, tags: i.tags ?? {} })).sort((a, b) => b.timestamp - a.timestamp));
        setImageHistory(loadStoredItem<ImageHistoryEntry[]>(IMAGE_HISTORY_STORAGE_KEY, [], isValidImageHistory).map(i => ({ ...i, imageData: i.imageData ?? {} })).sort((a, b) => b.timestamp - a.timestamp));
    }, []);

    const saveHistoryToLocalStorage = useCallback((data: HistoryEntry[]) => {
        try {
            if (data.length > 0) localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data));
            else localStorage.removeItem(HISTORY_STORAGE_KEY);
        } catch (e) {
            console.error("Save tag history failed:", e);
            if (e instanceof Error && e.message.toLowerCase().includes('quota')) setHistoryError("History storage limit.");
        }
    }, []);

    const saveImageHistoryToLocalStorage = useCallback((data: ImageHistoryEntry[]) => {
        try {
            if (data.length > 0) localStorage.setItem(IMAGE_HISTORY_STORAGE_KEY, JSON.stringify(data));
            else localStorage.removeItem(IMAGE_HISTORY_STORAGE_KEY);
        } catch (e) {
            console.error("Save image history failed:", e);
            if (e instanceof Error && e.message.toLowerCase().includes('quota')) {
                setHistoryError("Image history storage limit.");
                setTimeout(() => setHistoryError(null), 3000);
            }
        }
    }, []);

    const addHistoryEntry = useCallback((entry: HistoryEntry) => {
        if (!settings.saveHistory) return;
        setHistory(prev => {
            const updated = [entry, ...prev.filter(h => h.url !== entry.url)];
            const maxSize = settings.maxHistorySize;
            const finalHistory = maxSize === -1 ? updated : updated.slice(0, maxSize);
            saveHistoryToLocalStorage(finalHistory);
            return finalHistory;
        });
    }, [settings.saveHistory, settings.maxHistorySize, saveHistoryToLocalStorage]);

    const addImageHistoryEntry = useCallback((entry: ImageHistoryEntry) => {
        if (!settings.saveHistory) return;
        setImageHistory(prev => {
            const updated = [entry, ...prev.filter(h => h.fileName !== entry.fileName || h.timestamp !== entry.timestamp)];
            const maxSize = settings.maxHistorySize;
            const finalHistory = maxSize === -1 ? updated : updated.slice(0, maxSize);
            saveImageHistoryToLocalStorage(finalHistory);
            return finalHistory;
        });
    }, [settings.saveHistory, settings.maxHistorySize, saveImageHistoryToLocalStorage]);

    const handleDeleteHistoryEntry = useCallback((id: string) => {
        setHistory(prev => {
            const updated = prev.filter(i => i.id !== id);
            saveHistoryToLocalStorage(updated);
            return updated;
        });
    }, [saveHistoryToLocalStorage]);

    const handleClearHistory = useCallback(() => {
        setHistory([]);
        saveHistoryToLocalStorage([]);
    }, [saveHistoryToLocalStorage]);

    const handleDeleteImageHistoryEntry = useCallback((id: string) => {
        setImageHistory(prev => {
            const updated = prev.filter(i => i.id !== id);
            saveImageHistoryToLocalStorage(updated);
            return updated;
        });
    }, [saveImageHistoryToLocalStorage]);

    const handleClearImageHistory = useCallback(() => {
        setImageHistory([]);
        saveImageHistoryToLocalStorage([]);
    }, [saveImageHistoryToLocalStorage]);

    return {
        history,
        imageHistory,
        historyError,
        addHistoryEntry,
        addImageHistoryEntry,
        handleDeleteHistoryEntry,
        handleClearHistory,
        handleDeleteImageHistoryEntry,
        handleClearImageHistory
    };
}
