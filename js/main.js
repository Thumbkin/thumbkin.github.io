let startingSituation = new StartingSituation();
startingSituation.addProcess(new Process("A", 0, 7, ProcessColors.YELLOW));
startingSituation.addProcess(new Process("B", 1, 4, ProcessColors.GREEN));
startingSituation.addProcess(new Process("C", 2, 2, ProcessColors.ORANGE));
startingSituation.addProcess(new Process("D", 3, 10, ProcessColors.BLUE));
startingSituation.addProcess(new Process("E", 4, 1, ProcessColors.GRAY));
startingSituation.addProcess(new Process("F", 5, 6, ProcessColors.RED));
startingSituation.addProcess(new Process("G", 7, 3, ProcessColors.BROWN));
startingSituation.addProcess(new Process("H", 20, 2, ProcessColors.PURPLE));

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
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_srt.getSolutionAsHTML(startingSituation.getProcesses());

        processes = startingSituation.getProcesses();
        let scheduler_rr_3 = new Scheduler(SchedulerType.RR, 3, processes);
        scheduler_rr_3.executePlanner();
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_rr_3.getSolutionAsHTML(startingSituation.getProcesses());

        processes = startingSituation.getProcesses();
        let scheduler_rr_4 = new Scheduler(SchedulerType.RR, 4, processes);
        scheduler_rr_4.executePlanner();
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_rr_4.getSolutionAsHTML(startingSituation.getProcesses());

        processes = startingSituation.getProcesses();
        let scheduler_rr_5 = new Scheduler(SchedulerType.RR, 5, processes);
        scheduler_rr_5.executePlanner();
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_rr_5.getSolutionAsHTML(startingSituation.getProcesses());

        // show results off all schedulers at once
        document.getElementById("results_scheduler").innerHTML += "<br>" + scheduler_srt.getSolutionsAsHTML(startingSituation.getProcesses(), [scheduler_fcfs, scheduler_spn, scheduler_srt, scheduler_rr_3, scheduler_rr_4, scheduler_rr_5]);
    }
    else {
        alert("Er moet minstens 1 proces gepland worden met resterende uitvoeringstijd!");
    }
}

function renderOpgave(){
    document.getElementById("opgave").innerHTML = startingSituation.getAsHTML();
}