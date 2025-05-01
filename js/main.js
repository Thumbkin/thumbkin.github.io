let startingSituation = new StartingSituation();

function resetHuidigeSituatie() {
    startingSituation = new StartingSituation();

    document.getElementById("lijst_processen").innerHTML =
        "<tr>" +
            "<th>Proces</th>" +
            "<th>Start op</th>" +
            "<th>Lengte</th>" +
            "<th></th>" +
        "</tr>";

    addNewProcessRow();
}

// laad een vooraf genmaakte situatie zoals in de slides
function laadStartSituatie(type) {
    resetHuidigeSituatie();

    const test_situatie = new Map();
    if(type === "Klas") { laadStartSituatieKlas() };
    if(type === "GrootNaarKlein") { laadStartSituatieGrootNaarKlein() };
    if(type === "KleinNaarGroot") { laadStartSituatieKleinNaarGroot() };
    if(type === "LangeProcessen") { laadStartSituatieLangeProcessen() };
    if(type === "KorteProcessen") { laadStartSituatieKorteProcessen() };
    if(type === "AlleKleuren") { laadStartSituatieAlleKleuren() };
}

function laadStartSituatieKlas() {
    voegStartProcesToe("A", 0, 7);
    voegStartProcesToe("B", 1, 4);
    voegStartProcesToe("C", 2, 2);
    voegStartProcesToe("D", 3, 10);
    voegStartProcesToe("E", 4, 1);
    voegStartProcesToe("F", 5, 6);
    voegStartProcesToe("G", 7, 3);
    voegStartProcesToe("H", 20, 2);
}

function laadStartSituatieGrootNaarKlein() {
    voegStartProcesToe("A", 0, 12);
    voegStartProcesToe("B", 1, 10);
    voegStartProcesToe("C", 2, 8);
    voegStartProcesToe("D", 3, 6);
    voegStartProcesToe("E", 4, 4);
    voegStartProcesToe("F", 5, 2);
}

function laadStartSituatieKleinNaarGroot() {
    voegStartProcesToe("A", 0, 2);
    voegStartProcesToe("B", 1, 4);
    voegStartProcesToe("C", 2, 6);
    voegStartProcesToe("D", 3, 8);
    voegStartProcesToe("E", 4, 10);
    voegStartProcesToe("F", 5, 12);
}

function laadStartSituatieKorteProcessen() {
    voegStartProcesToe("A", 0, 5);
    voegStartProcesToe("B", 0, 4);
    voegStartProcesToe("C", 0, 8);
    voegStartProcesToe("D", 2, 6);
    voegStartProcesToe("E", 3, 3);
    voegStartProcesToe("F", 5, 5);
    voegStartProcesToe("G", 6, 2);
    voegStartProcesToe("H", 6, 5);
}

function laadStartSituatieLangeProcessen() {
    voegStartProcesToe("A", 0, 7);
    voegStartProcesToe("B", 0, 9);
    voegStartProcesToe("C", 0, 8);
    voegStartProcesToe("D", 2, 5);
    voegStartProcesToe("E", 3, 10);
    voegStartProcesToe("F", 4, 4);
    voegStartProcesToe("G", 4, 2);
    voegStartProcesToe("H", 6, 5);
}

function laadStartSituatieAlleKleuren() {
    voegStartProcesToe("A", 0, 7);
    voegStartProcesToe("B", 1, 4);
    voegStartProcesToe("C", 2, 2);
    voegStartProcesToe("D", 3, 10);
    voegStartProcesToe("E", 4, 1);
    voegStartProcesToe("F", 5, 6);
    voegStartProcesToe("G", 7, 3);
    voegStartProcesToe("H", 20, 2);
    voegStartProcesToe("I", 1, 4);
    voegStartProcesToe("J", 2, 2);
    voegStartProcesToe("K", 3, 10);
    voegStartProcesToe("L", 4, 1);
    voegStartProcesToe("M", 5, 6);
    voegStartProcesToe("N", 7, 3);
    voegStartProcesToe("O", 20, 2);
    voegStartProcesToe("P", 1, 4);
    voegStartProcesToe("Q", 2, 2);
    voegStartProcesToe("R", 3, 10);
    voegStartProcesToe("S", 4, 1);
    voegStartProcesToe("T", 5, 6);
    voegStartProcesToe("U", 7, 3);
    voegStartProcesToe("V", 20, 2);
    voegStartProcesToe("W", 3, 10);
    voegStartProcesToe("X", 4, 1);
    voegStartProcesToe("Y", 5, 6);
    voegStartProcesToe("Z", 7, 3);
}

function voegStartProcesToe(process_id, start, length){
    document.getElementById("dd_start_" + process_id).value = start;
    document.getElementById("dd_length_" + process_id).value = length;

    addProcess(process_id);
}

function runSchedulers () {
    if(startingSituation.isValid()) {
        document.getElementById("resultaten_planners").innerHTML = "<h2>Resultaten</h2><br>";

        let PROCESSES = startingSituation.getProcesses();
        let scheduler_fcfs = new Scheduler(SCHEDULER_TYPES.get('FCFS'), 0, PROCESSES);
        scheduler_fcfs.executePlanner();

        PROCESSES = startingSituation.getProcesses();
        let scheduler_spn = new Scheduler(SCHEDULER_TYPES.get('SPN'), 0, PROCESSES);
        scheduler_spn.executePlanner();

        PROCESSES = startingSituation.getProcesses();
        let scheduler_srt = new Scheduler(SCHEDULER_TYPES.get('SRT'), 0, PROCESSES);
        scheduler_srt.executePlanner();

        PROCESSES = startingSituation.getProcesses();
        let scheduler_rr_3 = new Scheduler(SCHEDULER_TYPES.get('RR'), 3, PROCESSES);
        scheduler_rr_3.executePlanner();

        PROCESSES = startingSituation.getProcesses();
        let scheduler_rr_4 = new Scheduler(SCHEDULER_TYPES.get('RR'), 4, PROCESSES);
        scheduler_rr_4.executePlanner();

        PROCESSES = startingSituation.getProcesses();
        let scheduler_rr_5 = new Scheduler(SCHEDULER_TYPES.get('RR'), 5, PROCESSES);
        scheduler_rr_5.executePlanner();

        // show results off all schedulers at once
        document.getElementById("resultaten_planners").innerHTML += "<br>" + scheduler_srt.getSolutionsAsHTML([scheduler_fcfs, scheduler_spn, scheduler_srt, scheduler_rr_3, scheduler_rr_4, scheduler_rr_5]);
    }
    else {
        alert("Er moet minstens 1 proces gepland worden met resterende uitvoeringstijd!");
    }
}

function renderOpgave(){
    document.getElementById("opgave").innerHTML = startingSituation.getAsHTML();
}

function changeProcessStart(id, start){
    alert('ChangeProcess ' + id + " start to " + start);
    startingSituation.updateStartProcess(id, start);
}

function changeProcessLength(id, length){
    alert('ChangeProcess ' + id + " length to " + length);
    startingSituation.updateLengthProcess(id, length);
}

function addProcess(process_id) {
    // get the values from the drop downs
    let start = document.getElementById("dd_start_" + process_id).value;
    let length = document.getElementById("dd_length_" + process_id).value;
    startingSituation.addProcess(new Process(process_id, start, length));
    // change the icon in the table to edit instead of add
    document.getElementById("btns_" + process_id).innerHTML = "<button onclick=\"removeProcess('" + process_id + "');\">Remove</buton>";

    // if we have an unused color left, add a new row to add
    if(startingSituation.getAmountOfProcesses() < PROCESS_IDS.length){
        addNewProcessRow();
    }

    // render de nieuwe startsituatie
    document.getElementById("beginsituatie").innerHTML = startingSituation.getAsHTML();
}

function removeProcess(process_id) {
    startingSituation.removeProcess(process_id);
    // remove row from table in step 1
    document.getElementById("table_row_"+ process_id).remove();
    // if we removed the last process, add a dummy again
    if(startingSituation.getAmountOfProcesses() <= 0){
        addNewProcessRow();
    }

    // render de nieuwe startsituatie
    document.getElementById("beginsituatie").innerHTML = startingSituation.getAsHTML();
}

function addNewProcessRow (){
    let process_id = startingSituation.getNextUnusedProcessId();

    let innerHTML = document.getElementById("lijst_processen").innerHTML
    innerHTML += "<tr id=\"table_row_"+ process_id + "\">";
    innerHTML += "<td class='step_one_process' style='background-color: " + PROCESS_COLORS.get(process_id) +"'>" + process_id + "</td>";
    innerHTML += "<td>" + generateDropDown(process_id, "start") + "</td>";
    innerHTML += "<td>" + generateDropDown(process_id, "length") + "</td>";
    innerHTML += "<td id=\"btns_" + process_id + "\" ><button onclick=\"addProcess('" + process_id + "');\">Add</buton></td>";
    innerHTML += "</tr>";
    document.getElementById("lijst_processen").innerHTML = innerHTML
}

// genereert html code voor een drop down voor start of lengte
function generateDropDown (process_id, type) {
    let innerHTML = "<select id=\"dd_" + type + "_" + process_id + "\">";
    let i = 0;
    // if type = length, then start from 1
    if (type === "length") i = 1;
    // add numbers 0 to 50 as possible values
    for (; i <= 50; i++) {
        innerHTML += "<option value=\"" + i + "\">" + i + "</option>";
    }
    innerHTML += "</select>";
    return innerHTML
}
