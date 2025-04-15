import React, { useRef, useEffect, useLayoutEffect, forwardRef, useImperativeHandle } from 'react';
import { createPulsixButton, PulsixButtonOptions, PulsixButtonInstance } from 'pulsix';

// Props per il componente React, eredita quelle della libreria core
export interface PulsixButtonProps extends Omit<PulsixButtonOptions, 'userId'> {
  // Rendi userId opzionale qui se vuoi, o passala sempre
  userId: string;
  // Aggiungi qui props specifiche React se necessario (es. className, style)
  className?: string;
  style?: React.CSSProperties;
}

// Definisci un handle per esporre metodi dell'istanza, se necessario
export interface PulsixButtonHandle {
  // Esempio: puoi esporre metodi specifici dell'istanza core se vuoi
  // getInstance: () => PulsixButtonInstance | null;
}

export const PulsixButton = forwardRef<PulsixButtonHandle, PulsixButtonProps>(
  ({ className, style, ...pulsixOptions }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<PulsixButtonInstance | null>(null);

    // Usa useLayoutEffect per manipolazioni DOM sincrone se necessario,
    // altrimenti useEffect va bene.
    useLayoutEffect(() => {
      let currentInstance: PulsixButtonInstance | null = null;
      if (containerRef.current) {
        // Pulisce il contenuto precedente se l'elemento viene riutilizzato
        while (containerRef.current.firstChild) {
           containerRef.current.removeChild(containerRef.current.firstChild);
        }
        // Crea l'istanza della libreria core
        currentInstance = createPulsixButton(containerRef.current, pulsixOptions);
        instanceRef.current = currentInstance;
      }

      // Funzione di cleanup
      return () => {
        currentInstance?.destroy();
        instanceRef.current = null;
      };
      // Ricrea l'istanza se le opzioni fondamentali cambiano (es. userId)
    }, [pulsixOptions.userId]); // Aggiungi qui altre dipendenze "fondamentali"

    // Effetto per aggiornare le opzioni non fondamentali
    useEffect(() => {
      if (instanceRef.current) {
        // Chiamiamo updateOptions solo per le opzioni che *possono* cambiare
        const { userId, ...updatableOptions } = pulsixOptions;
        instanceRef.current.updateOptions(updatableOptions);
      }
      // Aggiorna quando le opzioni (escluse quelle fondamentali) cambiano
    }, [pulsixOptions.label, pulsixOptions.onSuccess, pulsixOptions.onError /* ...altre opzioni */]);

    // Esponi metodi tramite ref se necessario (opzionale)
    useImperativeHandle(ref, () => ({
      // getInstance: () => instanceRef.current,
    }), []);

    // Renderizza un div contenitore che ospiterà il bottone creato dalla libreria
    return <div ref={containerRef} className={className} style={style}></div>;
  }
);

PulsixButton.displayName = 'PulsixButton'; // Utile per React DevTools