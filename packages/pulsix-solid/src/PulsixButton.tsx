import { Component, onMount, onCleanup, splitProps, mergeProps } from 'solid-js';
import type { PopupConfig } from 'pulsix';
import type { JSX } from 'solid-js';

// --- IMPORTA IL CSS MODULE ---
import './style.css'
// --------------------------

export interface PulsixButtonProps extends Omit<PopupConfig, 'onClose' /* ... */> {
  label?: string;
  class?: string; // Manteniamo la possibilità di aggiungere classi esterne
  style?: JSX.CSSProperties | string;
  disabled?: boolean;
  // Aggiungiamo di nuovo buttonColor per sovrascrivere il background di default
  buttonColor?: string;
}

export const PulsixButton: Component<PulsixButtonProps> = (props) => {
  // Unisci default e props
  const merged = mergeProps({ label: 'Apri Transazione' }, props);
  // Estrai le props per il popup, lascia le altre per il bottone
  const [popupOptions, buttonProps] = splitProps(merged, [
    "userId", "transactionDetails", /* ... */ "label"
  ]);
   // Estrai le props di stile specifiche
  const [localStyleProps, otherButtonProps] = splitProps(buttonProps, ["class", "style", "disabled", "buttonColor", "onClick"]);


  let buttonRef: HTMLButtonElement | undefined;

  onMount(() => {
    const handleClick = async () => { /* ... (logica import dinamico come prima) ... */ };

    if (buttonRef) {
      buttonRef.addEventListener('click', handleClick);
      // ... (cleanup come prima) ...
    }
  });

  // Calcola lo stile inline per il background color se fornito
  const inlineStyle = (): JSX.CSSProperties | string | undefined => {
      const baseStyle = typeof localStyleProps.style === 'string' ? {} : localStyleProps.style || {};
      if (localStyleProps.buttonColor && !localStyleProps.disabled) {
          return { ...baseStyle, 'background-color': localStyleProps.buttonColor };
      }
      return localStyleProps.style; // Ritorna lo stile originale se non c'è colore custom o è disabilitato
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      // --- USA IL CSS MODULE E CLASSI ESTERNE ---
      // Applica la classe base dal CSS Module e unisci eventuali classi passate tramite props
      class={`PulsixButton ${localStyleProps.class || ''}`}
      // Applica stili inline (sovrascrive il background del CSS module se buttonColor è impostato)
      style={inlineStyle()}
      disabled={localStyleProps.disabled}
      {...otherButtonProps} // Passa altri attributi/eventi non gestiti specificamente
    >
      {popupOptions.label}
    </button>
  );
};