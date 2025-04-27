// Abstract class for each type of planner
class Scheduler {
    steps;
    total_scheduler;
    type;
    original_processes;

    plan(processes){}

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
        return this.q;
    }

    // Parses solution of one scheduler to html
    getSolutionAsHTML(processes){
        // map the processes their colors to id
        let processColors = {}

        processes.forEach(function addColor(process){
           processColors[process.getId()] = process.getHtmlColor();
        });

        let numberOfSteps = this.total_scheduler.length;
        let toHTML = '<table>';
        // first row is empty
        toHTML += '<tr><td class="scheduler_vertical"></td><td colspan="' + (numberOfSteps + 1)+ '"></td></tr>';
        // second row: name scheduler | each step from solution
        if (this.getType() == SchedulerType.RR){
            toHTML += '<tr><td class="scheduler_vertical">' + this.getType().getValue() +  ' (Q = ' + this.getQvalue() + ')</td>';
        }
        else {
            toHTML += '<tr><td class="scheduler_vertical">' + this.getType().getValue() + '</td>';
        }
        for (let i = 0; i < numberOfSteps; i++) {
            toHTML += '<td class="scheduler_step" style="background-color: '+ processColors[this.total_scheduler[i]] + '">' + this.total_scheduler[i] + '</td>';
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
    getSolutionsAsHTML(processes, schedulers){
        Logger.log("getSolutionsAsHTML");
        // map the processes their colors to id
        let processColors = {}

        processes.forEach(function addColor(process){
            processColors[process.getId()] = process.getHtmlColor();
        });

        Logger.log("colors mapped");

        let numberOfSteps = 1;

        Logger.log("# schedulers: " + schedulers.length);
        if(schedulers != null && schedulers.length > 0) {
            numberOfSteps = schedulers[0].getSolution().length;
        }
        let toHTML = '<table>';
        // repeat for each schedulder solution
        for(let s = 0; s < schedulers.length; s++){
            // first row is empty
            toHTML += '<tr><td class="scheduler_vertical"></td><td colspan="' + (numberOfSteps + 1)+ '"></td></tr>';
            // second row: name scheduler | each step from solution
            if (schedulers[s].getType() == SchedulerType.RR){
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

// Actual implementation for each planner
class FCFS extends Scheduler {
    constructor() {
        super();
        this.type = SchedulerType.FCFS;
        this.steps = [];
        this.total_scheduler = [];
    }

    // override plan method
    plan (processes) {
        this.original_processes = processes.slice();
        // calculate the total amount of steps
        let totalSteps = 0;
        processes.forEach(function calculateLength(process){
            totalSteps += process.getLength();
        });

        let currentStep = 0;
        let currentProcess, lastProcess;

        // calculate each step
        while (currentStep < totalSteps) {
            let queue_pre_execution = [];
            // if not first step, copy the queue from the previous step
            if (currentStep > 0) {
                queue_pre_execution = [...this.steps[currentStep - 1].getQueueAfterExecution()];
                lastProcess = currentProcess;
            }
            // if first step add all processes to queue who start at 0
            else {
                processes.forEach(function addToQueue(process){
                    if(process.getStart() === 0) {
                        queue_pre_execution.push(process);
                    }
                })
            }

            // Check if last executed proces was finished, if so then swap
            let have_to_swap = false;
            let reason_to_swap = ReasonsToSwap.NOT_FINISHED;

            if (lastProcess == null || lastProcess.isFinished() === true){
                have_to_swap = true;
                reason_to_swap = ReasonsToSwap.FINISHED;
            }

            // get the next proces to execute if we have to swap
            let queue_execution = [...queue_pre_execution];
            let reason_chosen_process = "";
            if (have_to_swap === true) {
                reason_chosen_process = ReasonsToChoose.FIRST_IN_QUEUE;
                currentProcess = queue_execution.shift();
            }
            else {
                currentProcess = lastProcess;
            }

            let total_scheduler = []
            if (currentStep > 0) {
                total_scheduler = [...this.steps[currentStep - 1].getTotalScheduler()];
            }

            currentProcess.executeStep();
            total_scheduler.push(currentProcess.getId());

            // loop all process and if they start at the current step, they must be added to the queue
            let queue_after_execution = [...queue_execution];
            let processes_to_add_to_queue = [];

            processes.forEach(function startsNow(process) {
               if (process.getStart() === (currentStep + 1)) {
                   processes_to_add_to_queue.push(process.getId());
                   queue_after_execution.push(process);
               }
            });

            this.steps[currentStep] = new Step(currentStep, queue_pre_execution, have_to_swap, reason_to_swap, currentProcess.getId(),
                reason_chosen_process, queue_execution, processes_to_add_to_queue.length > 0, processes_to_add_to_queue, queue_after_execution, total_scheduler);

           // Logger.log(this.steps[currentStep].toHTML());
           // Logger.log("");
            // go to next step
            currentStep++;
        }

        this.total_scheduler = this.steps[this.steps.length - 1].getTotalScheduler();
    }
}

class SPN  extends Scheduler {
    constructor() {
        super();
        this.type = SchedulerType.SPN;
        this.steps = [];
        this.total_scheduler = [];
    }

    // override plan method
    plan (processes) {
        // calculate the total amount of steps
        let totalSteps = 0;
        processes.forEach(function calculateLength(process){
            totalSteps += process.getLength();
        });

        // sorteer de processen van klein naar groot (ongeacht startpunt)
        processes.sort(function(a, b){
            if(a.getLength() < b.getLength()) { return -1; }
            if(a.getLength() === b.getLength() && a.getStart() <= b.getStart()) { return -1; }
            return 1;
        });

        let currentStep = 0;
        let currentProcess, lastProcess;

        // calculate each step
        while (currentStep < totalSteps) {
            let queue_pre_execution = [];
            // if not first step, copy the queue from the previous step
            if (currentStep > 0) {
                queue_pre_execution = [...this.steps[currentStep - 1].getQueueAfterExecution()];
                lastProcess = currentProcess;
            }
            // if first step add all processes to queue who start at 0
            else {
                processes.forEach(function addToQueue(process){
                    if(process.getStart() === 0) {
                        queue_pre_execution.push(process);
                    }
                })
            }

            // Check if last executed proces was finished, if so then swap
            let have_to_swap = false;
            let reason_to_swap = ReasonsToSwap.NOT_FINISHED;

            if (lastProcess == null || lastProcess.isFinished() === true){
                have_to_swap = true;
                reason_to_swap = ReasonsToSwap.FINISHED;
            }

            // calculate the next proces if we have to swap
            let queue_execution = [...queue_pre_execution];
            let reason_chosen_process = "";
            if(have_to_swap === true) {
                reason_chosen_process = ReasonsToChoose.SHORTEST_IN_QUEUE;
                currentProcess = queue_execution.shift();
            }
            else {
                currentProcess = lastProcess;
            }

            let total_scheduler = [];
            if (currentStep > 0) {
                total_scheduler = [...this.steps[currentStep - 1].getTotalScheduler()];
            }

            currentProcess.executeStep();
            total_scheduler.push(currentProcess.getId());

            // loop all process and if they start at the current step, they must be added to the queue
            let queue_after_execution = [...queue_execution];
            let processes_to_add_to_queue = [];

            processes.forEach(function startsNow(process) {
                if(process.getStart() === (currentStep + 1)){
                    processes_to_add_to_queue.push(process.getId());
                    queue_after_execution.push(process);
                }
            });

            // sort the queue if we added new processes
            if (processes_to_add_to_queue.length > 0) {
                queue_after_execution.sort(function (a, b) {
                    if (a.getLength() < b.getLength()) {
                        return -1;
                    }
                    if (a.getLength() === b.getLength() && a.getStart() <= b.getStart()) {
                        return -1;
                    }
                    return 1;
                });
            }

            this.steps[currentStep] = new Step(currentStep, queue_pre_execution, have_to_swap, reason_to_swap, currentProcess.getId(),
                reason_chosen_process, queue_execution, processes_to_add_to_queue.length > 0, processes_to_add_to_queue, queue_after_execution, total_scheduler);

            // go to next step
            currentStep++;
        }

        this.total_scheduler = this.steps[this.steps.length - 1].getTotalScheduler();
    }
}

class SRT extends Scheduler {
    constructor() {
        super();
        this.type = SchedulerType.SRT;
        this.steps = [];
    }

    // override plan method
    plan (processes) {
        // calculate the total amount of steps
        let totalSteps = 0;
        processes.forEach(function calculateLength(process){
            totalSteps += process.getLength();
        });

        // sorteer de processen van klein naar groot (ongeacht startpunt)
        processes.sort(function(a, b){
            if(a.getRemaining() < b.getRemaining()) { return -1; }
            if(a.getRemaining() === b.getRemaining() && a.getStart() <= b.getStart()) { return -1; }
            return 1;
        });

        let currentStep = 0;
        let currentProcess, lastProcess;

        // calculate each step
        while (currentStep < totalSteps) {
            let queue_pre_execution = [];
            // if not first step, copy the queue from the previous step
            if (currentStep > 0) {
                queue_pre_execution = [...this.steps[currentStep - 1].getQueueAfterExecution()];
                lastProcess = currentProcess;
            }
            // if first step add all processes to queue who start at 0
            else {
                processes.forEach(function addToQueue(process){
                    if(process.getStart() === 0) {
                        queue_pre_execution.push(process);
                    }
                })
            }

            // array holding process to add to queue
            let processes_to_add_to_queue = [];

            // Check if last executed proces was finished, if so then swap
            let have_to_swap = false;
            let reason_to_swap = ReasonsToSwap.NOT_FINISHED;

            // swap if last process finished or if shorter is in queue
            if (lastProcess == null || lastProcess.isFinished() === true){
                have_to_swap = true;
                reason_to_swap = ReasonsToSwap.FINISHED;
            }

            if(have_to_swap === false && lastProcess != null && queue_pre_execution.length > 0 && queue_pre_execution[0].getRemaining() < lastProcess.getRemaining()){
                have_to_swap = true;
                reason_to_swap = ReasonsToSwap.SHORTER_PROCESS;
                // add current process back to queue
                processes_to_add_to_queue.push(lastProcess.getId());
            }

            // calculate the next proces if we have to swap
            let queue_execution = [...queue_pre_execution];
            let reason_chosen_process = "";
            if(have_to_swap === true) {
                reason_chosen_process = ReasonsToChoose.SHORTEST_TIME_LEFT_IN_QUEUE;
                currentProcess = queue_execution.shift();
            }
            else {
                currentProcess = lastProcess;
            }

            let total_scheduler = [];
            if (currentStep > 0) {
                total_scheduler = [...this.steps[currentStep - 1].getTotalScheduler()];
            }

            currentProcess.executeStep();
            total_scheduler.push(currentProcess.getId());

            // loop all process and if they start at the current step, they must be added to the queue
            let queue_after_execution = [...queue_execution];

            processes.forEach(function startsNow(process) {
                if(process.getStart() === (currentStep + 1)){
                    processes_to_add_to_queue.push(process.getId());
                    queue_after_execution.push(process);
                }
            });

            // (re)sort the queue if we added new processes
            if (processes_to_add_to_queue.length > 0) {
                // first add the current executed process first
                if (reason_to_swap === ReasonsToSwap.SHORTER_PROCESS) {
                    queue_after_execution.push(lastProcess);
                }
                queue_after_execution.sort(function (a, b) {
                    if (a.getRemaining() < b.getRemaining()) {
                        return -1;
                    }
                    if (a.getRemaining() === b.getRemaining() && a.getStart() <= b.getStart()) {
                        return -1;
                    }
                    return 1;
                });
            }

            this.steps[currentStep] = new Step(currentStep, queue_pre_execution, have_to_swap, reason_to_swap, currentProcess.getId(),
                reason_chosen_process, queue_execution, processes_to_add_to_queue.length > 0, processes_to_add_to_queue, queue_after_execution, total_scheduler);

            // go to next step
            currentStep++;
        }

        this.total_scheduler = this.steps[this.steps.length - 1].getTotalScheduler();
    }
}

class RR extends Scheduler {
    constructor(q) {
        super();
        this.type = SchedulerType.RR;
        this.steps = [];
        this.q = q;
    }

    // override plan method
    plan (processes){
        // calculate the total amount of steps
        let totalSteps = 0;
        processes.forEach(function calculateLength(process){
            totalSteps += process.getLength();
        });

        let currentStep = 0;
        let currentProcess, lastProcess;

        let currentQ = 0;

        // calculate each step
        while (currentStep < totalSteps) {
            let queue_pre_execution = [];
            // if not first step, copy the queue from the previous step
            if (currentStep > 0) {
                queue_pre_execution = [...this.steps[currentStep - 1].getQueueAfterExecution()];
                lastProcess = currentProcess;
            }
            // if first step add all processes to queue who start at 0
            else {
                processes.forEach(function addToQueue(process){
                    if(process.getStart() === 0) {
                        queue_pre_execution.push(process);
                    }
                })
            }

            // array holding process to add to queue
            let processes_to_add_to_queue = [];

            // Check if last executed proces was finished, if so then swap
            let have_to_swap = false;
            let reason_to_swap = ReasonsToSwap.NOT_FINISHED;

            // swap if last process finished or if shorter is in queue
            if (lastProcess == null || lastProcess.isFinished() === true){
                have_to_swap = true;
                reason_to_swap = ReasonsToSwap.FINISHED;
            }

            if(have_to_swap === false && currentQ === this.q){
                have_to_swap = true;
                reason_to_swap = ReasonsToSwap.Q_VALUE_REACHED;
            }

            // calculate the next proces if we have to swap
            let queue_execution = [...queue_pre_execution];
            let reason_chosen_process = "";
            if(have_to_swap === true) {
                reason_chosen_process = ReasonsToChoose.FIRST_IN_QUEUE;
                currentProcess = queue_execution.shift();
                currentQ = 0;
            }
            else {
                currentProcess = lastProcess;
            }

            let total_scheduler = [];
            if (currentStep > 0) {
                total_scheduler = [...this.steps[currentStep - 1].getTotalScheduler()];
            }

            currentProcess.executeStep();
            total_scheduler.push(currentProcess.getId());
            currentQ++;

            let queue_after_execution = [...queue_execution];

            // read the current process, if it was stopped because of Q value
            if (currentQ === this.q && currentProcess.isFinished() === false) {
                queue_after_execution.push(currentProcess);
            }

            // loop all process and if they start at the current step, they must be added to the queue
            processes.forEach(function startsNow(process) {
                if(process.getStart() === (currentStep + 1)){
                    processes_to_add_to_queue.push(process.getId());
                    queue_after_execution.push(process);
                }
            });

            this.steps[currentStep] = new Step(currentStep, queue_pre_execution, have_to_swap, reason_to_swap, currentProcess.getId(),
                reason_chosen_process, queue_execution, processes_to_add_to_queue.length > 0, processes_to_add_to_queue, queue_after_execution, total_scheduler);

            // go to next step
            currentStep++;
        }

        this.total_scheduler = this.steps[this.steps.length - 1].getTotalScheduler();
    }
}