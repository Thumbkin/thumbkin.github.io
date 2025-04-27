class ReasonsToChoose {
    static FIRST_IN_QUEUE = new ReasonsToChoose('Eerste uit wachtrij');
    static SHORTEST_IN_QUEUE = new ReasonsToChoose('Kortste proces in wachtrij');
    static SHORTEST_TIME_LEFT_IN_QUEUE = new ReasonsToChoose('Proces met kleinste resterende uitvoeringstijd in wachtrij');

    constructor(name) {
        this.name = name;
    }
    toString() {
        return `ReasonsToChoose.${this.name}`;
    }
    toValue() {
        return this.name;
    }
}