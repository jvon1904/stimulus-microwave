import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  beepEffect = new Audio("leet-beep.mp3");

  static targets = [
    "outline", "screen", "canvas", "inputContainer", "labelContainer"
  ]

  static values = {
    originalBackground: String
  }

  beep() {
    this.beepEffect.currentTime = 0;
    this.beepEffect.play();
  }


  start() {
    this.backgroundValue = this.outlineTarget.style.backgroundImage;
    this.showScreen();
    this.display('Welcome to LEET mode...', true);
  }

  stop() {
    this.outlineTarget.style.background = this.originalBackgroundValue;
    this.clearScreen();
    this.hideScreen();
  }

  showScreen() {
    this.screenTarget.classList.add('on');
  }

  hideScreen() {
    this.screenTarget.classList.remove('on');
  }

  clearScreen() {
    this.clearInput();
    this.clearLabels();
  }

  clearInput() {
    this.currentInput.parentElement.remove();
  }

  clearLabels() {
    this.labelContainerTarget.innerHTML = ""
  }

  setColor(color = undefined) {
    this.outlineTarget.style.background = this.gradient(color);
  }

  gradient(color = undefined) {
    const col = color || Math.random() * 361
    const col1 = `hsl(${col}, 100%, 50%)`;
    const col2 = `hsl(${col}, 100%, 33%)`;
    const col3 = `hsl(${col}, 100%, 20%)`;
    return `linear-gradient(210deg, ${col1}, ${col2} 25%, ${col3} 80%)`
  }

  display(txt = 'Hello world', initial = false) {
    this.canvasTarget.width = this.canvasTarget.offsetWidth * this.pixelRatio;
    this.canvasTarget.height = this.canvasTarget.offsetHeight * this.pixelRatio;
    
    const ctx = this.canvasTarget.getContext("2d");
    const chars = txt.split('');

    ctx.font = "24px monospace";
    ctx.textAlign = "start";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "yellowgreen";

    let disp = [];
    for (let i = 0; i < chars.length; i++) {
      setTimeout(() => {
        disp.push(chars[i]);
        if (i % 2 === 0) {
          this.beep();
        }
        ctx.fillText(disp.join(''), 10, 50);
      }, 50 * i);
    }

    if (initial) {
      setTimeout(() => {
        this.appendInput();
      }, 50 * chars.length)
    }
  }

  appendInput() {
    this.inputContainerTarget.prepend(this.newInputLine);
    this.currentInput.focus();
  }

  appendLabel(txt) {
    this.labelContainerTarget.prepend(this.newLabelLine(txt));
  } 

  input(e) {
    if (e.key === "Enter") {
      const txt = e.target.value;
      e.target.value = "";
      this.appendLabel(txt);
      this.parseInput(txt);
    }
  }

  parseInput(txt) {
    if (/^set-color ([3][6][0]|[3][0-5][0-9]|[1-2][0-9][0-9]|[0-9][0-9]|[0-9])$/.test(txt)) {
      const col = txt.split(' ').slice(-1);
      this.display('setting color...');
      this.setColor(col);
    } else {
      this.display(`You just typed "${txt}"`);
    }
  }

  newLabelLine(txt) {
    const line = document.createElement('div')
    line.classList.add("leet__label-line")
    const label = document.createElement('p')
    label.classList.add("leet__label")
    label.textContent = `> ${txt}`
    line.appendChild(label)

    return line;
  }

  get pixelRatio() {
    return window.devicePixelRatio;
  }

  get newInputLine() {
    const line = document.createElement('div')
    line.classList.add("leet__input-line")
    const input = document.createElement('input')
    input.classList.add("leet__input")
    input.type = "text"
    input.setAttribute("data-action", "keypress->leet#input")
    line.appendChild(input)

    return line;
  }

  get currentInput() {
    const input = document.querySelector(`input[type=text]`)
    return input;
  }
}
