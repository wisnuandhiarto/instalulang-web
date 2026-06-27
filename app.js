/* ==========================================================================
   APP ENGINE - COMPANY PROFILE (instalulang.id)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DYNAMIC UTM/LINKTREE SOURCE TRACKER FOR WHATSAPP
    // Automatically detects if the visitor clicked from Linktree or another referrer,
    // and tailors the pre-filled WhatsApp message dynamically.
    const waButtons = document.querySelectorAll('a[href^="https://wa.me/"]');
    
    waButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const waNumber = "6281804558828";
            
            // Check UTM source or referrer
            const urlParams = new URLSearchParams(window.location.search);
            const utmSource = urlParams.get('utm_source');
            const isLinktree = utmSource === 'linktree' || document.referrer.includes('linktr.ee');
            
            let messageText = "";
            
            if (isLinktree) {
                messageText = 
`Halo Admin instalulang.id, 

Saya berkunjung dari *Linktree* dan ingin bertanya mengenai layanan IT Support & perbaikan sistem di instansi kami. 

Mohon informasi lebih lanjut. Terima kasih!`;
            } else {
                messageText = 
`Halo Admin instalulang.id, 

Saya melihat brosur layanan IT Support Anda dan ingin berkonsultasi mengenai perawatan komputer/jaringan di instansi kami.

Mohon informasi lebih lanjut. Terima kasih!`;
            }
            
            const encodedText = encodeURIComponent(messageText);
            const customWaUrl = `https://wa.me/${waNumber}?text=${encodedText}`;
            
            // Open in new tab securely
            window.open(customWaUrl, '_blank', 'noopener,noreferrer');
        });
    });

    // 2. SMOOTH SCROLL ACCESSIBILITY FOR NAVIGATION LINKS
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 90; // Align neatly under the header height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
