// packages/pulsix/src/index.ts - VERSIONE MODIFICATA

import { openTransactionPopup } from './popup';
export { openTransactionPopup };
export type { PopupConfig } from './popup';

// === MODIFICA QUI: Importa usando il nuovo nome della variabile ===
import PulsixButtonClass from './button';

// Registra il Custom Element solo nel browser E se la classe è stata definita
// Usa la variabile importata (ora PulsixButtonClass)
if (typeof window !== 'undefined' && window.customElements && PulsixButtonClass && !window.customElements.get('pulsix-button')) {
  window.customElements.define('pulsix-button', PulsixButtonClass); // Usa la classe importata
  console.log('Custom element <pulsix-button> registrato.');
}

// === MODIFICA QUI: Esporta la classe con il nome desiderato "PulsixButton" ===
// Esporta la classe (sarà null sul server, la classe vera sul client)
export { PulsixButtonClass as PulsixButton };