const g = "http://localhost:3000", f = "";
function x(c = {}) {
  const {
    widgetId: t,
    popupOptions: l = {},
    onComplete: o
  } = c, n = window.location.origin, h = window.location.href;
  console.log(`Pulsix SDK chiamato da: Origin=${n}, Href=${h}`);
  let r = `${g}${f}`;
  if (t) {
    const e = r.includes("?") ? "&" : "?";
    r += `${e}widgetId=${encodeURIComponent(t)}`;
  }
  const d = new URL(g).origin, p = 500, u = 700, C = { ...{
    width: p,
    height: u,
    left: window.screenX + (window.outerWidth - p) / 2,
    top: window.screenY + (window.outerHeight - u) / 2,
    scrollbars: "yes"
  }, ...l }, a = Object.entries(C).map(([e, b]) => `${e}=${b}`).join(",");
  console.log("Window Features String:", a);
  const i = window.open(r, "SolidStart_TransactionPopup", a);
  if (!i || i.closed || typeof i.closed > "u") {
    alert("Popup bloccata! Abilita le popup per questo sito per continuare.");
    return;
  }
  let s = null;
  o && typeof o == "function" && (s = (e) => {
    if (e.origin !== d) {
      console.warn("Ignored message from unexpected origin:", e.origin, "Expected:", d);
      return;
    }
    e.source === i && e.data && e.data.type === "transactionComplete" && (o(e.data), s && window.removeEventListener("message", s));
  }, window.addEventListener("message", s, !1));
}
class w extends HTMLElement {
  // Memorizza la configurazione
  constructor() {
    super(), this._buttonElement = null, this._popupConfig = {}, this.handleClick = () => {
      console.log("[Pulsix WC] handleClick: Clicked! Opening popup with config:", this._popupConfig), x(this._popupConfig);
    }, console.log("[Pulsix WC] Constructor: START");
    try {
      this.attachShadow({ mode: "open" }), console.log("[Pulsix WC] Constructor: Shadow attached", this.shadowRoot);
    } catch (t) {
      console.error("[Pulsix WC] Constructor: ERROR attaching shadow!", t);
      return;
    }
    console.log("[Pulsix WC] Constructor: Calling render...");
    try {
      this.render(), console.log("[Pulsix WC] Constructor: render() finished.");
    } catch (t) {
      console.error("[Pulsix WC] Constructor: ERROR calling render!", t);
    }
    console.log("[Pulsix WC] Constructor: END");
  }
  // --- Gestione Attributi Osservati ---
  static get observedAttributes() {
    return ["button-text", "widget-id", "popup-config-json"];
  }
  attributeChangedCallback(t, l, o) {
    if (console.log(`[Pulsix WC] attributeChangedCallback: ${t} changed from ${l} to ${o}`), t === "button-text" && this._buttonElement && o !== null && (this._buttonElement.textContent = o), t === "popup-config-json" && o !== null)
      try {
        const n = JSON.parse(o);
        this._popupConfig = { ...this._popupConfig, ...n }, console.log("[Pulsix WC] attributeChangedCallback: Popup config updated from attribute:", this._popupConfig);
      } catch (n) {
        console.error("[Pulsix WC] attributeChangedCallback: Error parsing popup-config-json attribute:", n);
      }
    t === "widget-id" && o !== null && (this._popupConfig = { ...this._popupConfig, widgetId: o });
  }
  // --- Proprietà JavaScript ---
  set popupConfig(t) {
    this._popupConfig = t, console.log("[Pulsix WC] Property Setter: popupConfig set via JS:", this._popupConfig);
  }
  get popupConfig() {
    return this._popupConfig;
  }
  // --- Metodi del Ciclo di Vita ---
  connectedCallback() {
    console.log("[Pulsix WC] connectedCallback: CALLED", "Button Element:", this._buttonElement), this._buttonElement ? (this._buttonElement.addEventListener("click", this.handleClick), console.log("[Pulsix WC] connectedCallback: Click listener ADDED.")) : console.warn("[Pulsix WC] connectedCallback: _buttonElement NOT found when adding listener!");
  }
  disconnectedCallback() {
    console.log("[Pulsix WC] disconnectedCallback: CALLED"), this._buttonElement && (this._buttonElement.removeEventListener("click", this.handleClick), console.log("[Pulsix WC] disconnectedCallback: Click listener REMOVED."));
  }
  render() {
    if (console.log("[Pulsix WC] render: START"), this.shadowRoot) {
      console.log("[Pulsix WC] render: Shadow root exists. Clearing..."), this.shadowRoot.innerHTML = "";
      try {
        const t = document.createElement("style");
        t.textContent = `
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
          `, this.shadowRoot.appendChild(t), console.log("[Pulsix WC] render: Style appended."), this._buttonElement = document.createElement("button"), this._buttonElement.textContent = this.getAttribute("button-text") || "Apri Pulsix (Default)", this.shadowRoot.appendChild(this._buttonElement), console.log("[Pulsix WC] render: Button element appended.", this._buttonElement);
      } catch (t) {
        console.error("[Pulsix WC] render: ERROR creating/appending style or button!", t);
      }
    } else
      console.error("[Pulsix WC] render: ERROR - this.shadowRoot is NULL or not accessible!");
    console.log("[Pulsix WC] render: END");
  }
}
typeof window < "u" && window.customElements && !window.customElements.get("pulsix-button") && (window.customElements.define("pulsix-button", w), console.log("Custom element <pulsix-button> registrato."));
export {
  w as button,
  x as openTransactionPopup
};
//# sourceMappingURL=index.mjs.map
