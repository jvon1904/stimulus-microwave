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
    "am",
    "pm",
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "dow",
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
      case 'end':
        this.clearScreen()
        this.pushNumber(number);
        break;
      default:
    }
  }

  clock() {
    if (this.modeValue === 'leet' || this.modeValue === 'cooking' || this.modeValue === 'timing') {
      return false;
    }
    this.clearScreen();
    this.modeValue = 'clock'
    clearInterval(this.timeInterval);
    this.renderTime()
    this.timeInterval = setInterval(() => {
      this.renderTime()
      this.colonBlink()
    }, 1000);
  }

  am() {
    this.pmTarget.classList.remove('selected')
    this.amTarget.classList.add('selected')
  }
  
  pm() {
    this.amTarget.classList.remove('selected')
    this.pmTarget.classList.add('selected')
  }

  sun() {
    this.dowTargets.forEach((t) => {
      t.classList.remove('selected')
    });
    this.sunTarget.classList.add('selected');
  }

  mon() {
    this.dowTargets.forEach((t) => {
      t.classList.remove('selected')
    });
    this.monTarget.classList.add('selected');
  }

  tue() {
    this.dowTargets.forEach((t) => {
      t.classList.remove('selected')
    });
    this.tueTarget.classList.add('selected');
  }

  wed() {
    this.dowTargets.forEach((t) => {
      t.classList.remove('selected')
    });
    this.wedTarget.classList.add('selected');
  }

  thu() {
    this.dowTargets.forEach((t) => {
      t.classList.remove('selected')
    });
    this.thuTarget.classList.add('selected');
  }

  fri() {
    this.dowTargets.forEach((t) => {
      t.classList.remove('selected')
    });
    this.friTarget.classList.add('selected');
  }

  sat() {
    this.dowTargets.forEach((t) => {
      t.classList.remove('selected')
    });
    this.satTarget.classList.add('selected');
  }

  timer() {
    if (this.modeValue === 'leet') {
      return false
    } else if (this.modeValue === 'cooking' || this.modeValue === 'timing') {
      return false;
    }
    this.clearScreen();
    this.modeValue = 'timer';
    this.colonTarget.classList.remove("blank");
    this.kitchenTimerTarget.classList.add('pushed')
  }
  
  cook() {
    if (this.modeValue === 'leet') {
      return false
    } else if (this.modeValue === 'cooking' || this.modeValue === 'timing') {
      return false;
    }
    this.clearScreen();
    this.modeValue = 'cook';
    this.colonTarget.classList.remove("blank");
    this.timeCookTarget.classList.add('pushed')
  }

  start() {
    if (this.modeValue === 'leet') {
      return false;
    } else if (this.isLeet) {
      this.enterLeetMode();
    } else {
      if (this.modeValue === 'timer' || this.modeValue === 'paused-timer') {
        this.modeValue = 'timing';
        this.startTimer();
      } else if (this.modeValue === 'cook' || this.modeValue === 'paused-cook') {
        this.startCook()
      } else if (this.modeValue === 'cooking' || this.modeValue === 'timing') {
        this.renderNumbers(this.toTime(this.toSeconds(this.number) + 30));
      } else {
        this.clearScreen();
        this.renderNumbers(30);
        this.startCook();
      }
    }
  }

  cancel() {
    let number = this.number;
    if (this.modeValue === 'leet') {
      this.exitLeetMode();
    } else if (this.modeValue === 'timing') {
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
    if (this.modeValue === 'leet' || this.modeValue === 'cooking' || this.modeValue === 'timing') {
      return false;
    }
    this.kitchenTimerTarget.classList.remove('pushed');
    if (this.modeValue !== 'clock') {
      this.sumValue += this.number;
    }
    this.modeValue = 'plus'
    this.clearScreen();
  }

  subtract() {
    if (this.modeValue === 'leet' || this.modeValue === 'cooking' || this.modeValue === 'timing') {
      return false;
    }
    this.kitchenTimerTarget.classList.remove('pushed');
    if (this.modeValue !== 'clock') {
      this.sumValue += this.number;
    }
    this.modeValue = 'minus'
    this.clearScreen();
  }

  equals() {
    if (this.modeValue === 'leet' || this.modeValue === 'cooking' || this.modeValue === 'timing') {
      return false;
    }
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

  get amPm() {
    if (this.hour <= 12) {
      return 'am'
    } else {
      return 'pm'
    }
  }

  get day() {
    return new Date().getDay();
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

  get isLeet() {
    return this.modeValue === 'numbers' && this.number === 1337;
  }

  sanitizeNegative(num) {
    return num.replaceAll(/\d(?=(.*\-))/g, '');
  }

  toTime(num) {
    const seconds = num % 60;
    const minutes = (num - seconds) / 60;
    const time = minutes.toString().padStart(2, '0') + seconds.toString().padStart(2, '0');
    return parseInt(time)
  }

  toSeconds(time) {
    const digits = time.toString().padStart(4, '0');
    const minutes = parseInt(digits.slice(0,2));
    const seconds = parseInt(digits.slice(2,4));
    return (minutes * 60) + seconds;
  }

  pushNumber(number) {
    if (this.modeValue == 'clock') { 
      this.clearScreen();
    }
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
    this.renderAmPm();
    this.renderDay(this.day);
    this.renderDisplay(numbers);
  }

  renderAmPm() {
    switch (this.amPm) {
      case 'am': 
        this.am();
        break;
      case 'pm':
        this.pm();
        break;
    }
  }

  clearAmPm() {
    this.amTarget.classList.remove('selected')
    this.pmTarget.classList.remove('selected')
  }

  renderDay(day) {
    switch (day) {
      case 0:
        this.sun();
        break;
      case 1:
        this.mon();
        break;
      case 2:
        this.tue();
        break;
      case 3:
        this.wed();
        break;
      case 4:
        this.thu();
        break;
      case 5:
        this.fri();
        break;
      case 6:
        this.sat();
        break;
    }
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
    this.clearAmPm();
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
    let time = this.number;
    if (time <= 0) {
      this.renderNumbers(30);
      time = this.number;
    }
    this.colonBlink();
    this.timerInterval = setInterval(() => {
      time = this.toTime(this.toSeconds(this.number) - 1);
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
    this.modeValue = 'end'
  }

  enterLeetMode() {
    const leetEvent = new CustomEvent("leet-mode");
    window.dispatchEvent(leetEvent);
    this.clearScreen(["L", "E", "E", "seven"])
    this.modeValue = "leet"
  }

  exitLeetMode() {
    const leetEvent = new CustomEvent("normal-mode");
    window.dispatchEvent(leetEvent);
    this.clearScreen(["one", "three", "three", "seven"])
    this.modeValue = "numbers";
  }
}
