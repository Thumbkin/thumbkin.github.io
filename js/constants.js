// tot 26 processen mogelijk
const PROCESS_IDS = [ "A", "B", "C", "D", "E", "F", "G", "H", "I",
    "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];

// voor gedefineerde kleuren per proces
const PROCESS_COLORS = new Map();
PROCESS_COLORS.set("A", '#fff2cc');
PROCESS_COLORS.set("B", '#c5e0b4');
PROCESS_COLORS.set("C", '#f8cbad');
PROCESS_COLORS.set("D", '#b4c7e7');
PROCESS_COLORS.set("E", '#d9d9d9');
PROCESS_COLORS.set("F", '#ffa0a0');
PROCESS_COLORS.set("G", '#d0a172');
PROCESS_COLORS.set("H", '#f1b3ff');
PROCESS_COLORS.set("I", '#2f4f4f');
PROCESS_COLORS.set("J", '#8b4513');
PROCESS_COLORS.set("K", '#006400');
PROCESS_COLORS.set("L", '#808000');
PROCESS_COLORS.set("M", '#483d8b');
PROCESS_COLORS.set("N", '#d2b48c');
PROCESS_COLORS.set("O", '#8b008b');
PROCESS_COLORS.set("P", '#000080');
PROCESS_COLORS.set("Q", '#9acd32');
PROCESS_COLORS.set("R", '#66cdaa');
PROCESS_COLORS.set("S", '#ffa500');
PROCESS_COLORS.set("T", '#ff7f50');
PROCESS_COLORS.set("U", '#ff00ff');
PROCESS_COLORS.set("V", '#ffff00');
PROCESS_COLORS.set("W", '#d0a172');
PROCESS_COLORS.set("X", '#db7093');
PROCESS_COLORS.set("Y", '#ee82ee');
PROCESS_COLORS.set("Z", '#00ff7f');

// redenen waarom we moeten wisselen van proces
const REASONS_TO_SWAP = new Map();
REASONS_TO_SWAP.set('NONE', 'Huidige proces is nog niet volledig uitgevoerd');
REASONS_TO_SWAP.set('Q_VALUE_REACHED', 'Q waarde is bereikt');
REASONS_TO_SWAP.set('FINISHED', 'Huidige proces was volledig uitgevoerd');
REASONS_TO_SWAP.set('SHORTER_PROCESS', 'Er is een korter proces beschikbaar');
    
// Redenen waarop we volgende proces uit wachtrij kiezen
const REASONS_CHOICE_NEXT_PROCESS = new Map();
REASONS_CHOICE_NEXT_PROCESS.set("NONE", 'Vorige proces wordt verder uitgevoerd');
REASONS_CHOICE_NEXT_PROCESS.set("NO_PROCESS_AVAILABLE", 'Geen proces beschikbaar ter uitvoering');
REASONS_CHOICE_NEXT_PROCESS.set("FIRST_IN_QUEUE", 'Eerste uit wachtrij');
REASONS_CHOICE_NEXT_PROCESS.set("SHORTEST_IN_QUEUE", 'Kortste proces in wachtrij');
REASONS_CHOICE_NEXT_PROCESS.set("SHORTEST_TIME_LEFT_IN_QUEUE", 'Proces met kleinste resterende uitvoeringstijd in wachtrij');

// Type van schedulers
const SCHEDULER_TYPES = new Map();
SCHEDULER_TYPES.set('FCFS', 'FCFS');
SCHEDULER_TYPES.set('SPN', 'SPN');
SCHEDULER_TYPES.set('SRT', 'SRT');
SCHEDULER_TYPES.set('RR', 'RR');