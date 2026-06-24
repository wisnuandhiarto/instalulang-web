/* ==========================================================================
   TACTICAL CONSOLE ENGINE (instalulang.id)
   ========================================================================== */

// Global Audio Engine (Web Audio API)
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Synth Sound Synthesizer
function playSynthSound(freq, duration, type = 'sine', volume = 0.1) {
    if (!soundEnabled) return;
    try {
        initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        // Smooth fade out to prevent clicks
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn("Audio Context blocked or unsupported:", e);
    }
}

// Predefined UI Sounds
const soundChirp = () => playSynthSound(880, 0.1, 'sine', 0.08);
const soundClick = () => playSynthSound(600, 0.08, 'triangle', 0.12);
const soundTick = () => playSynthSound(1200, 0.03, 'sine', 0.05);
const soundDataLock = () => {
    playSynthSound(950, 0.08, 'square', 0.06);
    setTimeout(() => playSynthSound(1300, 0.12, 'square', 0.06), 70);
};
const soundError = () => {
    playSynthSound(150, 0.15, 'sawtooth', 0.2);
    setTimeout(() => playSynthSound(150, 0.2, 'sawtooth', 0.2), 100);
};
const soundSuccess = () => {
    const tones = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    tones.forEach((tone, idx) => {
        setTimeout(() => playSynthSound(tone, 0.15, 'sine', 0.08), idx * 80);
    });
};

// Play Siren Alarm Loop (Dynamic)
let alarmInterval = null;
function startAlarmSiren() {
    if (!soundEnabled) return;
    initAudio();
    let toggle = true;
    alarmInterval = setInterval(() => {
        const freq = toggle ? 300 : 450;
        playSynthSound(freq, 0.35, 'sawtooth', 0.1);
        toggle = !toggle;
    }, 400);
}

function stopAlarmSiren() {
    if (alarmInterval) {
        clearInterval(alarmInterval);
        alarmInterval = null;
    }
}

// Sound Control UI Toggle
const audioToggleBtn = document.getElementById('audio-toggle');
audioToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        audioToggleBtn.innerHTML = '<span class="audio-icon">🔊</span> SOUND: ON';
        audioToggleBtn.style.borderColor = 'var(--accent-color)';
        soundChirp();
    } else {
        audioToggleBtn.innerHTML = '<span class="audio-icon">🔇</span> SOUND: OFF';
        audioToggleBtn.style.borderColor = 'rgba(255,255,255,0.1)';
        stopAlarmSiren();
    }
});

/* ==========================================================================
   MOCK ENTRY SECURITY SCANNER
   ========================================================================== */
const scannerLogs = [
    { text: "> Initializing network handshake...", delay: 200 },
    { text: "> Handshake OK. Accessing remote diagnostics...", delay: 500 },
    { text: "> Fetching client environment details...", delay: 800 },
    { text: "> TARGET SYSTEM CAPTURED.", delay: 1100 },
    { text: "> ANALYZING LOCAL IT ENVIRONMENT LAN CONSOLE...", delay: 1500 },
    { text: "> WARNING: Server loop and proyektor inconsistency detected.", delay: 2000 },
    { text: "> SECURE BRIDGE ESTABLISHED. GUEST PROTOCOL ACTIVE.", delay: 2400 },
    { text: "> READY FOR TACTICAL ACTION SUBMISSION.", delay: 2800 }
];

window.addEventListener('DOMContentLoaded', () => {
    // Generate Fake System Data
    const mockIP = `${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;
    document.getElementById('scan-ip').innerText = mockIP;
    
    const platforms = ['WINDOWS_11_CORE', 'MACOS_X_DARWIN', 'LINUX_KERNEL_x64'];
    document.getElementById('scan-browser').innerText = platforms[Math.floor(Math.random() * platforms.length)];
    
    document.getElementById('scan-port').innerText = `PORT_${Math.floor(Math.random() * 8999) + 1000}`;
    
    const logsBox = document.getElementById('scanner-log-box');
    
    // Animate Logs print
    scannerLogs.forEach((log) => {
        setTimeout(() => {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerText = log.text;
            logsBox.appendChild(entry);
            logsBox.scrollTop = logsBox.scrollHeight;
            soundTick();
            
            // If it is the last log, show enter button
            if (log === scannerLogs[scannerLogs.length - 1]) {
                document.getElementById('enter-btn').classList.remove('hidden');
                soundChirp();
            }
        }, log.delay);
    });
});

// Trigger transition from scanner screen to console screen
function enterConsole() {
    initAudio();
    soundSuccess();
    
    const scanner = document.getElementById('scanner-screen');
    const warRoom = document.getElementById('war-room');
    
    scanner.style.transition = 'opacity 0.6s ease';
    scanner.style.opacity = '0';
    
    setTimeout(() => {
        scanner.classList.add('hidden');
        warRoom.classList.remove('hidden');
        
        // Start System Live Clock
        setInterval(updateClock, 1000);
        updateClock();
    }, 600);
}

/* ==========================================================================
   LIVE CONSOLE CLOCK
   ========================================================================== */
function updateClock() {
    const clockEl = document.getElementById('live-clock');
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockEl.innerText = `${hrs}:${mins}:${secs}`;
}

/* ==========================================================================
   DEFCON LEVEL SELECTOR ENGINE
   ========================================================================== */
const defconCards = document.querySelectorAll('.defcon-card');
const threatIndicatorText = document.getElementById('current-threat-level');

defconCards.forEach(card => {
    card.addEventListener('click', () => {
        const selectedDefcon = card.getAttribute('data-defcon');
        
        // Remove active class from all cards
        defconCards.forEach(c => c.classList.remove('active'));
        // Add to clicked
        card.classList.add('active');
        
        // Update body class
        document.body.className = `theme-defcon${selectedDefcon}`;
        
        // Sound and Text updates
        if (selectedDefcon === '5') {
            soundChirp();
            threatIndicatorText.innerText = "DEFCON 5 // SYSTEM STABLE";
        } else if (selectedDefcon === '3') {
            playSynthSound(500, 0.15, 'triangle', 0.15);
            setTimeout(() => playSynthSound(500, 0.15, 'triangle', 0.15), 150);
            threatIndicatorText.innerText = "DEFCON 3 // SYSTEM INTERRUPTED";
        } else if (selectedDefcon === '1') {
            playSynthSound(900, 0.25, 'sawtooth', 0.2);
            setTimeout(() => playSynthSound(900, 0.25, 'sawtooth', 0.2), 150);
            threatIndicatorText.innerText = "DEFCON 1 // SYSTEM MELTDOWN DECLARED";
        }
        
        // Reset blueprint readout when DEFCON changes to prevent stale data
        resetReadout();
    });
});

/* ==========================================================================
   INTERACTIVE BLUEPRINT MAP & SECTOR TAB SWITCH
   ========================================================================== */
const sectorTabs = document.querySelectorAll('.sector-tab');
const blueprints = document.querySelectorAll('.sector-blueprint');
let currentSectorName = "KANTOR";

sectorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const sector = tab.getAttribute('data-sector');
        currentSectorName = tab.innerText;
        
        // Update active tab
        sectorTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active blueprint SVG container
        blueprints.forEach(bp => bp.classList.remove('active'));
        document.getElementById(`blueprint-${sector}`).classList.add('active');
        
        soundClick();
        resetReadout();
    });
});

// Reset Map Readout Info
function resetReadout() {
    document.getElementById('hotspot-title').innerText = "KLIK TANDA RADAR UNTUK MENDETEKSI KRISIS";
    document.getElementById('hotspot-desc').innerText = `Silakan pilih area pada blueprint ${currentSectorName} di atas, kemudian klik titik radar berkedip untuk memuat keluhan langsung ke panel formulir kanan.`;
}

// Hotspot Interaction Link-on
const hotspots = document.querySelectorAll('.hotspot');
const formCrisisLog = document.getElementById('crisis-log');

hotspots.forEach(spot => {
    spot.addEventListener('click', () => {
        const title = spot.getAttribute('data-title');
        const desc = spot.getAttribute('data-desc');
        
        // Update Readout Box UI
        document.getElementById('hotspot-title').innerText = `[LOCATED] ${title}`;
        document.getElementById('hotspot-desc').innerText = desc;
        
        // Auto Populate Form TextArea
        const activeDefconNum = document.querySelector('.defcon-card.active').getAttribute('data-defcon');
        formCrisisLog.value = `SEKTOR: ${currentSectorName}\nTITIK KRISIS: ${title}\nINFORMASI: ${desc}\nRESPON DIBUTUHKAN: DEFCON ${activeDefconNum}`;
        
        soundDataLock();
    });
});

/* ==========================================================================
   MISSION DISPATCH ENGINE (WhatsApp Integration)
   ========================================================================== */
function handleDispatch(event) {
    event.preventDefault();
    
    // Get fields
    const commanderName = document.getElementById('commander-name').value.trim();
    const sectorName = document.getElementById('sector-name').value.trim();
    const secureLine = document.getElementById('secure-line').value.trim();
    const crisisLog = document.getElementById('crisis-log').value.trim();
    const activeDefcon = document.querySelector('.defcon-card.active').getAttribute('data-defcon');
    
    if (!commanderName || !sectorName || !secureLine || !crisisLog) {
        soundError();
        return;
    }
    
    // Start Alarm Sequence Screen
    const overlay = document.getElementById('launch-overlay');
    overlay.classList.remove('hidden');
    startAlarmSiren();
    
    const launchProgress = document.getElementById('launch-progress');
    const launchLogsBox = document.getElementById('launch-logs');
    const countdownNum = document.getElementById('countdown-num');
    
    // Dispatch logs sequence steps
    const dispatchSteps = [
        { text: "> ENCRYPTING EMERGENCY DATA FIELD...", delay: 200, pct: 15 },
        { text: `> COORDINATING WITH SECTOR: ${sectorName.toUpperCase()}`, delay: 700, pct: 40 },
        { text: `> SECURITY CLEARANCE LEVEL: DEFCON ${activeDefcon}`, delay: 1200, pct: 60 },
        { text: "> LOCKING SECURE WHATSAPP DISPATCH TUNNEL...", delay: 1800, pct: 85 },
        { text: "> TRANSMITTING LAUNCH SEQUENCE CODES...", delay: 2400, pct: 100 }
    ];
    
    // Animate dispatch progress & loading logs
    dispatchSteps.forEach(step => {
        setTimeout(() => {
            const logLine = document.createElement('div');
            logLine.innerText = step.text;
            launchLogsBox.appendChild(logLine);
            launchLogsBox.scrollTop = launchLogsBox.scrollHeight;
            launchProgress.style.width = `${step.pct}%`;
            soundTick();
        }, step.delay);
    });
    
    // Countdown counter
    let count = 3;
    const countdownInterval = setInterval(() => {
        count--;
        if (count >= 0) {
            countdownNum.innerText = count === 0 ? "DISPATCHED" : count;
            if (count > 0) soundChirp();
        }
    }, 1000);
    
    // Final WhatsApp Trigger
    setTimeout(() => {
        clearInterval(countdownInterval);
        stopAlarmSiren();
        soundSuccess();
        
        // Build Emergency Message Payload for WhatsApp
        const waNumber = "6281804558828"; // instalulang.id WhatsApp Number
        
        // DEFCON Status emojis
        let defconStatus = "STABLE";
        let defconEmoji = "🟢";
        if (activeDefcon === '3') {
            defconStatus = "WARNING ALERT";
            defconEmoji = "🟡";
        } else if (activeDefcon === '1') {
            defconStatus = "CRITICAL MELTDOWN";
            defconEmoji = "🔴";
        }
        
        const messageText = 
`🚨 *LAPORAN TINGKAT DARURAT: DEFCON ${activeDefcon} (${defconStatus})* ${defconEmoji}
------------------------------------------------
*Komandan Pengirim:* ${commanderName}
*Sektor Instansi:* ${sectorName}
*Kontak Secure:* ${secureLine}

*LOG TARGET KRISIS:*
${crisisLog}
------------------------------------------------
*Sinyal krisis diluncurkan dari konsol Taktis.*
Mohon tanggapan Unit Lapangan instalulang.id segera!`;

        const encodedMessage = encodeURIComponent(messageText);
        const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
        
        // Redirect client to WhatsApp API
        setTimeout(() => {
            window.location.href = waUrl;
            overlay.classList.add('hidden');
        }, 1000);
        
    }, 3200);
}
