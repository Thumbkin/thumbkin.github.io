class StartingSituation {
    processes;
    used_process_ids;

    constructor() {
        this.processes = []
        this.used_process_ids = new Map();
        for(let i = 0; i < PROCESS_IDS.length; i++) {
            this.used_process_ids.set(PROCESS_IDS[i], false);
        }
    }

    addProcess(process) {
        this.processes.push(process);
        this.used_process_ids.set(process.getId(), true);
    }

    removeProcess(process_id) {
        for(let i = 0; i < this.processes.length; i++) {
            if(this.processes[i].getId() === process_id) {
                this.processes.splice(i, 1);
                this.used_process_ids.set(process_id, false);
                i = this.processes.length;
            }
        }
    }

    getNextUnusedProcessId(){
        for(let i = 0; i < PROCESS_IDS.length; i++) {
            if(this.used_process_ids.get(PROCESS_IDS[i]) === false){
                return PROCESS_IDS[i];
            }
        }
    }

    getProcesses () {
        let clonedProcesses = [];
        // Loop each process and only clone it if has execution time
        this.processes.forEach(function cloneProcess(process){
            if (process.getLength() > 0) {
                clonedProcesses.push(Object.assign(Object.create(Object.getPrototypeOf(process)), process));
            }
        });
        // sort processes by id
        clonedProcesses.sort(function(a, b) {
            if (a.getId() < b.getId()) {
                return -1;
            }
            if (a.getId() > b.getId()) {
                return 1;
            }
            return 0;
        });
        // return a clone of the processes
        return clonedProcesses;
    }

    // Checks if we have at least one process with execution time
    isValid() {
        return this.getProcesses().length > 0;
    }

    getAmountOfProcesses () {
        return this.processes.length;
    }

    updateStartProcess(processID, newStart) {
        for(let i = 0; i < this.processes.length; i++) {
            if(this.processes[i].id === processID) {
                this.processes[i].setStart(newStart);
                i = this.processes.length;
            }
        }
    }

    updateLengthProcess(processID, newLength) {
        for(let i = 0; i < this.processes.length; i++) {
            if(this.processes[i].id === processID) {
                this.processes[i].setLength(newLength);
                i = this.processes.length;
            }
        }
    }

    getAsHTML (){
        // sort processes by id
        this.processes.sort(function(a, b){
            return a.getId() < b.getId();
        });

        // calculate the amount of time steps we need
        let amountTimeNeeded= 0;

        this.processes.forEach(function checkMoreTime(process){
           if((process.getStart() + process.getLength())  > amountTimeNeeded){
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
            for (let i = process.getStart(); i < (process.getStart() + process.getLength()); i++) {
                toHTML += '<td class="scheduler_step" style="background-color: '+ PROCESS_COLORS.get(process.getId()) + '">' + process.getId() + '</td>';
            }
            //create blanks after
            for (let i = (process.getStart() + process.getLength()); i < amountTimeNeeded; i++) {
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