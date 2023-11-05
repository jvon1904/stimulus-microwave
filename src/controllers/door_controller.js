import { Controller } from "@hotwired/stimulus"
import { useResize } from "stimulus-use"

export default class extends Controller {

  static targets = [
    "pane",
    "canvas"
  ]

  connect() {
    useResize(this)
  }

  initialize() {
    this.initCanvas();
  }

  resize() {
    this.initCanvas();
  }

  initCanvas() {
    console.log('initializing canvas')
    this.canvasTarget.width = this.paneTarget.offsetWidth;
    this.canvasTarget.height = this.paneTarget.offsetHeight;
    const ctx = this.canvasTarget.getContext("2d");
    const grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 20);
    // grd.addColorStop(1, "blue");
    grd.addColorStop(0.5, "red");

    // Draw a filled Rectangle
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc((this.canvasTarget.width / 2), (this.canvasTarget.height / 2) + 50, 100, 0, 2 * Math.PI);
    ctx.fill();

  }
}