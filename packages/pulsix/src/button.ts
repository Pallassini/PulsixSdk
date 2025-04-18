// packages/pulsix/src/button.ts - VERSIONE CON STILI INLINE E NUOVE FUNZIONALITÀ

import { openTransactionPopup, PopupConfig } from './popup'; // Assicurati che il percorso sia corretto

let PulsixButtonClass: any = null;

if (typeof HTMLElement !== 'undefined') { // Controlla se siamo in un ambiente browser
    PulsixButtonClass = class PulsixButton extends HTMLElement {
        private _buttonElement: HTMLButtonElement | null = null;
        private _popupConfig: PopupConfig = {};

        // Colore di default se l'attributo non è specificato
        private _defaultButtonColor = '#007bff'; // Blu standard

        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            console.log('[Pulsix WC] Constructor finished.');
        }

        // --- Gestione Attributi Osservati ---
        static get observedAttributes() {
            // Aggiungiamo 'button-color' agli attributi osservati
            return ['button-text', 'widget-id', 'popup-config-json', 'disabled', 'button-color'];
        }

        attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
            console.log(`[Pulsix WC] attributeChangedCallback: ${name} changed from ${oldValue} to ${newValue}`);

            // Aggiorna testo bottone (usa 'Pulsix' come default implicito nel render)
            if (name === 'button-text' && this._buttonElement && newValue !== null) {
                this._buttonElement.textContent = newValue;
            } else if (name === 'button-text' && this._buttonElement && newValue === null) {
                // Se l'attributo viene rimosso, torna al default 'Pulsix'
                this._buttonElement.textContent = 'Pulsix';
            }

            // Aggiorna config da JSON
            if (name === 'popup-config-json' && newValue !== null) {
                try { /* ... (logica JSON come prima) ... */ } catch (e) { /*...*/ }
            }

            // Aggiorna config da widget-id
            if (name === 'widget-id' && newValue !== null) {
                this._popupConfig = { ...this._popupConfig, widgetId: newValue };
                console.log('[Pulsix WC] Config updated from attribute (widgetId):', this._popupConfig);
            }

            // Aggiorna stato 'disabled'
            if (name === 'disabled' && this._buttonElement) {
                this._buttonElement.disabled = newValue !== null;
                console.log(`[Pulsix WC] Button disabled state: ${this._buttonElement.disabled}`);
            }

            // Aggiorna il colore del bottone tramite CSS variable inline sull'host
            if (name === 'button-color') {
                if (newValue) {
                    // Imposta la variabile CSS sull'elemento host stesso per sovrascrivere il default
                    this.style.setProperty('--pulsix-button-background', newValue);
                    console.log(`[Pulsix WC] Applied button-color: ${newValue}`);
                } else {
                    // Rimuovi la sovrascrittura per tornare al colore di default definito nel CSS interno
                    this.style.removeProperty('--pulsix-button-background');
                    console.log('[Pulsix WC] Reverted to default button-color.');
                }
            }
        }

        // --- Proprietà JavaScript ---
        set popupConfig(config: PopupConfig) { this._popupConfig = config; /*...*/ }
        get popupConfig(): PopupConfig { return this._popupConfig; }

        set disabled(value: boolean) {
            if (value) { this.setAttribute('disabled', ''); }
            else { this.removeAttribute('disabled'); }
        }
        get disabled(): boolean { return this.hasAttribute('disabled'); }

        // Proprietà per il colore (riflette l'attributo)
        set buttonColor(value: string | null) {
            if (value) {
                 this.setAttribute('button-color', value);
            } else {
                 this.removeAttribute('button-color');
            }
        }
        get buttonColor(): string | null {
             return this.getAttribute('button-color');
        }


        // --- Metodi del Ciclo di Vita ---
        connectedCallback() {
            console.log('[Pulsix WC] connectedCallback: CALLED');
            if (!this.shadowRoot?.firstChild) {
                this.render(); // Renderizza HTML e stili
            }

            // Applica il colore iniziale se l'attributo è già presente
            const initialColor = this.getAttribute('button-color');
            if (initialColor) {
                 this.style.setProperty('--pulsix-button-background', initialColor);
            }

            this.addClickListener();
            this.updateInitialDisabledState();
        }

        disconnectedCallback() {
            // ... (come prima) ...
            if (this._buttonElement) { this._buttonElement.removeEventListener('click', this.handleClick); }
        }

        // --- Logica Interna ---
        private handleClick = () => {
            // ... (come prima, con controllo disabled) ...
            if (this.disabled) return;
            openTransactionPopup(this._popupConfig);
        }

        private addClickListener() {
            // ... (come prima) ...
             if (this._buttonElement && !this._buttonElement.onclick) { this._buttonElement.addEventListener('click', this.handleClick); }
        }

        private updateInitialDisabledState() {
             // ... (come prima) ...
             if (this._buttonElement && this.hasAttribute('disabled')) { this._buttonElement.disabled = true; }
        }


        private render() {
            console.log('[Pulsix WC] render: START');
            if (!this.shadowRoot) return;
            this.shadowRoot.innerHTML = ''; // Pulisci

            try {
                const style = document.createElement('style');

                // === INIZIO BLOCCO STILI ===
                style.textContent = `
                :host {
                    display: inline-block;
                    font-family: sans-serif;
                    /* Colore di base (default o sovrascritto da attributo/JS) */
                    --pulsix-button-background: ${this._defaultButtonColor}; /* Es: #007bff */
                    --pulsix-button-text-color: white;
                    --pulsix-button-padding: 12px 24px;
                    --pulsix-button-border-radius: 6px;
                    /* Variabili hover/active rimosse - verranno calcolate */
                    --pulsix-button-disabled-background: #cccccc;
                    --pulsix-button-disabled-color: #666666;
                    --pulsix-focus-ring-color: rgba(0, 123, 255, 0.5);
                    transition: transform 0.2s ease-out;
                }
    
                button {
                    cursor: pointer;
                    border: none;
                    background-color: var(--pulsix-button-background); /* Usa la variabile base */
                    color: var(--pulsix-button-text-color);
                    padding: var(--pulsix-button-padding);
                    border-radius: var(--pulsix-button-border-radius);
                    font-size: 1.05rem;
                    font-weight: 500;
                    outline: none;
                    white-space: nowrap;
                    /* Transizione per background-color ora userà i valori calcolati */
                    transition: background-color 0.2s ease-in-out,
                                transform 0.2s ease-out,
                                box-shadow 0.25s ease-in-out;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
    
                /* --- Effetti Hover con color-mix --- */
                button:not([disabled]):hover {
                    /* Mescola il colore base con 15% di nero per scurirlo */
                    /* 'in srgb' è lo spazio colore standard */
                    background-color: color-mix(in srgb, var(--pulsix-button-background) 85%, black 15%);
                    transform: scale(1.05);
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
                }
    
                /* --- Effetti Active con color-mix --- */
                button:not([disabled]):active {
                     /* Mescola il colore base con 30% di nero per scurirlo di più */
                    background-color: color-mix(in srgb, var(--pulsix-button-background) 70%, black 30%);
                    transform: scale(0.99);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
                }
    
                /* Regole :focus-visible e [disabled] come prima */
                button:not([disabled]):focus-visible {
                     box-shadow: 0 0 0 3px var(--pulsix-focus-ring-color),
                                 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                button[disabled] {
                    background-color: var(--pulsix-button-disabled-background);
                    color: var(--pulsix-button-disabled-color);
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
    
                /* Animazione pulse (invariata) */
                @keyframes pulseAnimation { /* ... */ }
                button.pulsing:not([disabled]) { /* ... */ }
            `;
                // === FINE BLOCCO STILI ===

                this.shadowRoot.appendChild(style);

                this._buttonElement = document.createElement('button');
                // Imposta testo: usa attributo se presente, altrimenti default 'Pulsix'
                this._buttonElement.textContent = this.getAttribute('button-text') || 'Pulsix';

                this.shadowRoot.appendChild(this._buttonElement);
                console.log('[Pulsix WC] render: Button and style appended.');

            } catch (e) { console.error('[Pulsix WC] render: ERROR!', e); }
            console.log('[Pulsix WC] render: END');
        }

    };
}

export default PulsixButtonClass;