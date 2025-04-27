class SchedulerType {
    static FCFS = new SchedulerType('FCFS');
    static SPN = new SchedulerType('SPN');
    static SRT = new SchedulerType('SRT');
    static RR = new SchedulerType('RR');

    constructor(name) {
        this.name = name;
    }
    toString() {
        return `SchedulerType.${this.name}`;
    }
    getValue() {
        return this.name;
    }
}