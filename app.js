/* ==========================================================================
   APP ENGINE - REDESAIN PREMIUM & USER FRIENDLY (instalulang.id)
   ========================================================================== */

// 1. MOBILE RESPONSIVE NAVIGATION DRAWER
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mainNav = document.getElementById('nav-menu');

if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('open');
        
        // Animated hamburger button states
        const bars = mobileMenuBtn.querySelectorAll('.bar');
        if (mobileMenuBtn.classList.contains('open')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when clicking navigation link
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('open');
            const bars = mobileMenuBtn.querySelectorAll('.bar');
            bars.forEach(bar => bar.style.transform = 'none');
            bars[1].style.opacity = '1';
        });
    });
}

// 2. INTERACTIVE STEP-BY-STEP WIZARD FORM (Langkah 1-2-3)
let currentStep = 1;

function goToStep(stepNumber) {
    // Basic validation before transitioning
    if (stepNumber === 2 && currentStep === 1) {
        const sectorSelected = document.querySelector('input[name="sector"]:checked');
        if (!sectorSelected) {
            alert('Mohon pilih sektor operasional Anda terlebih dahulu.');
            return;
        }
    }
    
    if (stepNumber === 3 && currentStep === 2) {
        const checkedServices = document.querySelectorAll('input[name="services"]:checked');
        if (checkedServices.length === 0) {
            alert('Mohon pilih minimal satu kendala atau jenis layanan.');
            return;
        }
    }

    // Hide all steps
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });

    // Show selected step
    document.getElementById(`step-${stepNumber}-content`).classList.add('active');
    currentStep = stepNumber;

    // Update Indicator dots and lines
    updateStepIndicators(stepNumber);
}

function updateStepIndicators(step) {
    const dot1 = document.getElementById('dot-1');
    const dot2 = document.getElementById('dot-2');
    const dot3 = document.getElementById('dot-3');
    const line1 = document.getElementById('line-1');
    const line2 = document.getElementById('line-2');

    // Reset all
    dot1.className = 'step-dot';
    dot2.className = 'step-dot';
    dot3.className = 'step-dot';
    line1.className = 'step-line';
    line2.className = 'step-line';

    if (step === 1) {
        dot1.classList.add('active');
    } else if (step === 2) {
        dot1.classList.add('completed');
        line1.classList.add('completed');
        dot2.classList.add('active');
    } else if (step === 3) {
        dot1.classList.add('completed');
        line1.classList.add('completed');
        dot2.classList.add('completed');
        line2.classList.add('completed');
        dot3.classList.add('active');
    }
}

// 3. WHATSAPP DRAFT REDIRECTION GENERATOR
function submitForm(event) {
    event.preventDefault();

    // Collect Step 1 Data
    const sectorElement = document.querySelector('input[name="sector"]:checked');
    const sectorValue = sectorElement ? sectorElement.value : 'Tidak Diketahui';

    // Collect Step 2 Data
    const serviceElements = document.querySelectorAll('input[name="services"]:checked');
    let selectedServices = [];
    serviceElements.forEach(el => {
        selectedServices.push(el.value);
    });
    
    // Collect Step 3 Data
    const clientName = document.getElementById('client-name').value.trim();
    const companyName = document.getElementById('company-name').value.trim();
    const clientNotes = document.getElementById('client-notes').value.trim();

    if (!clientName || !companyName) {
        alert('Mohon lengkapi nama Anda dan nama perusahaan/instansi.');
        return;
    }

    // Format list of services
    const servicesList = selectedServices.map(service => `- ${service}`).join('\n');

    // Build WhatsApp message text (Polite & Professional Indonesian)
    const waMessage = 
`Halo Admin instalulang.id,

Saya ingin berkonsultasi mengenai layanan IT Support. Berikut rincian data kami:

*Nama:* ${clientName}
*Perusahaan / Instansi:* ${companyName}
*Sektor Operasional:* ${sectorValue}

*Kebutuhan Layanan:*
${servicesList}

*Detail Masalah / Catatan Tambahan:*
${clientNotes ? clientNotes : 'Tidak ada catatan tambahan.'}

Mohon info ketersediaan waktu dan penanganan teknis untuk kebutuhan kami tersebut. Terima kasih.`;

    const encodedMessage = encodeURIComponent(waMessage);
    const waNumber = "6281804558828"; // Owner WhatsApp number
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;

    // Redirect user to WhatsApp
    window.location.href = waUrl;
}
