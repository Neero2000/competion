const MORNING_WORKERS = 5; // Number of workers needed in the morning
const NIGHT_WORKERS = 3;   // Number of workers needed at night

// Initialize workers' state
const workers = Array.from({ length: 20 }, (_, index) => ({
    workerNumber: index + 1, // Worker number starts from 1
    morningWork: 0,
    morningBreak: 0,
    nightWork: 0,
    nightBreak: 0,
    haveWorkedMorning: 0,
    haveWorkedNight: 0,
    priority: 0,
    priorityNight: 0
}));

// Initialize days and done flag
let days = 1;
let done1 = false;
let done2 = false;

const startBtn = document.getElementById('startBtn');
const outputContainer = document.getElementById('outputContainer');

startBtn.addEventListener('click', startSimulation);

function startSimulation() {
    outputContainer.innerHTML = ''; // Clear previous output
    let output = ''; // Store output HTML

    while (!done1 && !done2 && days < 400) {
        output += `<h2>Day ${days}:</h2>`;

        // Sort workers by priority (ascending order)
        workers.sort((a, b) => a.priority - b.priority);

        // Assign morning workers
        let morningCount = 0;
        output += `<h4>Morning worker: </h4>`;
        for (let j = 0; morningCount < MORNING_WORKERS && j < workers.length; j++) {
            if (workers[j].nightWork === 0 && workers[j].morningBreak === 0) {
                workers[j].morningWork = 1;
                workers[j].priority++; // Increase priority for fairness
                morningCount++;
                workers[j].nightBreak++;
                workers[j].haveWorkedMorning++;
                output += `<p>worker: ${workers[j].workerNumber}</p>`;
            }
        }

        // Decrement morning break count for eligible workers
        for (let i = 0; i < workers.length; i++) {
            if (workers[i].morningBreak > 0 && workers[i].morningWork === 0) {
                workers[i].morningBreak--;
            }
            if (workers[i].morningWork === 1) {
                workers[i].morningWork = 0;
            }
        }
        workers.sort((a, b) => a.priorityNight - b.priorityNight);
        // Assign night workers
        let nightCount = 0;
        output += `<h4>Night worker:</h4>`;
        for (let j = 0; nightCount < NIGHT_WORKERS && j < workers.length; j++) {
            if (workers[j].morningWork === 0 && workers[j].nightBreak === 0 && workers[j].nightWork === 0) {
                workers[j].nightWork = 1;
                nightCount++;
                workers[j].priorityNight++;
                workers[j].morningBreak += 2;
                workers[j].nightBreak += 2;
                workers[j].haveWorkedNight++;
                output += `<p>worker: ${workers[j].workerNumber}</p>`;
            }
        }

        // Decrement night break count for eligible workers
        for (let i = 0; i < workers.length; i++) {
            if (workers[i].nightBreak > 0 && workers[i].nightWork === 0) {
                workers[i].nightBreak--;
            }
            if (workers[i].nightWork === 1) {
                workers[i].nightWork = 0;
            }
        }

        if (workers.every(worker => worker.haveWorkedNight === workers[0].haveWorkedNight)) {
            done1 = true;
        }
        if (workers.every(worker => worker.haveWorkedMorning === workers[0].haveWorkedMorning)) {
            done2 = true;
        }

        days++;
    }

    // Display worker details after simulation
    output += '<h2>Worker Details:</h2>';
    workers.forEach(worker => {
        output += `<p>Worker ${worker.workerNumber} worked in the morning ${worker.haveWorkedMorning} times and in the night ${worker.haveWorkedNight} times</p>`;
    });

    outputContainer.innerHTML = output; // Update output in the container
}
