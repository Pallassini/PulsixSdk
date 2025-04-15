// src/index.ts
// src/index.ts

// -------------------------------------------------------------------------
// PASSO 1: Esporta la logica principale e i tipi necessari
// È buona norma spostare la definizione di PopupConfig e openTransactionPopup 
// in un file separato, ad esempio "src/popup.ts", e poi importarli qui.
// Assumiamo che tu l'abbia fatto:

import { openTransactionPopup } from './popup'; // Importa da dove hai messo la funzione
export { openTransactionPopup };               // Riesporta per l'utente

// Esporta anche il tipo PopupConfig perché serve al Web Component e all'utente
export type { PopupConfig } from './popup';    // Esporta da dove hai messo l'interfaccia
// -------------------------------------------------------------------------


// -------------------------------------------------------------------------
// PASSO 2: Importa la classe del tuo Web Component
import button from './button';
// -------------------------------------------------------------------------
///
////ds
// -------------------------------------------------------------------------
// PASSO 3: Registra il Custom Element nel browser
// Questo rende il tag <pulsix-button> utilizzabile nell'HTML

// Facciamo dei controlli per sicurezza:
// - typeof window !== 'undefined': Assicura che siamo in un ambiente browser
// - window.customElements: Verifica che il browser supporti i Custom Elements
// - !window.customElements.get('pulsix-button'): Evita errori se l'elemento è già stato registrato 
//   (utile se il tuo script viene caricato più volte o con Hot Module Replacement)
if (typeof window !== 'undefined' && window.customElements && !window.customElements.get('pulsix-button')) {
  
  // Definisce il tag 'pulsix-button' e lo associa alla classe PulsixButton
  window.customElements.define('pulsix-button', button);
  
  console.log('Custom element <pulsix-button> registrato.'); 
}
// -------------------------------------------------------------------------


// -------------------------------------------------------------------------
// PASSO 4: (Opzionale) Esporta la classe del Web Component
// Potrebbe essere utile se qualcuno volesse estenderla o registrarla manualmente
export { button };
// -------------------------------------------------------------------------


// NOTA IMPORTANTE: 
// Il codice che definisce effettivamente openTransactionPopup 
// (con le costanti POPUP_APP_BASE_URL, POPUP_APP_PATH, il calcolo di allowedOrigin, 
// window.open, i listener, ecc.) e l'interfaccia PopupConfig dovrebbe ora
// trovarsi nel file "src/popup.ts" (o un altro nome che scegli) e essere importato qui.
// Questo rende src/index.ts più pulito e dedicato solo a definire l'interfaccia pubblica del tuo SDK.