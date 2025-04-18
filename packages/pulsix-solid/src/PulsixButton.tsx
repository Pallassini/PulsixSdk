// PulsixButton.tsx (Versione con Stili Inline e Simulazione Stati)

import { Component, createSignal, splitProps, mergeProps } from 'solid-js';
// Importa SOLO i tipi staticamente
import type { PopupConfig } from 'pulsix';
import type { JSX } from 'solid-js';

// Rimuovi l'import del file CSS
// import './style.css';

export interface PulsixButtonProps extends Omit<PopupConfig, 'onClose' /* ... */> {
  label?: string;
  class?: string; // Per classi CSS esterne aggiuntive
  style?: JSX.CSSProperties | string; // Per stili inline esterni aggiuntivi
  disabled?: boolean;
  buttonColor?: string; // Colore base personalizzato
}

export const PulsixButton: Component<PulsixButtonProps> = (props) => {
  // --- Gestione Stato Interno per Hover/Active ---
  const [isHovered, setIsHovered] = createSignal(false);
  const [isActive, setIsActive] = createSignal(false);
  // ---------------------------------------------

  const merged = mergeProps({ label: 'Apri Transazione', buttonColor: '#007bff' }, props); // Default anche per colore
  const [popupOptions, buttonProps] = splitProps(merged, [
    "userId", "transactionDetails", /* ... */ "label"
  ]);
  const [localStyleProps, otherButtonProps] = splitProps(buttonProps, ["class", "style", "disabled", "buttonColor", "onClick", /* Estrai anche gli eventi mouse/focus */ "onMouseEnter", "onMouseLeave", "onMouseDown", "onMouseUp", "onFocus", "onBlur"]);

  let buttonRef: HTMLButtonElement | undefined;

  // --- Logica Click (invariata, ma ora non dipende più da onMount per essere aggiunta) ---
  const handleClick = async (event: MouseEvent) => {
      if (localStyleProps.disabled) return;

      console.log("Client button clicked. Dynamically importing pulsix...");
      try {
          const pulsixModule = await import('pulsix');
          console.log("Pulsix module loaded...");
          pulsixModule.openTransactionPopup({
              userId: popupOptions.userId,
              transactionDetails: popupOptions.transactionDetails,
              // ...
          });
           // Chiama l'onClick esterno se fornito
          if (typeof localStyleProps.onClick === 'function') {
                (localStyleProps.onClick)(event);
          } else if (Array.isArray(localStyleProps.onClick)) {
                localStyleProps.onClick[0](localStyleProps.onClick[1], event);
          }
      } catch (error) { console.error("Error:", error); }
  };
  // -------------------------------------------------------

  // --- Stili di Base come Oggetto JS ---
  const baseStyle = {
     display: 'inline-block',
     'font-family': 'sans-serif',
     color: 'white',
     padding: '12px 24px',
     'border-radius': '6px',
     'font-size': '1.05rem',
     'font-weight': 500,
     border: 'none',
     cursor: 'pointer',
     outline: 'none',
     'white-space': 'nowrap',
     'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
     transform: 'scale(1)',
     transition: 'background-color 0.2s ease-in-out, transform 0.2s ease-out, box-shadow 0.25s ease-in-out, filter 0.2s ease-in-out',
     'background-color': '#007bff', // Default iniziale
     appearance: 'none', // Reset aggiuntivi
     margin: '0',
     'line-height': 'normal',
     'text-align': 'center',
     'text-decoration': 'none',
     'vertical-align': 'middle',
     'user-select': 'none',
     '-webkit-tap-highlight-color': 'transparent'
  };
   // -------------------------------------

   // --- Calcolo Stile Dinamico ---
   const computedStyle = (): JSX.CSSProperties => {
       let combined: JSX.CSSProperties = { ...baseStyle } as JSX.CSSProperties;

       // 1. Applica colore base custom (se non disabilitato)
       if (localStyleProps.buttonColor && !localStyleProps.disabled) {
           combined["background-color"] = localStyleProps.buttonColor;
       }

       // 2. Simula Hover (se non disabilitato e non attivo)
       if (isHovered() && !isActive() && !localStyleProps.disabled) {
           combined.filter = 'brightness(90%)'; // Scurisce leggermente
           combined.transform = 'scale(1.05)'; // Ingrandisce
           combined["box-shadow"] = '0 6px 12px rgba(0, 0, 0, 0.2)'; // Ombra più grande
           // Sovrascrive backgroundColor di base se custom, ma mantiene il filtro
            if (localStyleProps.buttonColor) combined["background-color"] = localStyleProps.buttonColor;
       }

       // 3. Simula Active (se non disabilitato)
       if (isActive() && !localStyleProps.disabled) {
            combined.filter = 'brightness(80%)'; // Scurisce di più
            combined.transform = 'scale(0.99)'; // Effetto pressione
            combined["box-shadow"] = '0 2px 5px rgba(0, 0, 0, 0.15)'; // Ombra ridotta
             // Sovrascrive backgroundColor di base se custom, ma mantiene il filtro
             if (localStyleProps.buttonColor) combined["background-color"] = localStyleProps.buttonColor;
       }

       // 4. Applica Stili Disabled (sovrascrive tutto tranne style esterno)
       if (localStyleProps.disabled) {
           combined["background-color"] = '#cccccc';
           combined.color = '#666666';
           combined.cursor = 'not-allowed';
           combined.transform = 'none';
           combined["box-shadow"] = 'none';
           combined.opacity = 0.6;
           combined.filter = 'none';
       }

       // 5. Unisci eventuali stili inline esterni passati come prop
       const externalStyle = typeof localStyleProps.style === 'string' ? {} : localStyleProps.style || {};
       combined = { ...combined, ...externalStyle };

       return combined;
   };
   // ---------------------------

  return (
    <button
      ref={buttonRef} // Ref ancora utile se serve altrove, ma non per il click di base
      type="button"
      // Applica SOLO le classi esterne passate come prop
      class={localStyleProps.class || ''}
      // Applica l'oggetto stile calcolato dinamicamente
      style={computedStyle()}
      disabled={localStyleProps.disabled}
      // --- Gestori Eventi per simulare Hover/Active ---
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsActive(false); }} // Resetta entrambi all'uscita
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
       // Chiamata alla logica principale sul click
      onClick={handleClick}
      // Passa altri props/eventi non gestiti specificamente
      {...otherButtonProps}
    >
      {/* Usa la prop label */}
      {popupOptions.label}
    </button>
  );
};