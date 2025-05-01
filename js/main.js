let startingSituation = new StartingSituation();
startingSituation.addProcess(new Process("A", 0, 7));
startingSituation.addProcess(new Process("B", 1, 4));
startingSituation.addProcess(new Process("C", 2, 2));
startingSituation.addProcess(new Process("D", 3, 10));
startingSituation.addProcess(new Process("E", 4, 1));
startingSituation.addProcess(new Process("F", 5, 6));
startingSituation.addProcess(new Process("G", 7, 3));
startingSituation.addProcess(new Process("H", 20, 2));

function runSchedulers () {
    document.getElementById("results_scheduler").innerHTML = "";

    if(startingSituation.isValid()) {
        let processes = startingSituation.getProcesses();
        let scheduler_fcfs = new Scheduler(SchedulerType.FCFS, 0, processes);
        scheduler_fcfs.executePlanner();
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_fcfs.getSolutionAsHTML();

        processes = startingSituation.getProcesses();
        let scheduler_spn = new Scheduler(SchedulerType.SPN, 0, processes);
        scheduler_spn.executePlanner();
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_spn.getSolutionAsHTML();

        processes = startingSituation.getProcesses();
        let scheduler_srt = new Scheduler(SchedulerType.SRT, 0, processes);
        scheduler_srt.executePlanner();
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_srt.getSolutionAsHTML();

        processes = startingSituation.getProcesses();
        let scheduler_rr_3 = new Scheduler(SchedulerType.RR, 3, processes);
        scheduler_rr_3.executePlanner();
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_rr_3.getSolutionAsHTML();

        processes = startingSituation.getProcesses();
        let scheduler_rr_4 = new Scheduler(SchedulerType.RR, 4, processes);
        scheduler_rr_4.executePlanner();
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_rr_4.getSolutionAsHTML();

        processes = startingSituation.getProcesses();
        let scheduler_rr_5 = new Scheduler(SchedulerType.RR, 5, processes);
        scheduler_rr_5.executePlanner();
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_rr_5.getSolutionAsHTML();

        // show results off all schedulers at once
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_srt.getSolutionsAsHTML([scheduler_fcfs, scheduler_spn, scheduler_srt, scheduler_rr_3, scheduler_rr_4, scheduler_rr_5]);
    }
    else {
        alert("Er moet minstens 1 proces gepland worden met resterende uitvoeringstijd!");
    }
}

function renderOpgave(){
    document.getElementById("opgave").innerHTML = startingSituation.getAsHTML();
}

const processes = new Map();
// tot 26 processen mogelijk
let PROCESS_IDS = [ "A", "B", "C", "D", "E", "F", "G", "H", "I",
    "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];

function changeProcess(id, start, length){
    alert('ChangeProcess');
    // loop processes and change the process with correct id
    processes.get(id).start = start;
    processes.get(id).length = length;
}

function addProcess(id, start, length) {
    alert('addProcess');
    processes.set(id, new Process(id, start, length));
    // change the icon in the table to edit instead of add

    alert(processes.size);
    // if we have an unused color left, add a new row to add
    if(processes.size < PROCESS_IDS.length){
        addNewProcessRow();
    }
}

function addNewProcessRow (){
    alert('addNewProcessRow');
    let innerHTML = document.getElementById("lijst_processen").innerHTML
    innerHTML += "<tr>";
    innerHTML += "<td>" + PROCESS_IDS[processes.size] + "</td>";
    innerHTML += "<td>" + processes.size + "</td>";
    innerHTML += "<td>" + PROCESS_IDS.length + "</td>";
    innerHTML += '<td><button onclick="addProcess(' + "'B'" + ', 0, 2' + ');">Add</buton></td>';
    innerHTML += "</tr>";
    document.getElementById("lijst_processen").innerHTML = innerHTML
}