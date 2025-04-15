export interface PopupConfig {
    widgetId?: string;
    popupOptions?: {
        width?: number;
        height?: number;
    };
    onComplete?: (data: {
        status: 'success' | 'error';
        message?: string;
    }) => void;
    onClose?: () => void;
}
export declare function openTransactionPopup(config?: PopupConfig): void;
