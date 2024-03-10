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

    // Paint the window with little circles
    let r = 3.5; // radius
    let d = 2 * r; // diameter
    let gap = 1.5; // gap between circles
    let w = d + gap; // total width
    let marginX = 15; // pixels of space left and right
    let marginY = 25; // pixels of space top and bottom
    let numX = (this.canvasTarget.width / w) - ((marginX * 2) / w); // number of circles accross
    let numY = (this.canvasTarget.height / w) - ((marginY * 2) / w); // number of circles down
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.13)'
    for(let i = 0; i < numX; i++) {
      let x = ((w) * i) + marginX;
      for(let j = 0; j < numY; j++) {
        let y = ((w) * j) + marginY;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();
      }
    }
  }
}