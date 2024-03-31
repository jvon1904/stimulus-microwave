import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  static targets = [
    "outline"
  ]

  static values = {
    originalBackground: String
  }

  start() {
    this.backgroundValue = this.outlineTarget.style.backgroundImage;
    this.outlineTarget.style.background = this.randomGrad;
  }

  stop() {
    this.outlineTarget.style.background = this.originalBackgroundValue;
  }

  get randomGrad() {
    const col = Math.random() * 361
    const col1 = `hsl(${col}, 100%, 50%)`;
    const col2 = `hsl(${col}, 100%, 33%)`;
    const col3 = `hsl(${col}, 100%, 20%)`;
    return `linear-gradient(210deg, ${col1}, ${col2} 25%, ${col3} 80%)`
  }
}
