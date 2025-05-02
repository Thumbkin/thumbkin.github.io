class HTML_GENERATOR {
    // Parses solution of multiple schedulers to html
    static getSchedulerSolutionsAsHTML(schedulers, step_number){
        let number_of_steps = 1;


        if(schedulers.length > 0) {
            number_of_steps = schedulers[0].getSolution().length;
        }

        if (step_number === undefined){ step_number = number_of_steps}

        let toHTML = '<table>';
        // repeat for each scheduler solution
        for(let s = 0; s < schedulers.length; s++){
            // first row is empty
            toHTML += '<tr><td class="scheduler_vertical"></td><td colspan="' + (number_of_steps + 1)+ '"></td></tr>';
            // second row: name scheduler | each step from solution
            if (schedulers[s].getType() === SCHEDULER_TYPES.get('RR')){
                toHTML += '<tr><td class="scheduler_vertical">' + schedulers[s].getType() + ' (Q = ' + schedulers[s].getQvalue() + ')</td>';
            }
            else {
                toHTML += '<tr><td class="scheduler_vertical">' + schedulers[s].getType() + '</td>';
            }
            for (let i = 0; i < step_number; i++) {
                toHTML += '<td class="scheduler_step" style="background-color: '+ PROCESS_COLORS.get(schedulers[s].getSolution()[i]) + '">' + schedulers[s].getSolution()[i] + '</td>';
            }
            toHTML += '<tr>';
        }
        // filler row: empty
        toHTML += '<tr><td class="scheduler_vertical"></td><td colspan="' + number_of_steps + '"></td></tr>';
        // last row: time units
        toHTML += '<tr><td class="scheduler_vertical_no_border">0</td>';
        for (let i = 1; i <= number_of_steps + 1; i++) {
            toHTML += '<td class="scheduler_time">' + i + '</td>';
        }
        toHTML += '</tr></table>';

        return toHTML;
    }

    static getStartingSituationAsHTML (starting_situation) {
        let processes = starting_situation.getProcesses();
        // sort processes by id
        processes.sort(function(a, b){
            if(a.getId() < b.getId()) { return -1 }
            if(a.getId() > b.getId()) { return 1 }
            return 0;
        });

        // calculate the amount of time steps we need
        let amountTimeNeeded= 0;

        processes.forEach(function checkMoreTime(process){
            if((process.getStart() + process.getLength())  > amountTimeNeeded){
                amountTimeNeeded = process.getStart() + process.getLength();
            }
        });

        // add 1 for nice visualisation and to have at least 1 time unit, e.g. if we have 0 processes
        amountTimeNeeded++;

        // create the table
        let toHTML = '<table>';
        // first row is text process | nothing
        toHTML += '<tr><td class="starting_vertical_top">Proces</td><td colspan="' + amountTimeNeeded + '"></td></tr>';
        // add a row for each process
        processes.forEach(function addToHTML(process){
            // second row: name scheduler | each step from solution
            toHTML += '<tr><td class="starting_vertical_process">' + process.getId() + '</td>';
            // create blanks before start
            for (let i = 0; i < process.getStart(); i++) {
                toHTML += '<td class="scheduler_step"></td>';
            }
            // add process itself
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
        for (let i = 1; i <= amountTimeNeeded; i++) {
            toHTML += '<td class="scheduler_time">' + i + '</td>';
        }
        toHTML += '</tr></table>';

        return toHTML;
    }

    // genereert html code voor een drop down voor start of lengte
    static generateDropDown (process_id, type) {
        let inner_HTML = "<select id=\"dd_" + type + "_" + process_id + "\">";
        let i = 0;
        // if type = length, then start from 1
        if (type === "length") i = 1;
        // add numbers 0 to 50 as possible values
        for (i; i <= 50; i++) {
            inner_HTML += "<option value=\"" + i + "\">" + i + "</option>";
        }
        inner_HTML += "</select>";
        return inner_HTML
    }

    static generateQueue(queue, max_queue_length){
        let inner_HTML = '<table><tr>';
        for (let i = 0; i < queue.length; i++) {
            inner_HTML += '<td class="scheduler_step" style="background-color: '+ PROCESS_COLORS.get(queue[i].getId()) + '">' + queue[i].getId() + '</td>';
        }
        for (let i = queue.length; i < max_queue_length; i++) {
            inner_HTML += '<td class="scheduler_step"></td>';
        }
        inner_HTML += '</tr></table>';

        return inner_HTML;
    }
}