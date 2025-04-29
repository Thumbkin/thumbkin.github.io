class ReasonsToChoose {
    static NONE = new ReasonsToChoose('Vorige proces wordt verder uitgevoerd');
    static NO_PROCESS_AVAILABLE = new ReasonsToChoose('Geen proces beschikbaar ter uitvoering');
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