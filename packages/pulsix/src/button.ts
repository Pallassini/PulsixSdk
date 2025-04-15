// packages/pulsix/src/button.ts - VERSIONE CORRETTA

import { openTransactionPopup, PopupConfig } from './popup'; // Modifica il percorso se necessario

let ButtonClass: any = null;

if (typeof HTMLElement !== 'undefined') { // Controlla se siamo in un ambiente browser
  ButtonClass = class Button extends HTMLElement {
    private _buttonElement: HTMLButtonElement | null = null;
    private _popupConfig: PopupConfig = {};

    constructor() {
      super(); // NECESSARIO: Chiama il costruttore della classe base
      this.attachShadow({ mode: 'open' }); // Attacca lo shadow DOM, è sicuro farlo qui
      console.log('[Pulsix WC] Constructor finished.');
      // --- NON CHIAMARE this.render() QUI! ---
    }

    // --- Gestione Attributi Osservati ---
    static get observedAttributes() {
      return ['button-text', 'widget-id', 'popup-config-json'];
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
      console.log(`[Pulsix WC] attributeChangedCallback: ${name} changed from ${oldValue} to ${newValue}`);
      // Aggiorna il testo del bottone solo se il bottone è già stato creato da render()
      if (name === 'button-text' && this._buttonElement && newValue !== null) {
        this._buttonElement.textContent = newValue;
      }
      // Aggiorna la configurazione
      if (name === 'popup-config-json' && newValue !== null) {
        try {
          const configUpdate = JSON.parse(newValue);
          this._popupConfig = { ...this._popupConfig, ...configUpdate };
          console.log('[Pulsix WC] Config updated from attribute:', this._popupConfig);
        } catch (e) { console.error("Error parsing attr", e); }
      }
      if (name === 'widget-id' && newValue !== null) {
        this._popupConfig = { ...this._popupConfig, widgetId: newValue };
         console.log('[Pulsix WC] Config updated from attribute (widgetId):', this._popupConfig);
      }
    }

    // --- Proprietà JavaScript ---
    set popupConfig(config: PopupConfig) { this._popupConfig = config; }
    get popupConfig(): PopupConfig { return this._popupConfig; }


    // --- Metodi del Ciclo di Vita ---
    connectedCallback() {
      console.log('[Pulsix WC] connectedCallback: CALLED');
      // === SPOSTA LA CHIAMATA A render() QUI ===
      // Renderizza il contenuto solo quando l'elemento è connesso al DOM
      // e solo se non è già stato fatto (es. se viene spostato nel DOM)
      if (!this.shadowRoot?.firstChild) {
        this.render();
      }

      // Aggiungi l'event listener DOPO aver chiamato render()
      if (this._buttonElement && !this._buttonElement.onclick) { // Verifica se esiste e non ha già un listener (più robusto)
        this._buttonElement.addEventListener('click', this.handleClick);
        console.log('[Pulsix WC] connectedCallback: Click listener ADDED.');
      } else if (!this._buttonElement) {
        console.warn('[Pulsix WC] connectedCallback: _buttonElement NOT found after render()!');
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
      console.log('[Pulsix WC] handleClick: Opening popup with config:', this._popupConfig);
      openTransactionPopup(this._popupConfig); // Usa la funzione importata
    }

    private render() {
      console.log('[Pulsix WC] render: START');
      if (!this.shadowRoot) {
        console.error('[Pulsix WC] render: ERROR - ShadowRoot non disponibile!');
        return;
      }
      this.shadowRoot.innerHTML = ''; // Pulisci prima di aggiungere

      try {
        // Stili (Usa document)
        const style = document.createElement('style');
        style.textContent = `/* ... i tuoi stili ... */ :host { display: inline-block; } button { padding: 10px 20px; }`;
        this.shadowRoot.appendChild(style);

        // Bottone (Usa document)
        this._buttonElement = document.createElement('button');
        this._buttonElement.textContent = this.getAttribute('button-text') || 'Apri Pulsix'; // Usa un testo default
        this.shadowRoot.appendChild(this._buttonElement);
        console.log('[Pulsix WC] render: Button and style appended.');
      } catch (e) {
        console.error('[Pulsix WC] render: ERROR creating/appending elements!', e);
      }
      console.log('[Pulsix WC] render: END');
    }
  }; // Fine definizione classe
} // Fine if (typeof HTMLElement !== 'undefined')

// Esporta la classe (o null sul server)
export default ButtonClass;