import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  beepEffect = new Audio("beep.mp3");
  dingEffect = new Audio("ding.mp3");
  fanEffect = new Audio("fan.mp3");

  static targets = [
    "hourLeft",
    "hourRight",
    "minLeft",
    "minRight",
    "colon",
    "kitchenTimer",
    "timeCook"
  ]

  static values = {
    mode: String,
    sum: Number,
    hourLeft: Number,
    hourRight: Number,
    minLeft: Number,
    minRight: Number,
  }
    

  initialize() {
    this.clock();
  }

  get digitMapping() {
    return {
      '-': "negative",
      0: "zero",
      1: "one",
      2: "two",
      3: "three",
      4: "four",
      5: "five",
      6: "six",
      7: "seven",
      8: "eight",
      9: "nine",
    }
  }

  beep() {
    this.beepEffect.currentTime = 0;
    this.beepEffect.play();
  }

  ding() {
    this.dingEffect.currentTime = 0;
    this.dingEffect.play();
  }

  fan() {
    this.fanEffect.loop = true;
    this.fanEffect.currentTime = 0;
    this.fanEffect.play();
  }

  stopFan() {
    this.fanEffect.pause();
  }

  buttonPress(e) {
    const number = this.digitMapping[e.target.innerText]
    switch(this.modeValue) {
      case 'clock':
        this.pushNumber(number)
        this.modeValue = 'numbers'
        break;
      case 'numbers':
        this.pushNumber(number)
        break;
      case 'plus':
        this.pushNumber(number)
        this.modeValue = 'plus';
        break;
      case 'minus':
        this.pushNumber(number)
        this.modeValue = 'minus';
        break;
      case 'equals':
        this.clearScreen()
        this.pushNumber(number)
        this.modeValue = 'numbers'
        break;
      case 'timer':
        this.pushNumber(number);
        break;
      case 'cook':
        this.pushNumber(number);
        break;
      default:
    }
  }

  clock() {
    this.clearScreen();
    this.modeValue = 'clock'
    clearInterval(this.timeInterval);
    this.renderTime()
    this.timeInterval = setInterval(() => {
      this.renderTime()
      this.colonBlink()
    }, 1000);
  }

  timer() {
    this.clearScreen();
    this.modeValue = 'timer';
    this.kitchenTimerTarget.classList.add('pushed')
  }
  
  cook() {
    this.clearScreen();
    this.modeValue = 'cook';
    this.timeCookTarget.classList.add('pushed')
  }

  start() {
    if (this.modeValue === 'timer' || this.modeValue === 'paused-timer') {
      this.modeValue = 'timing';
      this.startTimer();
    } else if (this.modeValue === 'cook' || this.modeValue === 'paused-cook') {
      this.startCook()
    } else {
      this.clearScreen();
      this.renderNumbers(30);
      this.startCook();
    }
  }

  cancel() {
    let number = this.number;
    if (this.modeValue === 'timing') {
      this.clearScreen();
      this.renderNumbers(number);
      this.modeValue = 'paused-timer'
    } else if (this.modeValue === 'cooking') {
      this.dispatch('cancel');
      this.stopFan();
      this.clearScreen();
      this.renderNumbers(number);
      this.modeValue = 'paused-cook'
    } else {
      this.clock();
    }
  }

  add() {
    this.kitchenTimerTarget.classList.remove('pushed');
    if (this.modeValue !== 'clock') {
      this.sumValue += this.number;
    }
    this.modeValue = 'plus'
    this.clearScreen();
  }

  subtract() {
    this.kitchenTimerTarget.classList.remove('pushed');
    if (this.modeValue !== 'clock') {
      this.sumValue += this.number;
    }
    this.modeValue = 'minus'
    this.clearScreen();
  }

  equals() {
    if (this.modeValue === 'minus') {
      this.sumValue -= this.number;
    } else if (this.modeValue === 'plus') {
      this.sumValue += this.number;
    }
    this.modeValue = 'equals'
    this.renderNumbers(this.sumValue)
    this.sumValue = 0;
  }

  get hour() {
    let hours = new Date().getHours();
    hours = (Math.abs(hours > 12 || hours === 0 ? hours - 12 : hours)).
      toString()
      .padStart(2, '0');
    let digits = [];
    digits.push(hours[0]);
    digits.push(hours[1]);

    return digits;
  }

  get minutes() {
    const minutes = new Date()
      .getMinutes()
      .toString()
      .padStart(2, '0');
    let digits = [];
    digits.push(minutes[0]);
    digits.push(minutes[1]);

    return digits;
  }

  get numbers() {
    let numbers = [];
    numbers.push(this.hourLeftTarget.classList[0]);
    numbers.push(this.hourRightTarget.classList[0]);
    numbers.push(this.minLeftTarget.classList[0]);
    numbers.push(this.minRightTarget.classList[0]);

    return numbers;
  }

  get number() {
    const numbers = this.numbers;
    let number = ''
    number += Object.keys(this.digitMapping).find(key => this.digitMapping[key] === numbers[0]);
    number += Object.keys(this.digitMapping).find(key => this.digitMapping[key] === numbers[1]);
    number += Object.keys(this.digitMapping).find(key => this.digitMapping[key] === numbers[2]);
    number += Object.keys(this.digitMapping).find(key => this.digitMapping[key] === numbers[3]);
    return parseInt(this.sanitizeNegative(number));
  }

  get numberString() {
    return this.number.toString().padStart(4, '0')
  }

  sanitizeNegative(num) {
    return num.replaceAll(/\d(?=(.*\-))/g, '');
  }

  pushNumber(number) {
    if (this.modeValue == 'clock') { 
      this.clearScreen();
    }
    // this.modeValue = 'numbers';
    let newNumbers = [...this.numbers, number];
    newNumbers.shift();
    this.renderDisplay(newNumbers)
  }

  colonBlink() {
    this.colonTarget.classList.add("blank");
    setTimeout(() => {
      this.colonTarget.classList.remove("blank");
    }, 200);
  }

  renderTime() {
    let numbers = [];
    numbers.push(this.digitMapping[this.hour[0]]);
    numbers.push(this.digitMapping[this.hour[1]]);
    numbers.push(this.digitMapping[this.minutes[0]]);
    numbers.push(this.digitMapping[this.minutes[1]]);

    this.renderDisplay(numbers)
  }

  renderNumbers(numbers) {
    let numbersString = numbers.toString().padStart(4, '0');
    let numbersArray = []
    let num = isNaN(numbersString[0]) ? numbersString[0] : parseInt(numbersString[0])
    numbersArray.push(this.digitMapping[num]);
    num = isNaN(numbersString[1]) ? numbersString[1] : parseInt(numbersString[1])
    numbersArray.push(this.digitMapping[num]);
    num = isNaN(numbersString[2]) ? numbersString[2] : parseInt(numbersString[2])
    numbersArray.push(this.digitMapping[num]);
    num = isNaN(numbersString[3]) ? numbersString[3] : parseInt(numbersString[3])
    numbersArray.push(this.digitMapping[num]);

    this.renderDisplay(numbersArray)
  }

  renderDisplay(chars) {
    const hourLeft = chars[0];
    const hourRight = chars[1];
    const minLeft = chars[2];
    const minRight = chars[3];

    this.renderChar(this.hourLeftTarget, hourLeft);
    this.renderChar(this.hourRightTarget, hourRight);
    this.renderChar(this.minLeftTarget, minLeft);
    this.renderChar(this.minRightTarget, minRight);
  }

  renderChar(target, char) {
    let klass = target.classList[0];

    if (klass) {
      target.classList.replace(klass, char)
    } else {
      target.classList.add(char);
    }
  }

  clearScreen(charArray = null) {
    clearInterval(this.timerInterval);
    clearInterval(this.timeInterval);
    this.colonTarget.classList.add("blank");
    this.kitchenTimerTarget.classList.remove('pushed');
    this.timeCookTarget.classList.remove('pushed');
    if (charArray) {
      this.renderDisplay(charArray)
    } else {
      this.renderDisplay(['zero','zero','zero','zero'])
    }
  }

  startCook() {
    this.modeValue = 'cooking';
    this.dispatch('cook')
    this.fan();
    this.startTimer();
  }

  endCook() {
    this.ding()
    setTimeout(() => {
      this.dispatch('cancel');
    }, 800)
    setTimeout(() => {
      this.stopFan();
    }, 400);
  }

  startTimer() {
    this.colonBlink();
    let time = this.number;
    this.timerInterval = setInterval(() => {
      time -= 1;
      if (time <= 0) {
        this.endTimer();
        return;
      }
      this.renderNumbers(time);
      this.colonBlink();
    }, 1000);
  }

  endTimer() {
    if (this.modeValue === 'cooking') {
      this.endCook();
    }
    this.ding();
    this.clearScreen(['blank', 'E', 'n', 'd']);
  }
}
