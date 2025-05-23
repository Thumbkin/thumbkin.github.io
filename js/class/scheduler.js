// Abstract class for each type of planner
class Scheduler {
    round_q_value = 0;
    current_q_step = 0;
    
    current_step = 0;
    total_steps = 0;
    steps = [];

    processes = [];
    current_process;
    last_process;

    reason_to_swap = REASONS_TO_SWAP.get('NONE');
    reasons_choice_next_process = REASONS_CHOICE_NEXT_PROCESS.get('NONE');

    total_scheduler = [];
    type;

    constructor(type, qValue, processes) {
        this.type = type;
        this.round_q_value = qValue;
        this.processes = processes;
        this.total_scheduler = [];
        this.total_steps = 0;
    }

    getTotalNumberOfSteps(){
        return this.total_steps;
    }

    executePlanner(){
        // calculate the total amount of steps
        this.calculateTotalAmountOfSteps();

        this.current_step = 0;

        // Sort processes based on start time (FCFS, RR), or time remaining (SPN/SRT)
        if (this.type === SCHEDULER_TYPES.get('FCFS') || this.type === SCHEDULER_TYPES.get('RR')) {
            this.processes.sort(this.#sortProcessesByStartingTime);
        }
        else {
            this.processes.sort(this.#sortProcessesByRemainingTime);
        }

        // plan/calculate each step
        for(this.current_step; this.current_step < this.total_steps; this.current_step++) {
            this.planNextStep();

            // all is done so add the results from this step to the array
            let current_process_id = "";
            if (this.current_process != null) { current_process_id = this.current_process.getId(); }

            this.steps[this.current_step] = new Step(this.current_step, this.queue_pre_execution, this.reason_to_swap, current_process_id,
                this.reasons_choice_next_process, this.queue_execution, this.processes_to_add_to_queue, this.queue_after_execution, this.total_scheduler);
        }
    }

    calculateTotalAmountOfSteps() {
        // sort process based on start point
        this.processes.sort(this.#sortProcessesByStartingTime);
        // loop each process and add its length as steps
        for(let i= 0; i < this.processes.length; i++){
            // if start point is in future (in other words there will be empty execution steps)
            // calculate forward
            if (this.processes[i].getStart() > this.total_steps) {
                this.total_steps = this.processes[i].getStart();
            }
            this.total_steps += this.processes[i].getLength();
        }
    }

    // Method that completes the next step of the planner
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
        // if not first step, copy the queue from the previous step
        if (this.current_step > 0) {
            this.queue_pre_execution = this.#cloneQueue(this.queue_after_execution);
            this.last_process = this.current_process;
        }
        // if first step add all processes to queue who start at 0
        else {
            this.queue_pre_execution = [];
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
        this.queue_execution = this.#cloneQueue(this.queue_pre_execution);

        // create array to hold processes to have to be added back to queue
        this.processes_to_add_to_queue = [];

        // if we have to swap, get the process from queue
        if(this.reason_to_swap !== REASONS_TO_SWAP.get('NONE')){
            this.swapProcess();
            this.current_q_step = 0; // reset RR q value
        }
        // no need to swap so reexecute the last process
        else {
            this.current_process = this.last_process;
            this.reasons_choice_next_process = REASONS_CHOICE_NEXT_PROCESS.get('NONE');
        }
    }

    determineIfSwapIsNeeded() {
        // Check if last executed process was finished, if so then swap
        this.reason_to_swap = REASONS_TO_SWAP.get('NONE');

        // each planner needs to swap if no process is running or last running process is finished
        if (this.last_process == null || this.last_process.isFinished() === true) {
            this.reason_to_swap = REASONS_TO_SWAP.get('FINISHED');
        }
        // SRT also swaps if there is a better/shorter process in the queue
        // check if first process in queue is better (since they are sorted short -> long)
        if(this.reason_to_swap === REASONS_TO_SWAP.get('NONE') &&
            this.type === SCHEDULER_TYPES.get('SRT') && 
            this.queue_pre_execution.length > 0 && 
            this.queue_pre_execution[0].getRemaining() < this.last_process.getRemaining()){
            this.reason_to_swap = REASONS_TO_SWAP.get('SHORTER_PROCESS');
        }
        // RR also swaps if Q value is reached
        if(this.reason_to_swap === REASONS_TO_SWAP.get('NONE') && 
            this.type === SCHEDULER_TYPES.get('RR') && this.current_q_step === this.round_q_value){
            this.reason_to_swap = REASONS_TO_SWAP.get('Q_VALUE_REACHED');
        }
    }

    // swaps the current running process with the first from the queue
    swapProcess() {
        // check if there is a process left we can take
        if (this.queue_execution.length > 0) {
            // since the queue is sorted for the type of scheduler, we always take first item present if available
            this.current_process = this.queue_execution.shift();
            // determine the reason on which we based our decision
            if (this.type === SCHEDULER_TYPES.get('SRT')) { this.reasons_choice_next_process = REASONS_CHOICE_NEXT_PROCESS.get('SHORTEST_TIME_LEFT_IN_QUEUE'); }
            else if (this.type === SCHEDULER_TYPES.get('SPN')) { this.reasons_choice_next_process = REASONS_CHOICE_NEXT_PROCESS.get('SHORTEST_IN_QUEUE'); }
            else { this.reasons_choice_next_process = REASONS_CHOICE_NEXT_PROCESS.get('FIRST_IN_QUEUE'); }
        }
        else {
            this.current_process = null;
            this.reasons_choice_next_process = REASONS_CHOICE_NEXT_PROCESS.get('NO_PROCESS_AVAILABLE');
        }

        if (this.type === SCHEDULER_TYPES.get('SRT') && this.last_process && this.last_process.isFinished() === false) {
            this.queue_execution.push(this.last_process);
            // reset the queue
            this.queue_execution.sort(this.#sortProcessesByRemainingTime);
        }
    }

    // Executes a step of a process
    //  1) execute the process if one is loaded
    runExecutionPhase() {
        // Execute the current process if we have one
        if(this.current_process !== null) {
            this.current_process.executeStep();
            this.current_q_step++; // increment the RR q value
            this.total_scheduler.push(this.current_process.getId());
        }
        else {
            this.total_scheduler.push("");
        }
    }

    // execute the steps after executing
    // 1) check if current executed process needs to readded to queue
    // 2) Check if new processes start at this point so they must be added to queue
    // 3) add all processes to the queue
    runPostExecutionPhase(){
        // re-add the current process, if it was stopped because of Q value
        if (this.type === SCHEDULER_TYPES.get('RR') &&
            this.current_q_step === this.round_q_value && this.current_process.isFinished() === false) {
            this.processes_to_add_to_queue.push(this.current_process.getId());
        }

        this.queue_after_execution = this.#cloneQueue(this.queue_execution);

        // Readd last executed process
        if(this.processes_to_add_to_queue.length > 0){
            this.queue_after_execution.push(this.last_process);
        }

        // loop all processes and if they become available at the end of current step, they must be added to the queue
        for(let i=0; i < this.processes.length; i++){
            if (this.processes[i].getStart() === (this.current_step + 1)) {
                this.processes_to_add_to_queue.push(this.processes[i].getId());
                this.queue_after_execution.push(this.processes[i]);
            }
        }

        // if we added new processes to queue, resort em if we use SPN/SRT
        // sort the queue if we added new processes
        if (this.processes_to_add_to_queue.length > 0 &&
            (this.type === SCHEDULER_TYPES.get('SPN') || this.type === SCHEDULER_TYPES.get('SRT'))) {
            this.queue_after_execution.sort(this.#sortProcessesByRemainingTime);
        }
    }

    #sortProcessesByStartingTime(a, b) {
        if (a.getStart() < b.getStart()) {
            return -1;
        }
        if (a.getStart() === b.getStart() && a.getId() < b.getId()) {
            return -1;
        }
        return 1;
    }

    #sortProcessesByRemainingTime(a, b) {
        if (a.getRemaining() < b.getRemaining()) {
            return -1;
        }
        if (a.getRemaining() === b.getRemaining() && a.getStart() <= b.getStart()) {
            return -1;
        }
        return 1;
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
        return this.round_q_value;
    }

    #cloneQueue (queue) {
        let clonedQueue = [];
        queue.forEach(function cloneProcess(process){
            clonedQueue.push(Object.assign(Object.create(Object.getPrototypeOf(process)), process));
        });

        return clonedQueue
    }
}