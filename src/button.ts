// PulsixSdk/src/button.ts

import { openTransactionPopup, PopupConfig } from './popup'; // Assumendo che openTransactionPopup e PopupConfig siano in src/popup.ts

// Definiamo la classe per il nostro custom element <pulsix-button>
class Button extends HTMLElement {

  private _buttonElement: HTMLButtonElement | null = null;
  private _popupConfig: PopupConfig = {}; // Memorizza la configurazione

  constructor() {
    super(); // Chiama sempre il costruttore della classe base (HTMLElement)
    console.log('[Pulsix WC] Constructor: START'); // Log 1

    try {
      this.attachShadow({ mode: 'open' });
      console.log('[Pulsix WC] Constructor: Shadow attached', this.shadowRoot); // Log 2
    } catch (e) {
      console.error('[Pulsix WC] Constructor: ERROR attaching shadow!', e); // Log Errore 1
      return; // Interrompi se non possiamo creare lo shadow DOM
    }

    console.log('[Pulsix WC] Constructor: Calling render...'); // Log 3
    try {
      this.render();
      console.log('[Pulsix WC] Constructor: render() finished.'); // Log 6 (dopo render)
    } catch (e) {
       console.error('[Pulsix WC] Constructor: ERROR calling render!', e); // Log Errore 3
    }
    console.log('[Pulsix WC] Constructor: END'); // Log 7
  }

  // --- Gestione Attributi Osservati ---
  static get observedAttributes() {
    return ['button-text', 'widget-id', 'popup-config-json'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.log(`[Pulsix WC] attributeChangedCallback: ${name} changed from ${oldValue} to ${newValue}`);
    // ... (logica esistente per aggiornare _buttonElement.textContent e _popupConfig) ...
    if (name === 'button-text' && this._buttonElement && newValue !== null) {
      this._buttonElement.textContent = newValue;
    }
    if (name === 'popup-config-json' && newValue !== null) {
       try {
         const configUpdate = JSON.parse(newValue);
         this._popupConfig = { ...this._popupConfig, ...configUpdate };
         console.log('[Pulsix WC] attributeChangedCallback: Popup config updated from attribute:', this._popupConfig);
       } catch (e) {
         console.error("[Pulsix WC] attributeChangedCallback: Error parsing popup-config-json attribute:", e);
       }
    }
     if (name === 'widget-id' && newValue !== null) {
       this._popupConfig = { ...this._popupConfig, widgetId: newValue };
     }
  }

  // --- Proprietà JavaScript ---
  set popupConfig(config: PopupConfig) {
      this._popupConfig = config;
      console.log('[Pulsix WC] Property Setter: popupConfig set via JS:', this._popupConfig);
  }

  get popupConfig(): PopupConfig {
      return this._popupConfig;
  }


  // --- Metodi del Ciclo di Vita ---
  connectedCallback() {
    console.log('[Pulsix WC] connectedCallback: CALLED', 'Button Element:', this._buttonElement);
    // È buona norma aggiungere l'event listener qui
    if (this._buttonElement) {
        this._buttonElement.addEventListener('click', this.handleClick);
        console.log('[Pulsix WC] connectedCallback: Click listener ADDED.');
    } else {
        console.warn('[Pulsix WC] connectedCallback: _buttonElement NOT found when adding listener!');
    }
  }

  disconnectedCallback() {
    console.log('[Pulsix WC] disconnectedCallback: CALLED');
    // Rimuovi l'event listener per pulizia
    if (this._buttonElement) {
      this._buttonElement.removeEventListener('click', this.handleClick);
      console.log('[Pulsix WC] disconnectedCallback: Click listener REMOVED.');
    }
  }

  // --- Logica Interna ---
  private handleClick = () => {
    console.log('[Pulsix WC] handleClick: Clicked! Opening popup with config:', this._popupConfig);
    openTransactionPopup(this._popupConfig);
  }

  private render() {
    console.log('[Pulsix WC] render: START'); // Log 4

    // Controlla *l'esistenza* dello shadowRoot
    if (this.shadowRoot) {
       console.log('[Pulsix WC] render: Shadow root exists. Clearing...'); // Log 5a
       this.shadowRoot.innerHTML = ''; // Svuota

       try {
          // Definisci lo stile (aggiunto bordo rosso per debug visivo)
          const style = document.createElement('style');
          style.textContent = `
            :host {
              display: inline-block !important; /* Stili per l'elemento <pulsix-button> stesso */
              border: 2px dashed red; /* Per vedere se l'host occupa spazio */
              padding: 1px; /* Minimo padding per visibilità bordo */
            }
            button {
              /* Stili base per il bottone interno */
              padding: 10px 20px;
              font-size: 1rem;
              width: 100px;
              cursor: pointer;
              border: 1px solid #ccc;
              border-radius: 4px;
              background-color: #f0f0f0;
              display: inline-block; /* Assicurati che il bottone sia visibile */
              visibility: visible; /* Assicurati che sia visibile */
            }
            button:hover {
              background-color: #e0e0e0;
            }
          `;
          this.shadowRoot.appendChild(style);
          console.log('[Pulsix WC] render: Style appended.'); // Log 5b

          // Crea il bottone interno
          this._buttonElement = document.createElement('button');
          this._buttonElement.textContent = this.getAttribute('button-text') || 'Apri Pulsix (Default)'; // Testo default aggiornato
          this.shadowRoot.appendChild(this._buttonElement);
          console.log('[Pulsix WC] render: Button element appended.', this._buttonElement); // Log 5c

       } catch (e) {
         console.error('[Pulsix WC] render: ERROR creating/appending style or button!', e); // Log Errore 2
       }

    } else {
       console.error('[Pulsix WC] render: ERROR - this.shadowRoot is NULL or not accessible!'); // Log Errore 4
    }
     console.log('[Pulsix WC] render: END'); // Log 5d (dovrebbe apparire se non ci sono errori sopra)
  }
}

// Esportiamo la classe
export default Button;