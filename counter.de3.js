customElements.define(
  "my-counter",
  class extends HTMLElement {
    constructor() {
      super().attachShadow({
        mode: "open",
      }).innerHTML =
        "<style>" +
        "p{font-size:200%;width:4rem;display:inline-block;text-align:center}" +
        "button{font-size:200%;width:4rem;height:4rem;border:none;border-radius:10px;background:#2e8b57;color:#fff}" +
        "</style>" +
        "<button onclick=this.getRootNode().host.dec()>-</button><p>0</p><button onclick=this.getRootNode().host.inc()>+</button>";
      this.count = 0;
      this.inc = () => this.update(++this.count);
      this.dec = () => this.update(--this.count);
      this.update = (count) =>
        (this.shadowRoot.querySelector("p").innerHTML = count);
    }
  }
);
