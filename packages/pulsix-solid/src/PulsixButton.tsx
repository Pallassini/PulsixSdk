import { onMount, onCleanup, createEffect, Component, splitProps } from 'solid-js';
import { createPulsixButton, PulsixButtonOptions, PulsixButtonInstance } from 'pulsix';
import type { JSX } from 'solid-js'; // Per tipi come HTMLAttributes

// Props per il componente Solid, eredita quelle della libreria core
// Usiamo Omit per escludere props che verranno gestite diversamente (es. ref)
export interface PulsixButtonProps extends Omit<PulsixButtonOptions, 'userId'> {
  userId: string;
  // Aggiungi qui props specifiche Solid/HTML se necessario
  class?: string;
  style?: JSX.CSSProperties | string;
}

export const PulsixButton: Component<PulsixButtonProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  let instance: PulsixButtonInstance | null = null;

  // Separa le props della libreria core dalle props HTML standard (class, style, etc.)
  const [pulsixOptions, htmlProps] = splitProps(props, [
    "userId", "label", "onSuccess", "onError", /* ...altre PulsixButtonOptions */
  ]);

  onMount(() => {
    let currentInstance: PulsixButtonInstance | null = null;
    if (containerRef) {
      // Pulisci contenuto precedente
       while (containerRef.firstChild) {
          containerRef.removeChild(containerRef.firstChild);
       }
      // Crea l'istanza core
      currentInstance = createPulsixButton(containerRef, pulsixOptions);
      instance = currentInstance;
    }
    // La cleanup viene registrata qui per essere associata a questo onMount
    onCleanup(() => {
      currentInstance?.destroy();
      instance = null;
    });
  });

  // createEffect per aggiornare le opzioni quando le props cambiano
  // Solid traccia automaticamente le dipendenze (pulsixOptions)
  createEffect(() => {
    if (instance) {
      // Passiamo l'oggetto `pulsixOptions` direttamente,
      // Solid sa quando rieseguire l'effetto se cambiano
      const { userId, ...updatableOptions } = pulsixOptions;
      instance.updateOptions(updatableOptions);
    }
  });

  // Renderizza un div contenitore a cui la libreria si attaccherà
  // Applica le props HTML rimanenti (class, style, id, etc.)
  return <div ref={containerRef} {...htmlProps}></div>;
};