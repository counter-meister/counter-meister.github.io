customElements.define(
  "my-counter",
  class extends HTMLElement {
    constructor() {
      super().attachShadow({
        mode: "open",
      }).innerHTML =
        "<style>" +
        "p{font-size:200%;width:4rem;display:inline-block;text-align:center}" +
        "button{font-size:200%;width:4rem;height:4rem;border:none;border-radius:10px;background:seagreen;color:white}" +
        "</style>" +
        "<button onclick=this.getRootNode().host.count-- >-</button>" +
        "<p>0</p>" +
        "<button onclick=this.getRootNode().host.count++>+</button>";
    }
    set count(v) {
      this.shadowRoot.querySelector("p").innerHTML = v;
    }
    get count() {
      return ~~this.shadowRoot.querySelector("p").innerHTML;
    }
  }
);
