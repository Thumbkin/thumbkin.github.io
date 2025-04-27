class ProcessColors {
    static YELLOW = new ProcessColors('#fff2cc');
    static GREEN = new ProcessColors('#c5e0b4');
    static ORANGE = new ProcessColors('#f8cbad');
    static BLUE = new ProcessColors('#b4c7e7');
    static GRAY = new ProcessColors('#d9d9d9');
    static RED = new ProcessColors('#ffa0a0');
    static BROWN = new ProcessColors('#d0a172');
    static PURPLE = new ProcessColors('#f1b3ff');

    constructor(name) {
        this.name = name;
    }
    toString() {
        return `ProcessColors.${this.name}`;
    }
    getColorValue() {
        return this.name;
    }
}