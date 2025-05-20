class Process {
    constructor (id, start, length) {
        this.id = id;
        this.start = Number(start);
        this.length = Number(length);
        this.remaining = Number(this.length);
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

    setStart(start) {
        this.start = start;
    }

    setLength (length) {
        this.length = length;
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