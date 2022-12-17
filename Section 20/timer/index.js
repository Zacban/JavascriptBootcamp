import { Timer } from "./timer.js";

const durationInput = document.querySelector('#duration');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const circle = document.querySelector('circle');

var perimiter = circle.getAttribute('r') * Math.PI * 2;
console.log(`perimiter is ${perimiter}`);
circle.setAttribute('stroke-dasharray', perimiter);

let duration;
const timer = new Timer(durationInput, startButton, pauseButton, {
    onStart(totalDuration) {
        duration = totalDuration;
    },
    onTick(timeRemaining) {
        circle.setAttribute('stroke-dashoffset', perimiter * timeRemaining / duration -  perimiter);
    },
    onCompleted() {
        console.log('Completed');
    }
});