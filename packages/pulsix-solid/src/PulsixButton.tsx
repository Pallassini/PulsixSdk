// PulsixButton.tsx (Nella tua cartella src/...)

import { Component, onMount, onCleanup, splitProps, mergeProps } from 'solid-js';
// Importa SOLO i tipi staticamente, se possibile
import type { PopupConfig } from 'pulsix';
import type { JSX } from 'solid-js';

// --- IMPORTA IL FILE CSS (Globale ma co-locato) ---
import './style.css'; // Assicurati che style.css sia nella stessa cartella
// ---------------------------------------------------

export interface PulsixButtonProps extends Omit<PopupConfig, 'onClose' /* ... */> {
  label?: string;
  class?: string; // Per classi CSS esterne aggiuntive
  style?: JSX.CSSProperties | string; // Per stili inline esterni
  disabled?: boolean;
  buttonColor?: string; // Per sovrascrivere il colore di sfondo base
}

export const PulsixButton: Component<PulsixButtonProps> = (props) => {
  // Unisci default e props
  const merged = mergeProps({ label: 'Apri Transazione' }, props);
  // Estrai le props per il popup (usate in handleClick)
  const [popupOptions, buttonProps] = splitProps(merged, [
    "userId", "transactionDetails", /* ...altre opzioni PopupConfig... */ "label"
  ]);
   // Estrai le props di stile/classe specifiche
  const [localStyleProps, otherButtonProps] = splitProps(buttonProps, ["class", "style", "disabled", "buttonColor", "onClick"]);

  let buttonRef: HTMLButtonElement | undefined;

  onMount(() => {
    // Definisci handleClick qui dentro per usare popupOptions aggiornate
    const handleClick = async () => {
        if (localStyleProps.disabled) return; // Verifica lo stato disabled qui

        console.log("Client button clicked. Dynamically importing pulsix...");
        try {
            const pulsixModule = await import('pulsix');
            console.log("Pulsix module loaded. Calling openTransactionPopup with options:", popupOptions);
            // Chiama la funzione dal modulo importato dinamicamente
            pulsixModule.openTransactionPopup({
                userId: popupOptions.userId,
                transactionDetails: popupOptions.transactionDetails,
                // ... passa altre opzioni ...
            });
        } catch (error) {
            console.error("Error loading or calling pulsix module:", error);
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
    } else {
        console.warn("PulsixButton (Solid Wrapper): buttonRef not available onMount to add listener.");
    }
  });

  // Calcola lo stile inline per il background color se fornito
  const inlineStyle = (): JSX.CSSProperties | string | undefined => {
      const baseStyle = typeof localStyleProps.style === 'string' ? {} : localStyleProps.style || {};
      // Applica il colore custom solo se non disabilitato
      if (localStyleProps.buttonColor && !localStyleProps.disabled) {
          // Aggiungi !important anche qui se vuoi che sovrascriva SEMPRE anche eventuali !important nel CSS esterno
          // ma è ancora meno raccomandato. Normalmente lo stile inline vince sul CSS esterno (a meno che il CSS esterno non usi !important).
          return { ...baseStyle, 'background-color': localStyleProps.buttonColor };
      }
      return localStyleProps.style;
  };

   // Combina la classe specifica del componente con eventuali classi esterne
  const buttonClasses = () => `pulsixButton ${localStyleProps.class || ''}`.trim();


  return (
    <button
      ref={buttonRef}
      type="button"
      // Applica la classe base globale e le classi esterne
      class={buttonClasses()}
      // Applica stili inline (per buttonColor o style esterno)
      style={{"background-color":'black',color:'red',"text-align":'center',padding:'120px'}}
      disabled={localStyleProps.disabled}
      {...otherButtonProps} // Passa altri attributi/eventi non gestiti specificamente
    >
      {/* Usa la prop label estratta da popupOptions */}
      {popupOptions.label}
    </button>
  );
};

// Esporta il componente se necessario (es. da un index.ts nella cartella)
// export default PulsixButton; // O export { PulsixButton };