
class ErrorMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isVisible = false; // Controla la visibilidad del modal
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: none; 
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        :host([visible]) {
          display: flex; 
        }
        .modal {
          background: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .close-button {
          background: red;
          color: white;
          border: none;
          padding: 10px;
          cursor: pointer;
          border-radius: 5px;
        }
      </style>
      <div class="modal">
        <slot></slot> 
        <button class="close-button">Cerrar</button>
      </div>
    `;

    // Evento para cerrar el modal
    this.shadowRoot.querySelector('.close-button').addEventListener('click', () => {
      this.hide();
    });
  }

  // Para mostrar el mensaje de error
  show(message) {
    this.isVisible = true;
    this.setAttribute('visible', '');
    this.shadowRoot.querySelector('slot').innerHTML = message; // Establecer el mensaje
    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  // Para ocultar el mensaje de error
  hide() {
    this.isVisible = false;
    this.removeAttribute('visible');
  }
}

customElements.define('error-message', ErrorMessage);