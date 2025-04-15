// packages/pulsix/src/index.ts

import { openTransactionPopup } from './popup';
export { openTransactionPopup };
export type { PopupConfig } from './popup';

// Importa la classe (o null se non siamo nel browser)
import ButtonClass from './button';

// Registra il Custom Element solo nel browser E se la classe è stata definita
if (typeof window !== 'undefined' && window.customElements && ButtonClass && !window.customElements.get('pulsix-button')) {
  window.customElements.define('pulsix-button', ButtonClass);
  console.log('Custom element <pulsix-button> registrato.');
}

// Esporta la classe (sarà null sul server, la classe vera sul client)
// Nota: chi importa 'button' dovrà gestire il caso in cui sia null se lo usa direttamente.
// Per il componente Solid che usa openTransactionPopup, questo export non è più rilevante.
export { ButtonClass as button }; // Esporta come 'button' per coerenza precedente, se serve