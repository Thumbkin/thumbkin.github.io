class ReasonsToSwap {
    static NONE = new ReasonsToSwap('Huidige proces is nog niet volledig uitgevoerd');
    static Q_VALUE_REACHED = new ReasonsToSwap('Q waarde is bereikt');
    static FINISHED = new ReasonsToSwap('Huidige proces was volledig uitgevoerd');
    static SHORTER_PROCESS = new ReasonsToSwap('Er is een korter proces beschikbaar');

    constructor(name) {
        this.name = name;
    }
    toString() {
        return `ReasonsToSwap.${this.name}`;
    }
    toValue() {
        return this.name;
    }
}