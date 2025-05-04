const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

class Animator {
    constructor(max_steps) {
        this.is_running = false;
        this.step = 0;
        this.max_steps = max_steps;
    }

    run = async () => {
        while (this.isRunning() && this.step < this.max_steps) {
            HTML_GENERATOR.renderStep(this.step);
            this.step++;
            await sleep(1500);
        }
    }

    play(){
        this.is_running = true;
        document.getElementById("btn_play_steps_run").style.visibility = "hidden";
        document.getElementById("btn_play_steps_pause").style.visibility = "visible";
        ANIMATOR.run();
    }

    isRunning(){
        return this.is_running;
    }

    pause() {
        this.is_running = false;
        document.getElementById("btn_play_steps_run").style.visibility = "visible";
        document.getElementById("btn_play_steps_pause").style.visibility = "hidden";
    }

    stop(){
        this.is_running = false;
        this.step = 0;
        document.getElementById("btn_play_steps_run").style.visibility = "visible";
        document.getElementById("btn_play_steps_pause").style.visibility = "hidden";
    }

    setMaxSteps(max_steps) {
        this.max_steps = max_steps;
    }
}