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
        // Loop each process and only clone if it has execution time
        this.processes.forEach(function cloneProcess(process){
            if (process.getLength() > 0) {
                clonedProcesses.push(Object.assign(Object.create(Object.getPrototypeOf(process)), process));
            }
        });
        // sort processes by id
        clonedProcesses.sort(this.#sortProcessesById);
        // return a clone of the processes
        return clonedProcesses;
    }

    #sortProcessesById(a, b) {
        if (a.getId() < b.getId()) {
            return -1;
        }
        if (a.getId() > b.getId()) {
            return 1;
        }
        return 0;
    }

    // Checks if we have at least one process with execution time
    isValid() {
        return this.getProcesses().length > 0;
    }

    getAmountOfProcesses () {
        return this.processes.length;
    }

    updateStartTimeProcess(processID, newStart) {
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
}
