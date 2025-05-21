
export interface PopupConfig {
  // RIMOSSO: baseUrl non è più configurabile dall'esterno
  widgetId?: string; 
  popupOptions?: {
    width?: number;
    height?: number;
    // Altre opzioni di window.open
  };
  onComplete?: (data: { status: 'success' | 'error'; message?: string }) => void;
  onClose?: () => void; 
}

// --- URL FISSO DELLA TUA APPLICAZIONE POPUP ---
// !!! MODIFICA QUESTO CON L'URL REALE DOVE LA TUA APP SOLIDSTART SARÀ OSPITATA !!!
const POPUP_APP_BASE_URL = 'http://localhost:3000/login'; // Esempio: URL di produzione
//const POPUP_APP_PATH = '/login'; // Il percorso specifico
// ------------------------------------------------

export function openTransactionPopup(config: PopupConfig = {}): void {
  // Estrai solo le configurazioni rimaste
  const { 
    widgetId, 
    popupOptions = {}, 
    onComplete, 

  } = config;

  // 1. Sapere chi utilizza l'SDK (come richiesto)
  const sdkUserOrigin = window.location.origin; 
  const sdkUserHref = window.location.href; 
  // Puoi usare queste variabili se ti servono, ad esempio per log o altro
  console.log(`Pulsix SDK chiamato da: Origin=${sdkUserOrigin}, Href=${sdkUserHref}`); 

  // 2. Usare l'URL fisso definito sopra
  let popupUrl = `${POPUP_APP_BASE_URL}`;
  if (widgetId) {
    const separator = popupUrl.includes('?') ? '&' : '?';
    popupUrl += `${separator}widgetId=${encodeURIComponent(widgetId)}`;
  }

  // 3. Imposta l'origine permessa per i messaggi in base all'URL fisso
  const allowedOrigin = new URL(POPUP_APP_BASE_URL).origin; 

  // Imposta dimensioni desiderate (dal tuo codice precedente)
  const desiredWidth = 500;  
  const desiredHeight = 700; 

  const defaultOptions = {
    width: desiredWidth,
    height: desiredHeight,
    left: window.screenX + (window.outerWidth - desiredWidth) / 2, 
    top: window.screenY + (window.outerHeight - desiredHeight) / 2, 
    scrollbars: 'yes',
  };
  const finalOptions = { ...defaultOptions, ...popupOptions };
  const windowFeatures = Object.entries(finalOptions)
  .map(([key, value]) => `${key}=${value}`) 
  .join(',');
  console.log('Window Features String:', windowFeatures);

  // Apri la popup con l'URL fisso
  console.log('openURL:', popupUrl)
  const popup = window.open(popupUrl, 'SolidStart_TransactionPopup', windowFeatures);

  // Gestione popup bloccata 
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    alert('Popup bloccata! Abilita le popup per questo sito per continuare.');
    return;
  }

  // Listener per messaggi dalla popup 
  let messageListener: ((event: MessageEvent) => void) | null = null;
  if (onComplete && typeof onComplete === 'function') {
    messageListener = (event: MessageEvent) => {
      // Usa allowedOrigin derivato dall'URL fisso della popup
      if (event.origin !== allowedOrigin) { 
        console.warn('Ignored message from unexpected origin:', event.origin, 'Expected:', allowedOrigin);
        return;
      }
      if (event.source !== popup) { /* ... */ return; }
      if (event.data && event.data.type === 'transactionComplete') {
        onComplete(event.data); 
        if (messageListener) { window.removeEventListener('message', messageListener); }
      }
    };
    window.addEventListener('message', messageListener, false);
  }


}