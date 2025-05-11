// laad een vooraf genmaakte situatie zoals in de slides
function laadStartSituatie() {
    let type = document.getElementById("dropdownMenuLink").value;

    alert(type);

    if (type !== 'geen'){
        resetHuidigeSituatie();

        if(type === "Slides") { laadStartSituatieSlides() };
        if(type === "GrootNaarKlein") { laadStartSituatieGrootNaarKlein() };
        if(type === "KleinNaarGroot") { laadStartSituatieKleinNaarGroot() };
        if(type === "LangeProcessen") { laadStartSituatieLangeProcessen() };
        if(type === "KorteProcessen") { laadStartSituatieKorteProcessen() };
        if(type === "AlleKleuren") { laadStartSituatieAlleKleuren() };
    }
}

function loadExercise(type) {
    if (type !== 'geen'){
        HTML_GENERATOR.resetProcessInformation();

        if(type === "Slides") { laadStartSituatieSlides() };
        if(type === "Groot naar klein") { laadStartSituatieGrootNaarKlein() };
        if(type === "Klein naar groot") { laadStartSituatieKleinNaarGroot() };
        if(type === "Lange processen") { laadStartSituatieLangeProcessen() };
        if(type === "Korte processen") { laadStartSituatieKorteProcessen() };
        if(type === "Alle kleuren") { laadStartSituatieAlleKleuren() };

        document.getElementById("dropdownMenuLink").innerText = type;
    }
}

function laadStartSituatieSlides() {
    addStartingProcess("A", 0, 7);
    addStartingProcess("B", 1, 4);
    addStartingProcess("C", 2, 2);
    addStartingProcess("D", 3, 10);
    addStartingProcess("E", 4, 1);
    addStartingProcess("F", 5, 6);
    addStartingProcess("G", 7, 3);
    addStartingProcess("H", 12, 2);

    selectAllSchedulers([3, 4, 5]);
}

function laadStartSituatieGrootNaarKlein() {
    addStartingProcess("A", 0, 12);
    addStartingProcess("B", 1, 10);
    addStartingProcess("C", 2, 8);
    addStartingProcess("D", 3, 6);
    addStartingProcess("E", 4, 4);
    addStartingProcess("F", 5, 2);

    selectAllSchedulers([4, 6, 8]);
}

function laadStartSituatieKleinNaarGroot() {
    addStartingProcess("A", 0, 2);
    addStartingProcess("B", 1, 4);
    addStartingProcess("C", 2, 6);
    addStartingProcess("D", 3, 8);
    addStartingProcess("E", 4, 10);
    addStartingProcess("F", 5, 12);

    selectAllSchedulers([4, 6, 8]);
}

function laadStartSituatieKorteProcessen() {
    addStartingProcess("A", 0, 5);
    addStartingProcess("B", 0, 4);
    addStartingProcess("C", 0, 8);
    addStartingProcess("D", 2, 6);
    addStartingProcess("E", 3, 3);
    addStartingProcess("F", 5, 5);
    addStartingProcess("G", 6, 2);
    addStartingProcess("H", 6, 5);

    selectAllSchedulers([2, 4, 5]);
}

function laadStartSituatieLangeProcessen() {
    addStartingProcess("A", 0, 7);
    addStartingProcess("B", 0, 9);
    addStartingProcess("C", 0, 8);
    addStartingProcess("D", 2, 5);
    addStartingProcess("E", 3, 10);
    addStartingProcess("F", 4, 4);
    addStartingProcess("G", 4, 2);
    addStartingProcess("H", 6, 5);

    selectAllSchedulers([2, 5, 7]);
}

function laadStartSituatieAlleKleuren() {
    addStartingProcess("A", 0, 7);
    addStartingProcess("B", 1, 4);
    addStartingProcess("C", 2, 2);
    addStartingProcess("D", 3, 10);
    addStartingProcess("E", 4, 1);
    addStartingProcess("F", 5, 6);
    addStartingProcess("G", 7, 3);
    addStartingProcess("H", 20, 2);
    addStartingProcess("I", 1, 4);
    addStartingProcess("J", 2, 2);
    addStartingProcess("K", 3, 10);
    addStartingProcess("L", 4, 1);
    addStartingProcess("M", 5, 6);
    addStartingProcess("N", 7, 3);
    addStartingProcess("O", 20, 2);
    addStartingProcess("P", 1, 4);
    addStartingProcess("Q", 2, 2);
    addStartingProcess("R", 3, 10);
    addStartingProcess("S", 4, 1);
    addStartingProcess("T", 5, 6);
    addStartingProcess("U", 7, 3);
    addStartingProcess("V", 20, 2);
    addStartingProcess("W", 3, 10);
    addStartingProcess("X", 4, 1);
    addStartingProcess("Y", 5, 6);
    addStartingProcess("Z", 7, 3);

    selectAllSchedulers([4, 6, 8]);
}

// voegt een preoces toe aan de startsituatie
function addStartingProcess(process_id, start, length){
    document.getElementById("dd_start_" + process_id).value = String(start);
    document.getElementById("dd_length_" + process_id).value = String(length);

    addProcess(process_id);
}

// selecteer alle planners met vooraf ingezete q waarden
function selectAllSchedulers(q_values) {
    let cb_ids = [ 'FCFS', 'SPN', 'SRT', 'RR_one', 'RR_two', 'RR_three'];

    for(let i = 0; i < cb_ids.length; i++) {
        document.getElementById('cb_planners_' + cb_ids[i]).checked = true;
    }

    // set the drop down values for q for RR
    let rr_number = [ 'one', 'two', 'three'];

    for(let j = 0; j < rr_number.length; j++) {
        document.getElementById('sel_planners_RR_' + rr_number[j] + '_q').value = q_values[j];
    }
}