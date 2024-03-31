import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  beepEffect = new Audio("leet-beep.mp3");

  static targets = [
    "outline", "screen", "canvas"
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
    this.display('Welcome to LEET mode...');
  }

  stop() {
    this.outlineTarget.style.background = this.originalBackgroundValue;
    this.hideScreen();
  }

  showScreen() {
    this.screenTarget.classList.add('on');
  }

  hideScreen() {
    this.screenTarget.classList.remove('on');
  }

  setColor() {
    this.outlineTarget.style.background = this.randomGrad;
  }

  display(txt = 'Hello world') {
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
  }

  get randomGrad() {
    const col = Math.random() * 361
    const col1 = `hsl(${col}, 100%, 50%)`;
    const col2 = `hsl(${col}, 100%, 33%)`;
    const col3 = `hsl(${col}, 100%, 20%)`;
    return `linear-gradient(210deg, ${col1}, ${col2} 25%, ${col3} 80%)`
  }

  get pixelRatio() {
    return window.devicePixelRatio;
  }
}
