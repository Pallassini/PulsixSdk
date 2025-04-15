import { Component, onMount, onCleanup, splitProps } from 'solid-js';
// Assicurati che openTransactionPopup e PopupConfig siano importati correttamente
import { openTransactionPopup, PopupConfig } from 'pulsix';
import type { JSX } from 'solid-js';

export interface PulsixButtonProps extends Omit<PopupConfig, 'onClose' /* ... */> {
  label?: string;
  class?: string;
  style?: JSX.CSSProperties | string;
  disabled?: boolean; // Aggiungi la prop disabled se vuoi poterla passare
}

export const PulsixButton: Component<PulsixButtonProps> = (props) => {
  const [popupOptions, buttonProps] = splitProps(props, [
    "userId", "transactionDetails", /* ...altre opzioni PopupConfig... */ "label"
  ]);

  // Riferimento all'elemento bottone HTML
  let buttonRef: HTMLButtonElement | undefined;

  // Definisci l'handler separatamente
  const handleClick = () => {
    // Questo codice ora verrà chiamato solo sul client quando si clicca
    console.log("Opening popup from client-side handler with options:", popupOptions);
    openTransactionPopup({
      userId: popupOptions.userId,
      transactionDetails: popupOptions.transactionDetails,
      // ... pass other options ...
    });
  };

  onMount(() => {
    // Aggiungi l'event listener *solo* nel browser quando il componente è montato
    if (buttonRef) {
      buttonRef.addEventListener('click', handleClick);
      console.log("PulsixButton (Solid Wrapper): Click listener added on mount.");

      // Cleanup: Rimuovi il listener quando il componente viene smontato
      onCleanup(() => {
        if (buttonRef) {
          buttonRef.removeEventListener('click', handleClick);
          console.log("PulsixButton (Solid Wrapper): Click listener removed on cleanup.");
        }
      });
    }
  });

  // Renderizza un bottone standard SolidJS, assegnando il ref
  return (
    <button
      ref={buttonRef} // Assegna il ref all'elemento bottone
      type="button"
      // Non assegnare onClick qui, lo facciamo in onMount
      class={buttonProps.class}
      style={buttonProps.style}
      disabled={props.disabled} // Passa la prop disabled
      {...buttonProps} // Passa eventuali altre props HTML standard
    >
      {popupOptions.label || 'Apri Transazione'}
    </button>
  );
};