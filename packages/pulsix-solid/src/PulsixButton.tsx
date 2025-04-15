import { Component, splitProps } from 'solid-js';
// Importa la funzione e il tipo che SONO esportati da 'pulsix'
import { openTransactionPopup, PopupConfig } from 'pulsix';
import type { JSX } from 'solid-js';

// Definisci le props necessarie per chiamare openTransactionPopup
// Assumendo che PopupConfig contenga userId, etc.
// Rimuovi le props che non servono più (es. quelle specifiche di createPulsixButton se c'erano)
export interface PulsixButtonProps extends Omit<PopupConfig, 'onClose' /* o altre gestite internamente */> {
  // Forse vuoi un'etichetta per il bottone Solid
  label?: string;
  // Props HTML standard
  class?: string;
  style?: JSX.CSSProperties | string;
  // Aggiungi qui altre props HTML se necessario (id, disabled, etc.)
}

export const PulsixButton: Component<PulsixButtonProps> = (props) => {
  // Separa le props per openTransactionPopup dalle props HTML per il bottone
  const [popupOptions, buttonProps] = splitProps(props, [
    "userId", // Elenca qui tutte le proprietà di PopupConfig che ricevi come props
    "transactionDetails", // Esempio, aggiungi le altre opzioni di PopupConfig
    // ... altre opzioni ...
    "label", // Includi label qui se la gestisci separatamente
  ]);

  const handleClick = () => {
    // Chiama la funzione esportata quando il bottone viene cliccato
    openTransactionPopup({
      userId: popupOptions.userId,
      transactionDetails: popupOptions.transactionDetails, // Passa le altre opzioni
      // Potresti voler aggiungere qui handler onClose o altri specifici per il wrapper
      // onClose: () => { console.log("Popup chiuso dal wrapper Solid"); }
    });
  };

  // Renderizza un bottone standard SolidJS
  return (
    <button
      type="button" // Buona pratica per bottoni non di submit
      onClick={handleClick}
      class={buttonProps.class} // Usa le props HTML rimanenti
      style={buttonProps.style}
      // disabled={...} // Puoi aggiungere logica per disabilitare
      {...buttonProps} // Passa eventuali altre props HTML standard
    >
      {popupOptions.label || 'Apri Transazione'} {/* Usa la label fornita o una default */}
    </button>
  );
};