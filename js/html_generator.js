class HTML_GENERATOR {
    // Parses solution of multiple schedulers to html
    static getSchedulerSolutionsAsHTML(schedulers, step_number){
        let number_of_steps = schedulers[0].getSolution().length;

        if (step_number === undefined){ step_number = number_of_steps }

        let toHTML = '<table>';
        // repeat for each scheduler solution
        for(let s = 0; s < schedulers.length; s++){
            // first row is empty
            toHTML += '<tr><td class="scheduler_vertical"></td><td colspan="' + (number_of_steps + 1) + '"></td></tr>';
            // second row: name scheduler | each step from solution
            if (schedulers[s].getType() === SCHEDULER_TYPES.get('RR')){
                toHTML += '<tr><td class="scheduler_vertical">' + schedulers[s].getType() + ' (Q = ' + schedulers[s].getQvalue() + ')</td>';
            }
            else {
                toHTML += '<tr><td class="scheduler_vertical">' + schedulers[s].getType() + '</td>';
            }
            for (let i = 0; i <= step_number; i++) {
                toHTML += '<td class="scheduler_step" style="background-color: '+ PROCESS_COLORS.get(schedulers[s].getSolution()[i]) + '">' + schedulers[s].getSolution()[i] + '</td>';
            }
            toHTML += '<tr>';
        }
        // filler row: empty
        toHTML += '<tr><td class="scheduler_vertical"></td><td colspan="' + (number_of_steps + 1) + '"></td></tr>';
        // last row: time units
        toHTML += '<tr><td class="scheduler_vertical_no_border">0</td>';
        for (let i = 1; i <= number_of_steps + 1; i++) {
            toHTML += '<td class="scheduler_time">' + i + '</td>';
        }
        toHTML += '</tr></table>';

        return toHTML;
    }

    static renderStatingSituation (starting_situation) {
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
            toHTML += '</tr>';
        });
        // Last row: time units
        toHTML += '<tr><td class="scheduler_vertical_no_border">0</td>';
        for (let i = 1; i <= amountTimeNeeded; i++) {
            toHTML += '<td class="scheduler_time">' + i + '</td>';
        }
        toHTML += '</tr></table>';

        document.getElementById("container_starting_situation").innerHTML = toHTML;
    }

    // genereert html code voor een drop down voor start of lengte
    static generateDropDown (process_id, type) {
        let inner_HTML = '<select id="dd_' + type + '_' + process_id + '" class="inp_process" ';
        let i = 0;
        // if type = length, then start from 1
        if (type === "length") {
            i = 1;
            inner_HTML += 'onchange="updateProcessLength(' + "'" + process_id + "'" + ');">';
        }
        else {
            inner_HTML += 'onchange="updateProcessStart(' + "'" + process_id + "'" + ');">';
        }
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

    //renders one step of the solution
    static renderStep(step_number) {
        // fill in the top section of the info
        document.getElementById("td_timestamp").innerHTML = step_number;
        document.getElementById("btn_first_step").disabled = (step_number === 0);
        document.getElementById("btn_prev_step").disabled = (step_number === 0);
        document.getElementById("btn_next_step").disabled = (step_number === (PLANNER_EXCERSIZE.getSchedulers()[0].getTotalNumberOfSteps() - 1));
        document.getElementById("btn_last_step").disabled = (step_number === (PLANNER_EXCERSIZE.getSchedulers()[0].getTotalNumberOfSteps() - 1));
        document.getElementById("inp_range_steps").value = step_number;

        // it is last step, stop the animator
        if(step_number === (PLANNER_EXCERSIZE.getSchedulers()[0].getTotalNumberOfSteps() - 1)){
            ANIMATOR.stop();
        }

        let schedulers = PLANNER_EXCERSIZE.getSchedulers();
        let max_length_queue = PLANNER_EXCERSIZE.getTotalNumberOfProcesses();

        // array to keep track how many RR we rendered for ids one, two, three
        let current_rr_ids = ["one", "two", "three"];

        // hide all planner rows frist
        let all_planner_types = ['FCFS', 'SRT', 'SPN', 'RR_one', 'RR_two', 'RR_three'];
        for(let i = 0; i < all_planner_types.length; i++) {
            document.getElementById("tr_info_" + all_planner_types[i] + "_one").style.display = "none";
            document.getElementById("tr_info_" + all_planner_types[i] + "_two").style.display = "none";
        }

        // fill info for each planner
        for(let i = 0; i < PLANNER_EXCERSIZE.getNumberOfSchedulers(); i++) {
            let scheduler_type = schedulers[i].getType();
            let step = schedulers[i].getStep(step_number);

            // if we have RR, get the id for html elements from array
            if(scheduler_type === "RR") {
                scheduler_type = scheduler_type + "_" + current_rr_ids.shift();
                document.getElementById("td_" + scheduler_type + "_q").innerHTML = "RR (Q = " + schedulers[i].getQvalue() + ")";
            }

            document.getElementById("td_" + scheduler_type + "_queue_pre_exec").innerHTML = HTML_GENERATOR.generateQueue(step.getQueueBeforeExecution(), max_length_queue);
            if (step.getReasonToSwap() === REASONS_TO_SWAP.get('NONE')){
                document.getElementById("td_" + scheduler_type + "_reason_swap").innerHTML = "Nee (";
            }
            else {
                document.getElementById("td_" + scheduler_type + "_reason_swap").innerHTML = "Ja (";
            }
            document.getElementById("td_" + scheduler_type + "_reason_swap").innerHTML += step.getReasonToSwap() + ")";

            document.getElementById("td_" + scheduler_type + "_queue_exec").innerHTML = HTML_GENERATOR.generateQueue(step.getQueueExecution(), max_length_queue);
            document.getElementById("td_" + scheduler_type + "_exec_proces").innerHTML = step.getExecutedProcess() + " (" + step.getReasonChoosenProcess() + ")";

            if(step.addedProcessesToQueue()){
                document.getElementById("td_" + scheduler_type + "_add_to_queue").innerHTML = "Ja (" + step.getAddedProcesses() + ")";
            }
            else {
                document.getElementById("td_" + scheduler_type + "_add_to_queue").innerHTML = "Nee";
            }
            document.getElementById("td_" + scheduler_type + "_queue_post_exec").innerHTML = HTML_GENERATOR.generateQueue(step.getQueueAfterExecution(), max_length_queue);
            // show the tablerows again for the planner
            document.getElementById("tr_info_" + scheduler_type + "_one").style.display = "";
            document.getElementById("tr_info_" + scheduler_type + "_two").style.display = "";
        }

        document.getElementById("resultaten_planners").innerHTML = "<br>" + HTML_GENERATOR.getSchedulerSolutionsAsHTML(PLANNER_EXCERSIZE.getSchedulers(), step_number);
    }

    // Renders the components for the initial HTML page
    static initPage(){
        this.addProcessInformationHeaderRow();
        this.addNewProcessRow();
    }

    static addProcessInformationHeaderRow() {
        document.getElementById("container_process_info").innerHTML =
            '<div class="row">' +
                '<div class="col-5">Proces</div>' +
                '<div class="col-3">Start op</div>' +
                '<div class="col-3">Lengte</div>' +
                '<div class="col"></div>' +
            '</div>';
    }

    static addNewProcessRow() {
        let process_id = PLANNER_EXCERSIZE.getNextUnusedProcessId();

        let div_element = document.createElement("div");
        div_element.id = "div_process_info_" + process_id;

        let new_inner_HTML = "<div class=\"row\" style=\"padding-bottom: 3px; text-align: center; vertical-align: middle;\">";
        new_inner_HTML += "<div class=\"col-5\" style=\"border: 1px solid black; background-color: " + PROCESS_COLORS.get(process_id) +";\">" + process_id + "</div>";
        new_inner_HTML += "<div class=\"col-3\">" + HTML_GENERATOR.generateDropDown(process_id, "start") + "</div>";
        new_inner_HTML += "<div class=\"col-3\">" + HTML_GENERATOR.generateDropDown(process_id, "length") + "</div>";
        new_inner_HTML += "<div class=\"col-1\" id=\"btns_" + process_id + "\" ></div>";
        new_inner_HTML += "</div>";
        div_element.innerHTML = new_inner_HTML;

        document.getElementById("container_process_info").appendChild(div_element);

        this.setProcessAddButton(process_id)
    }

    static removeProcessRow(process_id){
        document.getElementById("div_process_info_"+ process_id).innerHTML = "";
        document.getElementById("div_process_info_"+ process_id).remove();
        // if we removed the last process, add a dummy again
        if(PLANNER_EXCERSIZE.getTotalNumberOfProcesses() <= 0){
            this.addNewProcessRow();
        }

        // render de nieuwe startsituatie
        this.renderStatingSituation(PLANNER_EXCERSIZE.getStartingSituation());
    }

    static setProcessAddButton(process_id) {
        // change the icon in the table to remove instead of add
        document.getElementById("btns_" + process_id).innerHTML = "<button type=\"button\" class=\"btn btn-process-add\" onclick=\"addProcess('" + process_id + "');\">+</buton>";
    }

    static setProcessRemoveButton(process_id) {
        // change the icon in the table to remove instead of add
        document.getElementById("btns_" + process_id).innerHTML = "<button type=\"button\" class=\"btn btn-process-remove\" onclick=\"removeProcess('" + process_id + "');\">-</buton>";
    }

    static resetProcessInformation() {
        PLANNER_EXCERSIZE.resetStartingSituation();

        this.addProcessInformationHeaderRow();
        this.addNewProcessRow();
    }
}