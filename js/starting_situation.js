class StartingSituation {
    processes;

    constructor() {
        this.processes = []
    }

    addProcess(process) {
        this.processes.push(process);
    }

    getProcesses () {
        let clonedProcesses = [];
        this.processes.forEach(function cloneProcess(process){
            clonedProcesses.push(Object.assign(Object.create(Object.getPrototypeOf(process)), process));
        });
        // return a clone of the processes
        return clonedProcesses;
    }

    getAsHTML (){
        // sort processes by id
        this.processes.sort(function(a, b){
            return a.getId() < b.getId();
        });

        // calculate the amount of time steps we need
        let amountTimeNeeded= 0;

        this.processes.forEach(function checkMoreTime(process){
           if(process.getStart() + process.getLength()  > amountTimeNeeded){
               amountTimeNeeded = process.getStart() + process.getLength();
           }
        });

        // add 1 for nice visualisation and to have at least 1 time unit, e.g if we have 0 processes
        amountTimeNeeded++;

        // create the table
        let toHTML = '<table>';
        // first row is text proces | nothing
        toHTML += '<tr><td class="starting_vertical_top">Proces</td><td colspan="' + amountTimeNeeded + '"></td></tr>';
        // add a row for each process
        this.processes.forEach(function addToHTML(process){
            // second row: name scheduler | each step from solution
            toHTML += '<tr><td class="starting_vertical_process">' + process.getId() + '</td>';
            // create blanks before start
            for (let i = 0; i < process.getStart(); i++) {
                toHTML += '<td class="scheduler_step"></td>';
            }
            // add process it self
            for (let i = process.getStart(); i < process.getStart() + process.getLength(); i++) {
                toHTML += '<td class="scheduler_step" style="background-color: '+ process.getHtmlColor() + '">' + process.getId() + '</td>';
            }
            //create blanks after
            for (let i = process.getStart() + process.getLength(); i < amountTimeNeeded; i++) {
                toHTML += '<td class="scheduler_step"></td>';
            }
            toHTML += '<tr>';
        });
        // Last row: time units
        toHTML += '<tr><td class="scheduler_vertical_no_border">0</td>';
        for (let i = 1; i <= amountTimeNeeded + 1; i++) {
            toHTML += '<td class="scheduler_time">' + i + '</td>';
        }
        toHTML += '</tr></table>';

        return toHTML;
    }
}