class Step {
    constructor(nr, queue_pre_execution, reason_to_swap, executed_process, reason_chosen_process, queue_execution,
                processes_to_add, queue_after_execution, total_scheduler) {
        this.nr = nr;

        this.queue_pre_execution = queue_pre_execution;
        this.reason_to_swap = reason_to_swap

        this.executed_process = executed_process;
        this.reason_chosen_process = reason_chosen_process;
        this.queue_execution = queue_execution;

        this.processes_to_add = processes_to_add;
        this.need_to_add_queue = (this.processes_to_add.length > 0);
        this.queue_after_execution = queue_after_execution;

        this.total_scheduler = total_scheduler;
    }

    getQueueBeforeExecution(){
        return this.queue_pre_execution;
    }

    getQueueExecution(){
        return this.queue_execution;
    }

    getQueueAfterExecution() {
        return this.queue_after_execution;
    }

    getExecutedProcess() {
        return this.executed_process;
    }

    getTotalScheduler() {
        return this.total_scheduler;
    }

    getNumber(){
        return this.nr;
    }

    addedProcessesToQueue(){
        return this.need_to_add_queue;
    }

    getAddedProcesses() {
        return this.processes_to_add;
    }

    getReasonChoosenProcess() {
        return this.reason_chosen_process
    }

    getReasonToSwap() {
        return this.reason_to_swap;
    }
}