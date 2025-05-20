class DomainController {
    planner_excersize;

    // Creates a new domain controller
    constructor() {
        // Creates e new empty planner
        this.planner_excersize = new PlannerExcersize();
    }

    resetStartingSituation() {
        this.planner_excersize.resetStartingSituation();
        GC.resetProcessInformation();
    }

    getStartingSituation() {
        return this.planner_excersize.getStartingSituation();
    }

    getNextUnusedProcessId() {
        return this.planner_excersize.getNextUnusedProcessId();
    }

    runSchedulers () {
        GC.hideResults();
        // eerst controleren of we wel minstens een proces hebben
        if(this.planner_excersize.getStartingSituation().isValid()) {
            // checken of we minsntes 1 planner hebben geselecteerd
            this.planner_excersize.resetSchedulers();

            let cb_ids = [ 'FCFS', 'SPN', 'SRT', 'RR_one', 'RR_two', 'RR_three'];

            for(let i = 0; i < cb_ids.length; i++){
                if(document.getElementById('cb_planners_' + cb_ids[i]).checked === true){
                    if(cb_ids[i].startsWith('RR')){
                        let q_value = Number(document.getElementById('sel_planners_' + cb_ids[i] + '_q').value);
                        this.planner_excersize.addScheduler(SCHEDULER_TYPES.get('RR'), q_value);
                    }
                    else {
                        this.planner_excersize.addScheduler(SCHEDULER_TYPES.get(cb_ids[i]), 0);
                    }
                }
            }

            if(this.planner_excersize.hasAtLeastOnePlanner()) {
                this.planner_excersize.executeSchedulers();
                GC.setMaxSteps(this.planner_excersize.getTotalNumberOfSteps());

                GC.renderStep(this.planner_excersize.getTotalNumberOfSteps() - 1);
            }
            else {
                alert("Er moet minstens 1 planner aangeduid worden!");
            }
        }
        else {
            alert("Er moet minstens 1 proces gepland worden met resterende uitvoeringstijd!");
        }
    }

    updateProcessStart(process_id){
        let start = Number(document.getElementById("dd_start_" + process_id).value);
        this.planner_excersize.updateStartTimeProcess(process_id, start);

        // render de nieuwe startsituatie
        GC.renderStartingSituation(this.planner_excersize.getStartingSituation());
    }

    updateProcessLength(process_id){
        let length = Number(document.getElementById("dd_length_" + process_id).value);
        this.planner_excersize.updateLengthProcess(process_id, length);

        // render de nieuwe startsituatie
        GC.renderStartingSituation(this.planner_excersize.getStartingSituation());
    }

    addProcess(process_id) {
        // get the values from the drop downs
        let start = GC.getValueOfDropDownAsNumber("dd_start_" + process_id);
        let length = GC.getValueOfDropDownAsNumber("dd_length_" + process_id);
        this.planner_excersize.addProcess(process_id, start, length);

        // change the icon in the table to edit instead of add
        GC.setProcessRemoveButton(process_id);

        // if we have an unused color left, add a new row to add
        if(this.planner_excersize.getTotalNumberOfProcesses() < PROCESS_IDS.length){
            GC.addNewProcessRow();
        }

        // render de nieuwe startsituatie
        GC.renderStartingSituation(this.planner_excersize.getStartingSituation());
    }

    removeProcess(process_id) {
        this.planner_excersize.removeProcess(process_id);
        GC.removeProcessRow(process_id);
    }

    loadFirstStep() {
        loadStep(0);
    }

    loadPreviousStep() {
        loadStep(GC.getValueOfDropDownAsNumber("inp_range_steps") - 1);
    }

    loadNextStep() {
        loadStep(GC.getValueOfDropDownAsNumber("inp_range_steps") + 1);
    }

    loadLastStep() {
        loadStep(GC.getMaxValueOfDropDownAsNumber("inp_range_steps"));
    }

    loadCurrentStep() {
        loadStep(GC.getValueOfDropDownAsNumber("inp_range_steps"));
    }

    loadStep(step_number){
        // stop animitor if running
        GC.stopAnimationIfRunning();
        GC.renderStep(step_number);
    }

    getTotalNumberOfSteps(){
        return this.planner_excersize.getTotalNumberOfSteps();
    }

    getSolutionSchedulers(){
        return this.planner_excersize.getSchedulers();
    }
}