import { Component, onMount, onCleanup, splitProps } from 'solid-js';
// Importa SOLO i tipi staticamente, se possibile
import type { PopupConfig } from 'pulsix';
import type { JSX } from 'solid-js';

export interface PulsixButtonProps extends Omit<PopupConfig, 'onClose' /* ... */> {
  label?: string;
  class?: string;
  style?: JSX.CSSProperties | string;
  disabled?: boolean;
}

export const PulsixButton: Component<PulsixButtonProps> = (props) => {
  const [popupOptions, buttonProps] = splitProps(props, [
    "userId", "transactionDetails", /* ...altre opzioni PopupConfig... */ "label"
  ]);

  let buttonRef: HTMLButtonElement | undefined;

  onMount(() => {
    // Definisci handleClick qui dentro
    const handleClick = async () => { // Rendi la funzione async
      console.log("Client button clicked. Dynamically importing pulsix...");
      try {
        // --- IMPORT DINAMICO QUI ---
        const pulsixModule = await import('pulsix');
        // --------------------------

        console.log("Pulsix module loaded. Calling openTransactionPopup with options:", popupOptions);
        // Chiama la funzione dal modulo importato dinamicamente
        pulsixModule.openTransactionPopup({
          userId: popupOptions.userId,
          transactionDetails: popupOptions.transactionDetails,
          // ... pass other options ...
        });
      } catch (error) {
        console.error("Error loading or calling pulsix module:", error);
        // Gestisci l'errore, magari mostrando un messaggio all'utente
      }
    };

    if (buttonRef) {
      buttonRef.addEventListener('click', handleClick);
      console.log("PulsixButton (Solid Wrapper): Click listener added (dynamic import handler).");

      onCleanup(() => {
        if (buttonRef) {
          buttonRef.removeEventListener('click', handleClick);
          console.log("PulsixButton (Solid Wrapper): Click listener removed (dynamic import handler).");
        }
      });
    }
  });

  return (
    <button
      ref={buttonRef}
      type="button"
      class={buttonProps.class}
      style={buttonProps.style}
      disabled={props.disabled}
      {...buttonProps}
    >
      {popupOptions.label || 'Apri Transazione'}
    </button>
  );
};