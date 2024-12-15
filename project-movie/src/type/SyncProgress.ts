interface SyncProgress {
    slug: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    startTime?: number;
    endTime?: number;
    error?: string;
}