class Step {
    constructor(nr, queue_pre_execution, reason_to_swap, executed_process, reason_chosen_process, queue_execution,
                need_to_add_queue, processes_to_add, queue_after_execution, total_scheduler) {
        this.nr = nr;

        this.queue_pre_execution = queue_pre_execution;
        this.reason_to_swap = reason_to_swap

        this.executed_process = executed_process;
        this.reason_chosen_process = reason_chosen_process;
        this.queue_execution = queue_execution;

        this.need_to_add_queue = need_to_add_queue;
        this.processes_to_add = processes_to_add;
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

    processQueueToHTML(queue) {
        let toHTML = "";
        queue.forEach(function getProcess(process){
            toHTML += process.getId() + ", ";
        })
        // if we added at least process, remove the last added ,
        if (toHTML.length > 0){
            toHTML = toHTML.substring(0, toHTML.length - 2);
        }
        return toHTML;
    }

    toHTML(){
        let html_text = '&nbsp;&nbsp;&nbsp;&nbsp;Stap ' + this.nr + ":<br>" +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Voor uitvoering: ' + "<br>" +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Wachtrij: ' + this.processQueueToHTML(this.queue_pre_execution) + "<br>" +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Wisselen? ';
        if (this.reason_to_swap !== ReasonsToSwap.NONE) {
            html_text + 'Ja';
            html_text += " (" + this.reason_to_swap.toValue() + ")";
        }else {
            html_text + 'Nee';
        }
        html_text +=  "<br>"+
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Uitvoering: ' + "<br>" +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Proces: ' + this.executed_process;
        if(this.reason_chosen_process){
            html_text += " (" + this.reason_chosen_process.toValue() + ")";
        }
        html_text +=  "<br>"+
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Wachtrij: ' + this.processQueueToHTML(this.queue_execution) + "<br>" +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Na uitvoering: ' + "<br>" +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Toevoegen aan wachtrij? ' + this.need_to_add_queue;
        if(this.need_to_add_queue) {
            html_text += " (" + this.processes_to_add + ")";
        }
        html_text +=  "<br>"+
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Wachtrij: ' + this.processQueueToHTML(this.queue_after_execution) + "<br>" +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + "<br>" +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Huidige oplossing: ' + this.total_scheduler + "<br>";

        return html_text;
    }
}