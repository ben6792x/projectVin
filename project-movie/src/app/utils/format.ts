export const formatDuration = (ms: number): string => {
    // Nếu dưới 1 giây
    if (ms < 1000) {
        return `${ms}ms`;
    }

    // Nếu dưới 1 phút
    if (ms < 60000) {
        const seconds = Math.floor(ms / 1000);
        return `${seconds}s`;
    }

    // Nếu dưới 1 giờ
    if (ms < 3600000) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }

    // Nếu trên 1 giờ
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
};