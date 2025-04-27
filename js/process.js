class Process {
    constructor (id, start, length, color) {
        this.id = id;
        this.start = start;
        this.length = length;
        this.remaining = this.length;
        this.color = color;
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

    getColor () {
        return this.color;
    }
    getHtmlColor () {
        return this.color.getColorValue();
    }

    isFinished(){
        return this.remaining <= 0;
    }

    executeStep() {
        this.remaining--;
    }
    toHTML() {
        return '&nbsp;&nbsp;&nbsp;&nbsp;Proces ' + this.id + "<br>" +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Start op: ' + this.start + "<br>" +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# uit te voeren: ' + this.length + "<br>" +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# nog uit te voeren: ' + this.remaining + "<br>";
    }
}