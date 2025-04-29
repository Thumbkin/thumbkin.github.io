// Abstract class for each type of planner
class Scheduler {
    roundQvalue = 0;
    currentQstep = 0;
    
    currentStep = 0;
    totalSteps = 0;
    steps = [];

    processes = [];
    currentProcess;
    lastProcess;

    reason_to_swap = ReasonsToSwap.NONE;
    reason_chosen_process = ReasonsToChoose.NONE;

    total_scheduler = [];
    type;

    constructor(type, qValue, processes) {
        this.type = type;
        this.roundQvalue = qValue;
        this.processes = processes;
        this.total_scheduler = [];
        this.totalSteps = 0;
    }

    executePlanner(){
        // calculate the total amount of steps
        this.calculateTotalAmountOfSteps();

        this.currentStep = 0;

        // Sort processes based on start time (FCFS, RR), or timeremaining (SPN/SRT)
        if (this.type === SchedulerType.FCFS || this.type === SchedulerType.RR) {
            this.processes.sort(function(a, b) { return a.getStart() < b.getStart(); });
        }
        else {
            this.processes.sort(function(a, b) { return a.getRemaining() < b.getRemaining(); });
        }

        // plan/calculate each step
        while (this.currentStep < this.totalSteps) {
            this.planNextStep();

            // all is done so add the results from this step to the array
            let currentProcessId = "";
            if (this.currentProcess != null) { currentProcessId = this.currentProcess.getId(); }

            this.steps[this.currentStep] = new Step(this.currentStep, this.queue_pre_execution, this.reason_to_swap, currentProcessId,
                this.reason_chosen_process, this.queue_execution, this.processes_to_add_to_queue.length > 0,
                this.processes_to_add_to_queue, this.queue_after_execution, this.total_scheduler);

            // go to next step
            this.currentStep++;
        }
    }

    calculateTotalAmountOfSteps() {
        // sort process based on start point
        this.processes.sort(function(a, b) { return a.getStart() < b.getStart(); });
        // loop each process and add its length as steps
        for(let i=0; i < this.processes.length; i++){
            // if start point is in future (in other words there will be empty execution steps)
            // calculate forward
            if (this.processes[i].getStart() > this.totalSteps) {
                this.totalSteps = this.processes[i].getStart();
            }
            this.totalSteps += this.processes[i].getLength();
        }
    }

    determineIfSwapIsNeeded() {
        // Check if last executed proces was finished, if so then swap
        this.reason_to_swap = ReasonsToSwap.NONE;

        // each planner needs to swap if no process is running or last running proces is finished
        if (this.lastProcess == null || this.lastProcess.isFinished() === true) {
            this.reason_to_swap = ReasonsToSwap.FINISHED;
        }
        // SRT also swaps if their is a better/shorter process in the queue
        // check if first process in queue is better (since they are sorted short -> long)
        if(this.reason_to_swap === ReasonsToSwap.NONE &&
            this.type === SchedulerType.SRT && 
            this.queue_pre_execution.length > 0 && 
            this.queue_pre_execution[0].getRemaining() < this.lastProcess.getRemaining()){
            this.reason_to_swap = ReasonsToSwap.SHORTER_PROCESS;
        }
        // RR also swaps if Q value is reached
        if(this.reason_to_swap === ReasonsToSwap.NONE && 
            this.type === SchedulerType.RR && this.currentQstep === this.roundQvalue){
            this.reason_to_swap = ReasonsToSwap.Q_VALUE_REACHED;
        }
    }

    // swaps the current running process with the first from the queue
    swapProcess() {
        // check if the current process has to be re-added to queue, only possible with RR or SRT
        if (this.type === SchedulerType.SRT && this.lastProcess && this.lastProcess.isFinished() === false) {
            this.processes_to_add_to_queue.push(this.lastProcess.getId());
        }

        // If RR we readd current process if Q value is reached and it aint finished
        if (this.type === SchedulerType.RR && this.currentQstep === this.roundQvalue) {
            // readd if there was a previous proces
            if (this.lastProcess && this.lastProcess.isFinished() === false) {
                this.processes_to_add_to_queue.push(this.lastProcess.getId());
            }
        }

        // check if there a process left we can take
        if (this.queue_execution.length > 0) {
            // since the queue is sorted for the type of scheduler, we always take first item present if available
            this.currentProcess = this.queue_execution.shift();
            // determine the reason on which we based our decision
            if (this.type === SchedulerType.SRT) { this.reason_chosen_process = ReasonsToChoose.SHORTEST_TIME_LEFT_IN_QUEUE; }
            else if (this.type === SchedulerType.SPN) { this.reason_chosen_process = ReasonsToChoose.SHORTEST_IN_QUEUE; }
            else { this.reason_chosen_process = ReasonsToChoose.FIRST_IN_QUEUE; }
        }
        else {
            this.currentProcess = null;
            this.reason_chosen_process = ReasonsToChoose.NO_PROCESS_AVAILABLE;
        }
    }

    // Method that completes the next stap of the planner
    planNextStep() {
        // each step consists of 3 phases: pre execution, execution and post execution
        this.runPreExecutionPhase();
        this.runExecutionPhase();
        this.runPostExecutionPhase();
    }

    // Pre execution phase
    //  1) if first step: copy all processes that start now
    //     else: copy queue after execution from previous step
    //  2) Check if we have to swap the previous executed process with a new one
    //     if so, swap
    runPreExecutionPhase() {
        this.queue_pre_execution = [];
        // if not first step, copy the queue from the previous step
        if (this.currentStep > 0) {
            this.queue_pre_execution = [...this.steps[this.currentStep - 1].getQueueAfterExecution()];
            this.lastProcess = this.currentProcess;
        }
        // if first step add all processes to queue who start at 0
        else {
            for(let i=0; i < this.processes.length; i++){
                if (this.processes[i].getStart() === 0) {
                    this.queue_pre_execution.push(this.processes[i]);
                }
            }
        }

        // determine if we must swap process to execute
        this.determineIfSwapIsNeeded();

        // copy the queue from pre execution phase to execution phase here
        // because if we have to swap we remove it from execution queue first before actual executing
        this.queue_execution = [...this.queue_pre_execution];

        // if we have to swap, get the process from queue
        if(this.reason_to_swap !== ReasonsToSwap.NONE){
            this.swapProcess();
            this.currentQstep = 0; // reset RR q value
        }
        // no need to swap so reexecute the last process
        else {
            this.currentProcess = this.lastProcess;
            this.reason_chosen_process = ReasonsToChoose.NONE;
        }
    }

    // Executes a step of a process
    //  1) execute the process if one is loaded
    runExecutionPhase() {
        // if not first step, copy the scheduler from previous step
        if (this.currentStep > 0) {
            this.total_scheduler = [...this.steps[this.currentStep - 1].getTotalScheduler()];
        }

        if(this.currentProcess !== null) {
            this.currentProcess.executeStep();
            this.currentQstep++; // increment the RR q value
            this.total_scheduler.push(this.currentProcess.getId());
        }
        else {
            this.total_scheduler.push("");
        }
    }

    // execute the steps after executing
    // 1) check if current executed process needs to readded to queue
    // 2) Check if new processes start at this point so they must be added to queueu
    // 3) add all processes to the queue
    runPostExecutionPhase(){
        // check if current executed process needs to readded to queue
        this.queue_after_execution = [...this.queue_execution];
        this.processes_to_add_to_queue = [];

        // re-add the current process, if it was stopped because of Q value
        if (this.type === SchedulerType.RR &&
            this.currentQstep === this.roundQvalue && this.currentProcess.isFinished() === false) {
            this.queue_after_execution.push(this.currentProcess);
            this.processes_to_add_to_queue.push(this.currentProcess.getId());
        }

        // loop all processes and if they become available at the end of current step, they must be added to the queue
        for(let i=0; i < this.processes.length; i++){
            if (this.processes[i].getStart() === (this.currentStep + 1)) {
                this.processes_to_add_to_queue.push(this.processes[i].getId());
                this.queue_after_execution.push(this.processes[i]);
            }
        }

        // if we added new processes to queue, resort em if we use SPN/SRT
        // sort the queue if we added new processes
        if (this.processes_to_add_to_queue.length > 0) {
            this.queue_after_execution.sort(function (a, b) {
                if (a.getRemaining() < b.getRemaining()) {
                    return -1;
                }
                if (a.getRemaining() === b.getRemaining() && a.getStart() <= b.getStart()) {
                    return -1;
                }
                return 1;
            });
        }
    }

    getSteps() {
        return this.steps;
    }

    getStep(nr) {
        return this.steps[nr];
    }

    getType() {
        return this.type;
    }

    getSolution() {
        return this.total_scheduler;
    }

    getQvalue(){
        return this.roundQvalue;
    }

    // Parses solution of one scheduler to html
    getSolutionAsHTML(){
        // map the processes their colors to id
        let processColors = {}

        this.processes.forEach(function addColor(process){
           processColors[process.getId()] = process.getHtmlColor();
        });

        let numberOfSteps = this.total_scheduler.length;
        let toHTML = '<table>';
        // first row is empty
        toHTML += '<tr><td class="scheduler_vertical"></td><td colspan="' + (numberOfSteps + 1)+ '"></td></tr>';
        // second row: name scheduler | each step from solution
        if (this.getType() === SchedulerType.RR){
            toHTML += '<tr><td class="scheduler_vertical">' + this.getType().getValue() +  ' (Q = ' + this.getQvalue() + ')</td>';
        }
        else {
            toHTML += '<tr><td class="scheduler_vertical">' + this.getType().getValue() + '</td>';
        }
        for (let i = 0; i < numberOfSteps; i++) {
            if (this.total_scheduler[i] === ""){
                toHTML += '<td class="scheduler_step" style="background-color: #FFFFFF"></td>';
            }
            else {
                toHTML += '<td class="scheduler_step" style="background-color: ' + processColors[this.total_scheduler[i]] + '">' + this.total_scheduler[i] + '</td>';
            }
        }
        toHTML += '<tr>';
        // third row: empty
        toHTML += '<tr><td class="scheduler_vertical"></td><td colspan="' + numberOfSteps + '"></td></tr>';
        // fourth row: time units
        toHTML += '<tr><td class="scheduler_vertical_no_border">0</td>';
        for (let i = 1; i <= numberOfSteps + 1; i++) {
            toHTML += '<td class="scheduler_time">' + i + '</td>';
        }
        toHTML += '</tr></table>';

        return toHTML;
    }

    // Parses solution of multiple schedulers to html
    getSolutionsAsHTML(schedulers){
        Logger.log("getSolutionsAsHTML");
        // map the processes their colors to id
        let processColors = {}

        this.processes.forEach(function addColor(process){
            processColors[process.getId()] = process.getHtmlColor();
        });

        Logger.log("colors mapped");

        let numberOfSteps = 1;

        Logger.log("# schedulers: " + schedulers.length);
        if(schedulers.length > 0) {
            numberOfSteps = schedulers[0].getSolution().length;
        }
        let toHTML = '<table>';
        // repeat for each schedulder solution
        for(let s = 0; s < schedulers.length; s++){
            // first row is empty
            toHTML += '<tr><td class="scheduler_vertical"></td><td colspan="' + (numberOfSteps + 1)+ '"></td></tr>';
            // second row: name scheduler | each step from solution
            if (schedulers[s].getType() === SchedulerType.RR){
                Logger.log(schedulers[s].getType().getValue() + " (Q = " + schedulers[s].getQvalue() + ") heeft " + numberOfSteps + " stappen");
                toHTML += '<tr><td class="scheduler_vertical">' + schedulers[s].getType().getValue() + ' (Q = ' + schedulers[s].getQvalue() + ')</td>';
            }
            else {
                Logger.log(schedulers[s].getType().getValue() + " heeft " + numberOfSteps + " stappen");
                toHTML += '<tr><td class="scheduler_vertical">' + schedulers[s].getType().getValue() + '</td>';
            }
            for (let i = 0; i < numberOfSteps; i++) {
                toHTML += '<td class="scheduler_step" style="background-color: '+ processColors[schedulers[s].getSolution()[i]] + '">' + schedulers[s].getSolution()[i] + '</td>';
            }
            toHTML += '<tr>';
        }
        // filler row: empty
        toHTML += '<tr><td class="scheduler_vertical"></td><td colspan="' + numberOfSteps + '"></td></tr>';
        // last row: time units
        toHTML += '<tr><td class="scheduler_vertical_no_border">0</td>';
        for (let i = 1; i <= numberOfSteps + 1; i++) {
            toHTML += '<td class="scheduler_time">' + i + '</td>';
        }
        toHTML += '</tr></table>';

        return toHTML;
    }
}