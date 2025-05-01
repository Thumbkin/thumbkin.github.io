class Process {
    constructor (id, start, length) {
        this.id = id;
        this.start = start;
        this.length = length;
        this.remaining = this.length;
    }

    getId () {
        return this.id;
    }

    getStart() {
        return this.start;
    }

    getLength () {
        return this.length;
    }

    getRemaining () {
        return this.remaining;
    }

    isFinished(){
        return this.remaining <= 0;
    }

    executeStep() {
        this.remaining--;
    }
}