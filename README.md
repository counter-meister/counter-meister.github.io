# counter-meister.github.io

The WebComponentsDev site blogs about [51 ways to make a Web Component](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/)

I am totally against comparison with Svelte, because the Svelte compiler optimizes code

So if I "play compiler", That native HTMLElement can be optimized...


| |minified|gzip|
|---|---|---|---|
|original|954 B|474 B|
|refactored|576 B|355 B|
|savings|**39.6%**|**25.1%**|

<br>

## Original code

````javascript
const template = document.createElement("template");
template.innerHTML = `
  <style>
    * {
      font-size: 200%;
    }
    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
    }
    button {
      width: 4rem;
      height: 4rem;
      border: none;
      border-radius: 10px;
      background-color: seagreen;
      color: white;
    }
  </style>
  <button id="dec">-</button>
  <span id="count"></span>
  <button id="inc">+</button>`;
class MyCounter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.getElementById("inc").onclick = () => this.inc();
    this.shadowRoot.getElementById("dec").onclick = () => this.dec();
    this.update(this.count);
  }
  inc() {
    this.update(++this.count);
  }
  dec() {
    this.update(--this.count);
  }
  update(count) {
    this.shadowRoot.getElementById("count").innerHTML = count;
  }
}
customElements.define("my-counter", MyCounter);
````


# Refactor code


* Template literals are great, but they suck up bytes, as white space and newlines are still included in the minified file.
      ![](https://i.imgur.com/eqAy1Ba.png)

* This code doesn't even need a template literal string, it is a **static** String


    ````css
    '<style>'+
    '* {font-size: 200%;}'+
    'span {width: 4rem;display: inline-block;text-align: center;}'+
    'button {width: 4rem;height: 4rem;border: none;border-radius: 10px;background-color: seagreen;color: white}'+
    '</style>'+
    '<button id="dec">-</button>'+
    '<span id="count"></span>'+
    '<button id="inc">+</button>';
    ````

* no need for a ``createElement('template')`` when we only want the innerHTML once

* template should **not** be added in the connectedCallback (as it can run multiple times)

* ``super()`` returns the _this_ scope
* ``attachShadow()`` sets **and** returns ``this.shadowRoot``
* so everything can be chained:

    ````javascript
    constructor() {
        super()
            .attachShadow({ mode: 'open' })
            .innerHTML = "<style>*{font-size:200%}...
    ````

* no need for a MyCounter class definition when it is used only once

  ``customElements.define('my-counter', class extends HTMLElement {}``


* Nearly all of the 51 examples use inline event handlers.

  Lit Element and many others do:

    ````js
    render() {
        return html`
        <button @click="${this.dec}">-</button>
        <span>${this.count}</span>
        <button @click="${this.inc}">+</button>
        `;
    }
    ````
* Then we can do that as well

   * we have to add extra code to find the **``inc()``** and **``dec()``** methods on the element (which libraries do for you under the hood)
   * the ``id`` references on the buttons are no longer needed

    ````html
    <button onclick="this.getRootNode().host.inc()">
    <button onclick="this.getRootNode().host.dec()">
    ````

* The Component uses shadowRoot to encapsulate styles; that means we **also** do not have to worry about HTML content.  
The  ``id`` on ``<span id="count">`` is not required because we can target the only ``<span>`` that exists in shadowDOM

    ````html
    <span></span>
    ````

    ````javascript
    update(count) {    this.shadowRoot.querySelector('span').innerHTML = count  }
    ````

* All the connectedCallback does is set the span innerHTML to 0
    ````js
    connectedCallback() {
        this.update(this.count);
    }
    ````

    Just set that by default then, and no connectedCallback is required

    ````
    '<span>0</span>'+
    ````

* remove not required white space and ; from CSS
* remove not required quotes from HTML attributes
## Refactored code
````js
customElements.define("my-counter", class extends HTMLElement {
    constructor() {
      super()
        .attachShadow({ mode: "open" })
        .innerHTML =
        "<style>" +
        "*{font-size:200%}" +
        "span{width:4rem;display:inline-block;text-align:center}" +
        "button{width:4rem;height:4rem;border:none;border-radius:10px;background-color:seagreen;color:white}" +
        "</style>" +
        "<button onclick=this.getRootNode().host.dec()>-</button>" +
        "<span>0</span>" +
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
      this.shadowRoot.querySelector("span").innerHTML = count;
    }
  }
);
````

# Savings

| |minified|gzip|
|---|---|---|---|
|original|954 B|474 B|
|refactored|576 B|355 B|
|savings|**39.6%**|**25.1%**|
