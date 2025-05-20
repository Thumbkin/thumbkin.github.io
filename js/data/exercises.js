class ExerciseManager {
    loadExercise(value) {
        if(!value) {
            value = GC.getValueOfDropDown("sel_exercises");
        }
        console.log("loadExercise: " + value);
        if (value !== 'geen'){
            DC.resetStartingSituation();

            if(value === "Slides") { this.#loadExcerciseSlides() }
            if(value === "Groot naar klein") { this.#loadExcerciseGrootNaarKlein() }
            if(value === "Klein naar groot") { this.#loadExcerciseKleinNaarGroot() }
            if(value === "Lange processen") { this.#loadExcerciseLangeProcessen() }
            if(value === "Korte processen") { this.#loadExcerciseKorteProcessen() }
            if(value === "Alle kleuren") { this.#loadExcerciseAlleKleuren() }
        }
    }

    #loadExcerciseSlides() {
        console.log("loadExcerciseSlides");
        this.#addStartingProcess("A", 0, 7);
        this.#addStartingProcess("B", 1, 4);
        this.#addStartingProcess("C", 2, 2);
        this.#addStartingProcess("D", 3, 10);
        this.#addStartingProcess("E", 4, 1);
        this.#addStartingProcess("F", 5, 6);
        this.#addStartingProcess("G", 7, 3);
        this.#addStartingProcess("H", 12, 2);

        this.#selectAllSchedulers([3, 4, 5]);
    }

    #loadExcerciseGrootNaarKlein() {
        this.#addStartingProcess("A", 0, 12);
        this.#addStartingProcess("B", 1, 10);
        this.#addStartingProcess("C", 2, 8);
        this.#addStartingProcess("D", 3, 6);
        this.#addStartingProcess("E", 4, 4);
        this.#addStartingProcess("F", 5, 2);

        this.#selectAllSchedulers([4, 6, 8]);
    }

    #loadExcerciseKleinNaarGroot() {
        this.#addStartingProcess("A", 0, 2);
        this.#addStartingProcess("B", 1, 4);
        this.#addStartingProcess("C", 2, 6);
        this.#addStartingProcess("D", 3, 8);
        this.#addStartingProcess("E", 4, 10);
        this.#addStartingProcess("F", 5, 12);

        this.#selectAllSchedulers([4, 6, 8]);
    }

    #loadExcerciseKorteProcessen() {
        this.#addStartingProcess("A", 0, 5);
        this.#addStartingProcess("B", 0, 4);
        this.#addStartingProcess("C", 0, 8);
        this.#addStartingProcess("D", 2, 6);
        this.#addStartingProcess("E", 3, 3);
        this.#addStartingProcess("F", 5, 5);
        this.#addStartingProcess("G", 6, 2);
        this.#addStartingProcess("H", 6, 5);

        this.#selectAllSchedulers([2, 4, 5]);
    }

    #loadExcerciseLangeProcessen() {
        this.#addStartingProcess("A", 0, 7);
        this.#addStartingProcess("B", 0, 9);
        this.#addStartingProcess("C", 0, 8);
        this.#addStartingProcess("D", 2, 5);
        this.#addStartingProcess("E", 3, 10);
        this.#addStartingProcess("F", 4, 4);
        this.#addStartingProcess("G", 4, 2);
        this.#addStartingProcess("H", 6, 5);

        this.#selectAllSchedulers([2, 5, 7]);
    }

    #loadExcerciseAlleKleuren() {
        this.#addStartingProcess("A", 0, 7);
        this.#addStartingProcess("B", 1, 4);
        this.#addStartingProcess("C", 2, 2);
        this.#addStartingProcess("D", 3, 10);
        this.#addStartingProcess("E", 4, 1);
        this.#addStartingProcess("F", 5, 6);
        this.#addStartingProcess("G", 7, 3);
        this.#addStartingProcess("H", 20, 2);
        this.#addStartingProcess("I", 1, 4);
        this.#addStartingProcess("J", 2, 2);
        this.#addStartingProcess("K", 3, 10);
        this.#addStartingProcess("L", 4, 1);
        this.#addStartingProcess("M", 5, 6);
        this.#addStartingProcess("N", 7, 3);
        this.#addStartingProcess("O", 20, 2);
        this.#addStartingProcess("P", 1, 4);
        this.#addStartingProcess("Q", 2, 2);
        this.#addStartingProcess("R", 3, 10);
        this.#addStartingProcess("S", 4, 1);
        this.#addStartingProcess("T", 5, 6);
        this.#addStartingProcess("U", 7, 3);
        this.#addStartingProcess("V", 20, 2);
        this.#addStartingProcess("W", 3, 10);
        this.#addStartingProcess("X", 4, 1);
        this.#addStartingProcess("Y", 5, 6);
        this.#addStartingProcess("Z", 7, 3);

        this.#selectAllSchedulers([4, 6, 8]);
    }

    // voegt een proces toe aan de startsituatie
    #addStartingProcess(process_id, start, length){
        console.log("addStartingProcess: " + process_id + " " + start, " " + length);
        GC.setValueOfDropDownAsNumber("dd_start_" + process_id, start);
        GC.setValueOfDropDownAsNumber("dd_length_" + process_id, length);

        DC.addProcess(process_id);
    }

    // selecteer alle planners met vooraf ingezete q waarden
    #selectAllSchedulers(q_values) {
        console.log("selectAllSchedulers: " + q_values);
        let cb_ids = [ 'FCFS', 'SPN', 'SRT', 'RR_one', 'RR_two', 'RR_three'];

        for(let i = 0; i < cb_ids.length; i++) {
            GC.setCheckBoxAsChecked('cb_planners_' + cb_ids[i]);
        }

        // set the drop down values for q for RR
        let rr_number = [ 'one', 'two', 'three'];

        for(let j = 0; j < rr_number.length; j++) {
            GC.setValueOfDropDownAsNumber('sel_planners_RR_' + rr_number[j] + '_q', q_values[j]);
        }
    }
}