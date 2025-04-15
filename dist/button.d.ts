import { PopupConfig } from './popup';
declare class Button extends HTMLElement {
    private _buttonElement;
    private _popupConfig;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    set popupConfig(config: PopupConfig);
    get popupConfig(): PopupConfig;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleClick;
    private render;
}
export default Button;
