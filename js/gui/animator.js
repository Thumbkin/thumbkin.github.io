const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

class Animator {
    constructor(max_steps) {
        this.is_running = false;
        this.step = 0;
        this.max_steps = max_steps;
    }

    run = async () => {
        while (this.isRunning() && this.step < this.max_steps) {
            GC.renderStep(this.step);
            this.step++;
            await sleep(1500);
        }
    }

    play(){
        this.is_running = true;
        this.run();
    }

    isRunning(){
        return this.is_running;
    }

    pause() {
        this.is_running = false;
    }

    stop(){
        this.is_running = false;
        this.step = 0;
    }

    setMaxSteps(max_steps) {
        this.max_steps = max_steps;
    }
}