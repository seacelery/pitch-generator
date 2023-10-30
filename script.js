const notes = {
    'A0': 27.50,
    'A#0 / Bb': 29.14,
    'B0': 30.87,
    'C1': 32.70,
    'C♯1 / Db': 34.65,
    'D1': 36.71,
    'D#1 / Eb': 38.89,
    'E1': 41.20,
    'F1': 43.65,
    'F#1 / Gb': 46.25,
    'G1': 49.00,
    'G#1 / Ab': 51.91,
    'A1': 55.00,
    'A#1 / Bb': 58.27,
    'B1': 61.74,
    'C2': 65.41,
    'C♯2 / Db': 69.30,
    'D2': 73.42,
    'D#2 / Eb': 77.78,
    'E2': 82.41,
    'F2': 87.31,
    'F#2 / Gb': 92.50,
    'G2': 98.00,
    'G#2 / Ab': 103.83,
    'A2': 110.00,
    'A#2 / Bb': 116.54,
    'B2': 123.47,
    'C3': 130.81,
    'C♯3 / Db': 138.59,
    'D3': 146.83,
    'D#3 / Eb': 155.56,
    'E3': 164.81,
    'F3': 174.61,
    'F#3 / Gb': 185.00,
    'G3': 196.00,
    'G#3 / Ab': 207.65,
    'A3': 220.00,
    'A#3 / Bb': 233.08,
    'B3': 246.94,
    'C4': 261.63,
    'C♯4 / Db': 277.18,
    'D4': 293.66,
    'D#4 / Eb': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4 / Gb': 369.99,
    'G4': 392.00,
    'G#4 / Ab': 415.30,
    'A4': 440.00,
    'A#4 / Bb': 466.16,
    'B4': 493.88,
    'C5': 523.25,
    'C♯5 / Db': 554.37,
    'D5': 587.33,
    'D#5 / Eb': 622.25,
    'E5': 659.25,
    'F5': 698.46,
    'F#5 / Gb': 739.99,
    'G5': 783.99,
    'G#5 / Ab': 830.61,
    'A5': 880.00,
    'A#5 / Bb': 932.33,
    'B5': 987.77
};

const playButtonHandler = () => {
    if (tone !== null) {
        tone.stop();
        tone = null;
        document.getElementById('play-button').textContent = "Play";
        playingIcon.style.opacity = '0';
    } else {
        frequency = frequencySlider.value;
        tone = audioContext.createOscillator();
        tone.type = waveType;
        tone.frequency.setValueAtTime(frequency, audioContext.currentTime);
        tone.connect(gainNode);
        tone.start();
        document.getElementById('pitch-value').textContent = frequency + " Hz";
        document.getElementById('play-button').textContent = "Stop";
        playingIcon.style.opacity = '1';
        getNote();
    };
};

const updateWaveType = () => {
    if (tone !== null) {
        tone.type = waveType;
    };
};

const getNote = () => {
    let closestNote = null;
    let closestPercentageDifference = 100;

    for (const note in notes) {
        const noteFrequency = notes[note];
        const percentageDifference = Math.abs(frequency - noteFrequency) / noteFrequency;

        if (percentageDifference < closestPercentageDifference) {
            closestNote = note;
            closestPercentageDifference = percentageDifference;
        }
    }
    return closestNote;
};

const updateValues = () => {
    document.getElementById('pitch-value').textContent = Math.round(frequency) + " Hz";
    document.getElementById('note').textContent = getNote(frequency);
    document.getElementById('volume-value').textContent = Math.round(volume * 100) + "%";
};

const incrementNote = () => {
    const currentFrequency = frequency;
    let nextFrequency = Infinity;

    for (const note in notes) {
        const noteFrequency = notes[note];
        if (noteFrequency > currentFrequency && noteFrequency < nextFrequency) {
            nextFrequency = noteFrequency;
            frequency = nextFrequency
            frequencySlider.value = frequency;
            if (tone !== null) {
                tone.frequency.linearRampToValueAtTime(frequency, audioContext.currentTime + 0.1);
            }
            updateValues();
        };
    };
};

const decrementNote = () => {
    const currentFrequency = frequency;
    let prevFrequency = 0;

    for (const note in notes) {
        const noteFrequency = notes[note];
        if (noteFrequency < currentFrequency && noteFrequency >= prevFrequency) {
            prevFrequency = noteFrequency;
        }
    }
    frequency = prevFrequency;
    frequencySlider.value = frequency;
    if (tone !== null) {
        tone.frequency.linearRampToValueAtTime(frequency, audioContext.currentTime);
    }
    updateValues();
};

const holdIncrement = () => {
    if (holding) {
        incrementNote();
        setTimeout(() => {
            requestAnimationFrame(holdIncrement);
          }, 100);
    };
};

const holdDecrement = () => {
    if (holding) {
        decrementNote();
        setTimeout(() => {
            requestAnimationFrame(holdDecrement);
          }, 100);
    };
};

const holdIncrementTimer = () => {
    holding = true;
    setTimeout(holdIncrement, 0);
};

const holdDecrementTimer = () => {
    holding = true;
    setTimeout(holdDecrement, 0);
};

const clearHoldTimer = () => {
    holding = false;
};

const frequencySlider = document.getElementById('frequency-slider');
const volumeSlider = document.getElementById('volume-slider');
const playButton = document.getElementById('play-button');
const waveButtons = document.querySelectorAll('.wave-button');
const noteButtons = document.getElementById('note-buttons');
const toggleNotesButton = document.getElementById('toggle-notes-button');
const waveTypesButton = document.getElementById('wave-types-button');
const noteButtonContainer = document.getElementById('note-buttons');
const waveButtonContainer = document.getElementById('wave-types');
const playingIcon = document.getElementById('playing-icon');
const pitchUpButton = document.getElementById('raise-pitch');
const pitchDownButton = document.getElementById('reduce-pitch');

let audioContext = new (window.AudioContext)();
let tone = null;
let frequency = frequencySlider.value;
let volume = volumeSlider.value;
let waveType = "sine";
let holding = false;

playingIcon.style.opacity = '0';
noteButtonContainer.style.opacity = '0';
noteButtonContainer.style.pointerEvents = 'none';
waveButtonContainer.style.opacity = '0';
waveButtonContainer.style.pointerEvents = 'none';

// Add defaults
updateValues();

// Event Listeners
pitchUpButton.addEventListener('mousedown', holdIncrementTimer);
pitchUpButton.addEventListener('mouseup', clearHoldTimer);
pitchDownButton.addEventListener('mousedown', holdDecrementTimer);
pitchDownButton.addEventListener('mouseup', clearHoldTimer);

playButton.addEventListener('click', playButtonHandler);
frequencySlider.addEventListener('input', () => {
    frequency = frequencySlider.value;
    if (tone !== null) {
        tone.frequency.linearRampToValueAtTime(frequency, audioContext.currentTime + 0.1);
    };
    
    updateValues();
    
});

let gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);
gainNode.gain.setTargetAtTime(volume, audioContext.currentTime, 0.01);

volumeSlider.addEventListener('input', () => {
    volume = volumeSlider.value;
    gainNode.gain.cancelScheduledValues(audioContext.currentTime);
    gainNode.gain.setTargetAtTime(volume, audioContext.currentTime, 0.01);

    updateValues();
});

waveButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        waveType = e.target.id;
        waveButtons.forEach(button => {
            button.classList.remove('dark');
        })
        button.classList.add('dark');

        updateWaveType();
    });
});

for (const note in notes) {
    let noteButton = document.createElement('button');
    noteButton.className = 'note-button';
    noteButton.innerHTML = "<div class='note-button-note'>" + note + "</div>" + "<br>" + "<div class='note-button-freq'>" + Math.round(notes[note]) + " Hz" + "</div>";
    noteButton.addEventListener('click', () => {
        frequency = notes[note];
        frequencySlider.value = frequency;
        if (tone !== null) {
            tone.frequency.linearRampToValueAtTime(frequency, audioContext.currentTime + 0.1);
        };

        updateValues();
    });
    noteButtons.appendChild(noteButton);
};

noteButtonContainer.style.marginBottom = '0px'
toggleNotesButton.addEventListener('click', () => {
    if (noteButtonContainer.style.opacity === '0') {
        noteButtonContainer.style.opacity = '1';
        noteButtonContainer.style.pointerEvents = 'auto';
        noteButtonContainer.style.marginBottom = '50px';
    } else {
        noteButtonContainer.style.opacity = '0';
        noteButtonContainer.style.pointerEvents = 'none';
        noteButtonContainer.style.marginBottom = '0px';
    };
});


waveTypesButton.addEventListener('click', () => {
    if (waveButtonContainer.style.opacity === '0') {
        waveButtonContainer.style.opacity = '1';
        waveButtonContainer.style.pointerEvents = 'auto';
    } else {
        waveButtonContainer.style.opacity = '0';
        waveButtonContainer.style.pointerEvents = 'none';
    };
});