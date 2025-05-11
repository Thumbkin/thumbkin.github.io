const PLANNER_EXCERSIZE = new PlannerExcersize();
const ANIMATOR = new Animator(0);

function resetHuidigeSituatie() {
    PLANNER_EXCERSIZE.resetStartingSituation();

    document.getElementById("lijst_processen").innerHTML =
        "<tr>" +
            "<th>Proces</th>" +
            "<th>Start op</th>" +
            "<th>Lengte</th>" +
            "<th></th>" +
        "</tr>";

    addNewProcessRow();
}

function runSchedulers () {
    document.getElementById("resultaten_container").style.display = "none";
    // eerst controleren of we wel minstens een proces hebben
    if(PLANNER_EXCERSIZE.getStartingSituation().isValid()) {
        // chcken of we minsntes 1 planner hebben geselecteerd
        PLANNER_EXCERSIZE.resetSchedulers();

        let cb_ids = [ 'FCFS', 'SPN', 'SRT', 'RR_one', 'RR_two', 'RR_three'];

        for(let i = 0; i < cb_ids.length; i++){
            if(document.getElementById('cb_planners_' + cb_ids[i]).checked === true){
                if(cb_ids[i].startsWith('RR')){
                    let q_value = Number(document.getElementById('sel_planners_' + cb_ids[i] + '_q').value);
                    PLANNER_EXCERSIZE.addScheduler(SCHEDULER_TYPES.get('RR'), q_value);
                }
                else {
                    PLANNER_EXCERSIZE.addScheduler(SCHEDULER_TYPES.get(cb_ids[i]), 0);
                }
            }
        }

        if(PLANNER_EXCERSIZE.hasAtLeastOnePlanner()) {
            PLANNER_EXCERSIZE.executeSchedulers();

            document.getElementById("resultaten_stap");
            // change the value of the slider to total amountof steps and auto set it to last step
            document.getElementById("inp_range_steps").max = PLANNER_EXCERSIZE.getTotalNumberOfSteps() - 1;
            document.getElementById("inp_range_steps").value = PLANNER_EXCERSIZE.getTotalNumberOfSteps() - 1;

            ANIMATOR.setMaxSteps(PLANNER_EXCERSIZE.getTotalNumberOfSteps());

            document.getElementById("resultaten_planners").innerHTML = "";
            // render the final step
            HTML_GENERATOR.renderStep(PLANNER_EXCERSIZE.getTotalNumberOfSteps() - 1);

            document.getElementById("resultaten_container").style.display = "block";
        }
        else {
            alert("Er moet minstens 1 planner aangeduid worden!");
        }
    }
    else {
        alert("Er moet minstens 1 proces gepland worden met resterende uitvoeringstijd!");
    }
}

function updateProcessStart(process_id){
    let start = Number(document.getElementById("dd_start_" + process_id).value);
    PLANNER_EXCERSIZE.updateStartTimeProcess(process_id, start);

    // render de nieuwe startsituatie
    document.getElementById("beginsituatie").innerHTML = HTML_GENERATOR.getStartingSituationAsHTML(PLANNER_EXCERSIZE.getStartingSituation());
}

function updateProcessLength(process_id){
    let length = Number(document.getElementById("dd_length_" + process_id).value);
    PLANNER_EXCERSIZE.updateLengthProcess(process_id, length);

    // render de nieuwe startsituatie
    document.getElementById("beginsituatie").innerHTML = HTML_GENERATOR.getStartingSituationAsHTML(PLANNER_EXCERSIZE.getStartingSituation());
}

function addProcess(process_id) {
    // get the values from the drop downs
    let start = Number(document.getElementById("dd_start_" + process_id).value);
    let length = Number(document.getElementById("dd_length_" + process_id).value);
    PLANNER_EXCERSIZE.addProcess(process_id, start, length);

    // change the icon in the table to edit instead of add
    HTML_GENERATOR.setProcessRemoveButton(process_id);

    start = Number(document.getElementById("dd_start_" + process_id).value);
    length = Number(document.getElementById("dd_length_" + process_id).value);
    // if we have an unused color left, add a new row to add
    if(PLANNER_EXCERSIZE.getTotalNumberOfProcesses() < PROCESS_IDS.length){
        HTML_GENERATOR.addNewProcessRow();
    }

    start = Number(document.getElementById("dd_start_" + process_id).value);
    length = Number(document.getElementById("dd_length_" + process_id).value);
    // render de nieuwe startsituatie
    document.getElementById("container_starting_situation").innerHTML = HTML_GENERATOR.getStartingSituationAsHTML(PLANNER_EXCERSIZE.getStartingSituation());
}

function removeProcess(process_id) {
    PLANNER_EXCERSIZE.removeProcess(process_id);

    HTML_GENERATOR.removeProcessRow(process_id);
}

function loadFirstStep() {
    loadStep(0);
}

function loadPreviousStep() {
    loadStep(Number(document.getElementById("inp_range_steps").value) - 1);
}

function loadNextStep() {
    loadStep(Number(document.getElementById("inp_range_steps").value) + 1);
}

function loadLastStep() {
    loadStep(Number(document.getElementById("inp_range_steps").max));
}

function loadCurrentStep() {
    loadStep(Number(document.getElementById("inp_range_steps").value));
}

function loadStep(step_number){
    // stop animitor if running
    if(ANIMATOR.isRunning()) { ANIMATOR.stop(); }
    HTML_GENERATOR.renderStep(step_number);
}