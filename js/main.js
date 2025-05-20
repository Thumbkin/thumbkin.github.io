const DC = new DomainController();
const GC = new GuiController();
const EM = new ExerciseManager();

function initPage() {
    GC.addNewProcessRow();
    GC.renderStatingSituation(DC.getStartingSituation());

    GC.setMaxSteps(20);
}