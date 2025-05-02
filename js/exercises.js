// Contains premade exercises for the schedulers
// laad een vooraf genmaakte situatie zoals in de slides
function laadStartSituatie(type) {
    resetHuidigeSituatie();

    if(type === "Klas") { laadStartSituatieKlas() };
    if(type === "GrootNaarKlein") { laadStartSituatieGrootNaarKlein() };
    if(type === "KleinNaarGroot") { laadStartSituatieKleinNaarGroot() };
    if(type === "LangeProcessen") { laadStartSituatieLangeProcessen() };
    if(type === "KorteProcessen") { laadStartSituatieKorteProcessen() };
    if(type === "AlleKleuren") { laadStartSituatieAlleKleuren() };
}

function laadStartSituatieKlas() {
    voegStartProcesToe("A", 0, 7);
    voegStartProcesToe("B", 1, 4);
    voegStartProcesToe("C", 2, 2);
    voegStartProcesToe("D", 3, 10);
    voegStartProcesToe("E", 4, 1);
    voegStartProcesToe("F", 5, 6);
    voegStartProcesToe("G", 7, 3);
    voegStartProcesToe("H", 20, 2);

    selecteerAllePlanners([3, 4, 5]);
}

function laadStartSituatieGrootNaarKlein() {
    voegStartProcesToe("A", 0, 12);
    voegStartProcesToe("B", 1, 10);
    voegStartProcesToe("C", 2, 8);
    voegStartProcesToe("D", 3, 6);
    voegStartProcesToe("E", 4, 4);
    voegStartProcesToe("F", 5, 2);

    selecteerAllePlanners([4, 6, 8]);
}

function laadStartSituatieKleinNaarGroot() {
    voegStartProcesToe("A", 0, 2);
    voegStartProcesToe("B", 1, 4);
    voegStartProcesToe("C", 2, 6);
    voegStartProcesToe("D", 3, 8);
    voegStartProcesToe("E", 4, 10);
    voegStartProcesToe("F", 5, 12);

    selecteerAllePlanners([4, 6, 8]);
}

function laadStartSituatieKorteProcessen() {
    voegStartProcesToe("A", 0, 5);
    voegStartProcesToe("B", 0, 4);
    voegStartProcesToe("C", 0, 8);
    voegStartProcesToe("D", 2, 6);
    voegStartProcesToe("E", 3, 3);
    voegStartProcesToe("F", 5, 5);
    voegStartProcesToe("G", 6, 2);
    voegStartProcesToe("H", 6, 5);

    selecteerAllePlanners([2, 4, 5]);
}

function laadStartSituatieLangeProcessen() {
    voegStartProcesToe("A", 0, 7);
    voegStartProcesToe("B", 0, 9);
    voegStartProcesToe("C", 0, 8);
    voegStartProcesToe("D", 2, 5);
    voegStartProcesToe("E", 3, 10);
    voegStartProcesToe("F", 4, 4);
    voegStartProcesToe("G", 4, 2);
    voegStartProcesToe("H", 6, 5);

    selecteerAllePlanners([2, 5, 7]);
}

function laadStartSituatieAlleKleuren() {
    voegStartProcesToe("A", 0, 7);
    voegStartProcesToe("B", 1, 4);
    voegStartProcesToe("C", 2, 2);
    voegStartProcesToe("D", 3, 10);
    voegStartProcesToe("E", 4, 1);
    voegStartProcesToe("F", 5, 6);
    voegStartProcesToe("G", 7, 3);
    voegStartProcesToe("H", 20, 2);
    voegStartProcesToe("I", 1, 4);
    voegStartProcesToe("J", 2, 2);
    voegStartProcesToe("K", 3, 10);
    voegStartProcesToe("L", 4, 1);
    voegStartProcesToe("M", 5, 6);
    voegStartProcesToe("N", 7, 3);
    voegStartProcesToe("O", 20, 2);
    voegStartProcesToe("P", 1, 4);
    voegStartProcesToe("Q", 2, 2);
    voegStartProcesToe("R", 3, 10);
    voegStartProcesToe("S", 4, 1);
    voegStartProcesToe("T", 5, 6);
    voegStartProcesToe("U", 7, 3);
    voegStartProcesToe("V", 20, 2);
    voegStartProcesToe("W", 3, 10);
    voegStartProcesToe("X", 4, 1);
    voegStartProcesToe("Y", 5, 6);
    voegStartProcesToe("Z", 7, 3);

    selecteerAllePlanners([4, 6, 8]);
}

// voegt een preoces toe aan de startsituatie
function voegStartProcesToe(process_id, start, length){
    document.getElementById("dd_start_" + process_id).value = start;
    document.getElementById("dd_length_" + process_id).value = length;

    addProcess(process_id);
}

// selecteer alle planners met vooraf ingezete q waarden
function selecteerAllePlanners(q_values) {
    let cb_ids = [ 'FCFS', 'SPN', 'SRT', 'RR_one', 'RR_two', 'RR_three'];

    for(let i = 0; i < cb_ids.length; i++) {
        document.getElementById('cb_' + cb_ids[i]).checked = true;
    }

    // set the drop down values for q for RR
    let rr_number = [ 'one', 'two', 'three'];

    for(let j = 0; j < rr_number.length; j++) {
        document.getElementById('sel_RR_' + rr_number[j] + '_q').value = q_values[j];
    }
}