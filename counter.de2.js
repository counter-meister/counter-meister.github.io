customElements.define("my-counter", class extends HTMLElement {
    constructor() {
      super()
        .attachShadow({ mode: "open" })
        .innerHTML =
        "<style>" +
        "p{font-size:200%;width:4rem;display:inline-block;text-align:center}" +
        "button{font-size:200%;width:4rem;height:4rem;border:none;border-radius:10px;background-color:seagreen;color:white}" +
        "</style>" +
        "<button onclick=this.getRootNode().host.dec()>-</button>" +
        "<p>0</p>" +
        "<button onclick=this.getRootNode().host.inc()>+</button>";
      this.count = 0;
    }
    inc() {
      this.update(++this.count);
    }
    dec() {
      this.update(--this.count);
    }
    update(count) {
      this.shadowRoot.querySelector("p").innerHTML = count;
    }
  }
);