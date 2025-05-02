class PlannerExcersize {
    starting_situation;
    schedulers;

    constructor() {
        this.starting_situation = new StartingSituation();
        this.schedulers = [];
    }

    addProcess(process_id, start, length){
        this.starting_situation.addProcess(new Process(process_id, start, length));
    }

    removeProcess(process_id) {
        this.starting_situation.removeProcess(process_id);
    }

    updateStartTimeProcess(process_id, start){
        this.starting_situation.updateStartTimeProcess(process_id, start);
    }

    updateLengthProcess(processID, length){
        this.starting_situation.updateLengthProcess(process_id, length);
    }

    addScheduler(scheduler_type, q_value){
        this.schedulers.push(new Scheduler(scheduler_type, q_value, this.starting_situation.getProcesses()));
    }

    resetStartingSituation(){
        this.starting_situation = new StartingSituation();
    }

    resetSchedulers(){
        this.schedulers = [];
    }

    executeSchedulers(){
        for(let i = 0; i < this.schedulers.length; i++){
            this.schedulers[i].executePlanner();
        }
    }

    getStartingSituation(){
        return this.starting_situation;
    }

    getSchedulers(){
        return this.schedulers;
    }

    getTotalNumberOfSteps(){
        return this.schedulers[0].getTotalNumberOfSteps();
    }

    getTotalNumberOfProcesses(){
        return this.starting_situation.getAmountOfProcesses();
    }

    hasAtLeastOnePlanner(){
        return this.schedulers.length > 0;
    }

    getNextUnusedProcessId() {
        return this.starting_situation.getNextUnusedProcessId();
    }
}