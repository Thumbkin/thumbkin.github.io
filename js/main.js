function runSchedulers () {
    let startingSituation = new StartingSituation();
    startingSituation.addProcess(new Process("A", 0, 7, ProcessColors.YELLOW));
    startingSituation.addProcess(new Process("B", 1, 4, ProcessColors.GREEN));
    startingSituation.addProcess(new Process("C", 2, 2, ProcessColors.ORANGE));
    startingSituation.addProcess(new Process("D", 3, 10, ProcessColors.BLUE));
    startingSituation.addProcess(new Process("E", 4, 1, ProcessColors.GRAY));
    startingSituation.addProcess(new Process("F", 5, 6, ProcessColors.RED));
    startingSituation.addProcess(new Process("G", 7, 3, ProcessColors.BROWN));
    startingSituation.addProcess(new Process("H", 20, 2, ProcessColors.PURPLE));

    document.getElementById("results_scheduler").innerHTML = "";

    if(startingSituation.isValid()) {
        let processes = startingSituation.getProcesses();
        let scheduler_fcfs = new FCFS();
        scheduler_fcfs.plan(processes);
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_fcfs.getSolutionAsHTML(startingSituation.getProcesses());

        processes = startingSituation.getProcesses();
        let scheduler_spn = new SPN();
        scheduler_spn.plan(processes);
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_spn.getSolutionAsHTML(startingSituation.getProcesses());

        processes = startingSituation.getProcesses();
        let scheduler_srt = new SRT();
        scheduler_srt.plan(processes);
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_srt.getSolutionAsHTML(startingSituation.getProcesses());

        processes = startingSituation.getProcesses();
        let scheduler_rr_3 = new RR(3);
        scheduler_rr_3.plan(processes);
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_rr_3.getSolutionAsHTML(startingSituation.getProcesses());

        processes = startingSituation.getProcesses();
        let scheduler_rr_4 = new RR(4);
        scheduler_rr_4.plan(processes);
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_rr_4.getSolutionAsHTML(startingSituation.getProcesses());

        processes = startingSituation.getProcesses();
        let scheduler_rr_5 = new RR(5);
        scheduler_rr_5.plan(processes);
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_rr_5.getSolutionAsHTML(startingSituation.getProcesses());

        // show results off all schedulers at once
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_srt.getSolutionsAsHTML(startingSituation.getProcesses(), [scheduler_fcfs, scheduler_spn, scheduler_srt, scheduler_rr_3, scheduler_rr_4, scheduler_rr_5]);
    }
    else {
        alert("Er moet minstens 1 proces gepland worden met resterende uitvoeringstijd!");
    }
}

function renderOpgave(){
    let startingSituation = new StartingSituation();
    startingSituation.addProcess(new Process("A", 0, 7, ProcessColors.YELLOW));
    startingSituation.addProcess(new Process("B", 1, 4, ProcessColors.GREEN));
    startingSituation.addProcess(new Process("C", 2, 2, ProcessColors.ORANGE));
    startingSituation.addProcess(new Process("D", 3, 10, ProcessColors.BLUE));
    startingSituation.addProcess(new Process("E", 4, 1, ProcessColors.GRAY));
    startingSituation.addProcess(new Process("F", 5, 6, ProcessColors.RED));
    startingSituation.addProcess(new Process("G", 7, 3, ProcessColors.BROWN));
    startingSituation.addProcess(new Process("H", 20, 2, ProcessColors.PURPLE));

    document.getElementById("opgave").innerHTML = startingSituation.getAsHTML();
}