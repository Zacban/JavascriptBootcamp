export class Timer {
    constructor(durationInput, startButton, pauseButton, callbacks) {
        this.durationInput = durationInput;
        this.startButton = startButton;
        this.pauseButton = pauseButton;

        if (callbacks) {
            this.onStart = callbacks.onStart;
            this.onTick = callbacks.onTick;
            this.onCompleted = callbacks.onCompleted;
        }

        this.startButton.addEventListener('click', this.start);
        this.pauseButton.addEventListener('click', this.pause);

        console.log('initialized timer');
    }

    start = () => {
        if (this.onStart)
            this.onStart(this.timeRemaining);

        this.tick();
        this.interval = setInterval(this.tick, 50);
    }

    tick = () => {
        if (this.timeRemaining == 0) {
            this.pause();
            if (this.onCompleted)
                this.onCompleted();
        }
        else {
            this.timeRemaining = this.timeRemaining - 0.05;
            if (this.onTick)
                this.onTick(this.timeRemaining);
        }
    }

    pause = () => {
        clearInterval(this.interval);
    }

    onDurationChange = () => {

    }

    get timeRemaining() {
        return parseFloat(this.durationInput.value);
    }

    set timeRemaining(time) {
        this.durationInput.value = time.toFixed(2);
    }
}