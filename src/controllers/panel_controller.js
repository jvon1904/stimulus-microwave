import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

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

  buttonPress(e) {
    console.log(this.modeValue)
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
    if (this.modeValue === 'timer' || this.modeValue === 'paused') {
      this.startTimer();
    } else if (this.modeValue === 'cook') {
      this.modeValue = 'cooking';
      this.startTimer();
    } else {
      this.clearScreen();
      this.modeValue = 'cooking';
      this.renderNumbers(30);
      this.startTimer();
    }
  }

  cancel() {
    if (this.modeValue === 'counting') {
      let number = this.number;
      this.clearScreen();
      this.renderNumbers(number);
      this.modeValue = 'paused'
    } else {
      this.clock();
    }
  }

  add() {
    this.kitchenTimerTarget.classList.remove('pushed');
    this.modeValue = 'plus'
    this.sum += this.number;
    this.clearScreen();
  }

  subtract() {
    this.kitchenTimerTarget.classList.remove('pushed');
    this.sum += this.number;
    this.modeValue = 'minus'
    this.clearScreen();
  }

  equals() {
    console.log("from equals ", this.modeValue)
    console.log(this.sum)
    if (this.modeValue === 'minus') {
      this.sum -= this.number;
    } else if (this.modeValue === 'plus') {
      console.log("hello!")
      this.sum += this.number;
    }
    console.log(this.sum)
    this.modeValue = 'equals'
    this.renderNumbers(this.sum)
    this.sum = 0;
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

    return parseInt(number);
  }

  get numberString() {
    return this.number.toString().padStart(4, '0')
  }

  pushNumber(number) {
    if (this.modeValue == 'clock') { 
      this.clearScreen();
    }
    // this.modeValue = 'numbers';
    let newNumbers = [...this.numbers, number];
    newNumbers.shift();
    this.renderNumber(newNumbers)
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

    this.renderNumber(numbers)
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

    this.renderNumber(numbersArray)
  }

  renderNumber(numbers) {
    const hourLeft = numbers[0];
    const hourRight = numbers[1];
    const minLeft = numbers[2];
    const minRight = numbers[3];

    this.renderDigit(this.hourLeftTarget, hourLeft);
    this.renderDigit(this.hourRightTarget, hourRight);
    this.renderDigit(this.minLeftTarget, minLeft);
    this.renderDigit(this.minRightTarget, minRight);
  }

  renderDigit(target, number) {
    let klass = target.classList[0];

    if (klass) {
      target.classList.replace(klass, number)
    } else {
      target.classList.add(number);
    }
  }

  clearScreen() {
    clearInterval(this.timerInterval);
    clearInterval(this.timeInterval);
    this.colonTarget.classList.add("blank");
    this.kitchenTimerTarget.classList.remove('pushed');
    this.timeCookTarget.classList.remove('pushed');
    this.renderNumber(['zero','zero','zero','zero'])
  }

  startTimer() {
    this.modeValue = 'counting'
    this.colonBlink();
    let time = this.number;
    this.timerInterval = setInterval(() => {
      time -= 1;
      if (time < 0) {
        this.clearScreen();
        if (this.modeValue === 'cooking') {
          this.endCook();
        }
        return;
      }
      this.renderNumbers(time);
      this.colonBlink();
    }, 1000);
  }

  endCook() {
    console.log('cooking ended');
    this.modeValue = 'numbers'
  }
}
