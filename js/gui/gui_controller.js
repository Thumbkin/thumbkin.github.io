class GuiController {
    animator;

    // Creates a new gui controller
    constructor() {
        // Creates e new empty animator
        this.animator = new Animator();
    }

    renderStartingSituation (starting_situation) {
        let processes = starting_situation.getProcesses();
        // add 2 for the first column, add 1 for step 0
        let time_needed = starting_situation.getMaxTime();

        // create the table, which is new grid containing 2 columns more than total needed
        let toHTML = '<div class="grid grid-cols-'+ (time_needed + 2) + '">';
        // first row is text process | nothing
        toHTML += '<div class="col-span-2 div_process_start_name_header">Proces</div><div class="col-span-' + time_needed + '"></div>';
        // add a row for each process
        processes.forEach(function addToHTML(process){
            // second row: name scheduler | each step from solution
            toHTML += '<div class="col-span-2 div_process_start_name">' + process.getId() + '</div>';
            // create blanks before start
            for (let i = 0; i < process.getStart(); i++) {
                toHTML += '<div class="div_process_start_step"></div>';
            }
            // add process itself
            for (let i = process.getStart(); i < (process.getStart() + process.getLength()); i++) {
                toHTML += '<div class="div_process_start_step" style="background-color: '+ PROCESS_COLORS.get(process.getId()) + '">' + process.getId() + '</div>';
            }
            //create blanks after
            for (let i = (process.getStart() + process.getLength()); i < time_needed; i++) {
                toHTML += '<div class="div_process_start_step"></div>';
            }
        });
        // Last row: time units
        toHTML += '<div class="col-span-2 div_process_start_name_time">0</div>';
        for (let i = 1; i <= time_needed; i++) {
            toHTML += '<div class="div_process_start_step_time">' + i + '</div>';
        }
        toHTML += '</div>';

        document.getElementById("container_starting_situation").innerHTML = toHTML;
    }

    // genereert html code voor een drop down voor start of lengte
    generateDropDown (process_id, type) {
        let inner_HTML = '<select id="dd_' + type + '_' + process_id + '" ';
        let i = 0;
        // if type = length, then start from 1
        if (type === "length") {
            i = 1;
            inner_HTML += 'onchange="DC.updateProcessLength(' + "'" + process_id + "'" + ');">';
        }
        else {
            inner_HTML += 'onchange="DC.updateProcessStart(' + "'" + process_id + "'" + ');">';
        }
        // add numbers 0 to 50 as possible values
        for (i; i <= 50; i++) {
            inner_HTML += "<option value=\"" + i + "\">" + i + "</option>";
        }
        inner_HTML += "</select>";
        return inner_HTML
    }

    generateQueue(queue, max_queue_length){
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
    renderStep(step_number) {
        document.getElementById("container_solution").style.display = "inline";
        // Update the number of timestep
        document.getElementById("solution_timestep").innerHTML = step_number;
        // update the filled bar of slider
        document.getElementById("inp_range_steps").value = step_number;
        // update the status of the animator buttons
        document.getElementById("btn_play_steps_first").disabled = (step_number === 0);
        document.getElementById("btn_play_steps_prev").disabled = (step_number === 0);
        document.getElementById("btn_play_steps_next").disabled = (step_number === (DC.getTotalNumberOfSteps() - 1));
        document.getElementById("btn_play_steps_last").disabled = (step_number === (DC.getTotalNumberOfSteps() - 1));
        document.getElementById("inp_range_steps").value = step_number;

        // it is last step, stop the animator
        if(step_number === (DC.getTotalNumberOfSteps()  - 1)){
            this.stopAnimation();
        }

        let schedulers = DC.getSolutionSchedulers();
        let time_needed = DC.getTotalNumberOfSteps() + 1;

        if (step_number === undefined){ step_number = time_needed }

        // create the table, which is new grid containing 2 columns more than total needed
        let toHTML = '<div class="grid grid-cols-'+ (time_needed + 2) + '">';
        // repeat for each scheduler solution
        for(let s = 0; s < schedulers.length; s++){
            // first row is empty
            toHTML += '<div class="col-span-2 div_process_solution_name"></div><div class="col-span-' + time_needed + '"></div>';
            // second row: name scheduler | each step from solution
            if (schedulers[s].getType() === SCHEDULER_TYPES.get('RR')){
                toHTML += '<div class="col-span-2 div_process_solution_name">' + schedulers[s].getType() + ' (Q = ' + schedulers[s].getQvalue() + ')</div>';
            }
            else {
                toHTML += '<div class="col-span-2 div_process_solution_name">' + schedulers[s].getType() + '</div>';
            }
            for (let i = 0; i <= step_number; i++) {
                toHTML += '<div class="div_process_solution_step" style="background-color: '+ PROCESS_COLORS.get(schedulers[s].getSolution()[i]) + '">' + schedulers[s].getSolution()[i] + '</div>';
            }
            // add empty filler column
            toHTML += '<div class="div_process_solution_empty_step"></div>';
        }
        // filler row: empty
        toHTML += '<div class="col-span-2 div_process_solution_name"></div><div class="col-span-' + time_needed + '"></div>';
        // Last row: time units
        toHTML += '<div class="col-span-2 div_process_solution_name_time">0</div>';
        for (let i = 1; i <= time_needed; i++) {
            toHTML += '<div class="div_process_solution_step_time">' + i + '</div>';
        }
        toHTML += '</div>';

        document.getElementById("container_solution_full").innerHTML = toHTML;
    }

    addNewProcessRow() {
        let process_id = DC.getNextUnusedProcessId();

        let div_element = document.createElement("div");
        div_element.id = "div_process_info_" + process_id;

        let new_inner_HTML = "<div class=\"grid grid-cols-5 gap-0\">";
        new_inner_HTML += "<div class=\"col-span-2\" style=\"border: 1px solid black; background-color: " + PROCESS_COLORS.get(process_id) +";\">" + process_id + "</div>";
        new_inner_HTML += "<div>" + this.generateDropDown(process_id, "start") + "</div>";
        new_inner_HTML += "<div>" + this.generateDropDown(process_id, "length") + "</div>";
        new_inner_HTML += "<div id=\"btns_" + process_id + "\" ></div>";
        new_inner_HTML += "</div>";
        div_element.innerHTML = new_inner_HTML;

        document.getElementById("container_process_info").appendChild(div_element);

        this.setProcessAddButton(process_id);
    }

    removeProcessRow(process_id){
        let div_element = document.getElementById("div_process_info_"+ process_id);
        document.getElementById("container_process_info").removeChild(div_element);
        // check if we still have process rows, 1st row is header row
        if(document.getElementById("container_process_info").childElementCount <= 1){
            this.addNewProcessRow();
        }

        // render de nieuwe startsituatie
        this.renderStatingSituation(DC.getStartingSituation());
    }

    setProcessAddButton(process_id) {
        // change the icon in the table to remove instead of add
        document.getElementById("btns_" + process_id).innerHTML = "<button type=\"button\" class=\"btn btn-process-add\" onclick=\"DC.addProcess('" + process_id + "');\">+</buton>";
    }

    setProcessRemoveButton(process_id) {
        // change the icon in the table to remove instead of add
        document.getElementById("btns_" + process_id).innerHTML = "<button type=\"button\" class=\"btn btn-process-remove\" onclick=\"DC.removeProcess('" + process_id + "');\">-</buton>";
    }

    resetProcessInformation() {
        // clear all info from the zone except header row
        document.getElementById("container_process_info").innerHTML = document.getElementById("container_process_info").children[0].outerHTML;

        this.addNewProcessRow();
    }

    hideResults(){
        document.getElementById("container_solution").style.display = "none";
    }

    setMaxSteps(max_steps){
        this.animator.setMaxSteps(max_steps);
        // adjust max value of the slider
        document.getElementById("inp_range_steps").max = Number(max_steps + 1);
        document.getElementById("inp_range_steps").value = Number(max_steps + 1);
        // adjust the labels under the slider for max
        document.getElementById("inp_range_steps_max").innerHTML = (max_steps + 1);

    }

    stopAnimation(){
        this.animator.stop();
        document.getElementById("btn_play_steps_run").style.display = "inline";
        document.getElementById("btn_play_steps_pause").style.display = "none";
    }

    stopAnimationIfRunning(){
        if(this.animator.isRunning()) { this.stopAnimation(); }
    }

    startAnimation(){
        this.animator.play();
        document.getElementById("btn_play_steps_run").style.display = "none";
        document.getElementById("btn_play_steps_pause").style.display = "inline";
    }

    pauseAnimation(){
        this.animator.pause();
        document.getElementById("btn_play_steps_run").style.display = "inline";
        document.getElementById("btn_play_steps_pause").style.display = "none";
    }

    getValueOfDropDown(dropdown_id){
        return document.getElementById(dropdown_id).value;
    }

    getValueOfDropDownAsNumber(dropdown_id){
        return Number(document.getElementById(dropdown_id).value);
    }

    getMaxValueOfDropDownAsNumber(dropdown_id){
        return Number(document.getElementById(dropdown_id).max);
    }

    setValueOfDropDownAsNumber(dropdown_id, value){
        document.getElementById(dropdown_id).value = Number(value);
    }

    setValueOfDropDown(dropdown_id, value){
        document.getElementById(dropdown_id).value = value;
    }
    setCheckBoxAsChecked(checkbox_id){
        document.getElementById(checkbox_id).checked = true;
    }
}