import { createSignal, onMount, Component } from 'solid-js';
import { openTransactionPopup, PopupConfig } from 'pulsix'; // Assumendo una struttura di export

interface PulsixButtonProps {
  userId?: string; // O widgetId, a seconda della tua API
  buttonText?: string;
  popupConfig?: PopupConfig;
}

export const PulsixButton: Component<PulsixButtonProps> = (props) => {
  const handleClick = () => {
    // Questa funzione viene chiamata solo nel browser (click event)
    console.log('Button clicked, opening popup...');
    const config: PopupConfig = {
      ...props.popupConfig, // Prendi la config dalle props
      widgetId: props.userId, // Passa l'ID utente/widget
    };
    openTransactionPopup(config);
  };

  // onMount viene eseguito solo sul client dopo il rendering iniziale
  onMount(() => {
    console.log('PulsixButton mounted on the client.');
    // Qui puoi mettere codice che DEVE girare solo nel browser
    // all'avvio del componente, se necessario (es. inizializzare
    // qualcosa basato sul DOM). In questo caso specifico del bottone,
    // probabilmente non serve nulla qui, basta l'handler onClick.
  });

  // createEffect viene eseguito sia sul server (se non configurato diversamente)
  // sia sul client. Per codice solo client, onMount è più sicuro o usa:
  // createEffect(() => {
  //   if (!isServer) { // isServer è importato da "solid-js/web"
  //      // Codice solo client
  //   }
  // });

  return (
    <button onClick={handleClick}>
      {props.buttonText || 'Apri Popup'} {/* Usa un testo di default */}
    </button>
  );
};

// Non esportare direttamente la classe Web Component qui, se PulsixButton
// è inteso come un componente Solid puro.