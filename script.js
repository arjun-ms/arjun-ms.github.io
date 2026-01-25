// Basic Script for interactions

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio Loaded');

    // Subscribe Form Handling
    const form = document.querySelector('.subscribe-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value;
            const btn = form.querySelector('button');
            const originalBtnText = btn.innerHTML;

            // URLs
            
            // UI Loading State
            btn.innerHTML = 'Subscribing...';
            btn.disabled = true;

            try {
                // 1. Send to Google Sheets (Backup)
                // We use no-cors because Google Scripts don't return CORS headers for simple web apps usually
                // and we just want to fire-and-forget.
                // 1. Send to Google Sheets (Backup)
                // Using GET is the 'nuclear option' - most reliable for Google Scripts
                const googleUrl = `${GOOGLE_SCRIPT_URL}?email=${encodeURIComponent(email)}`;
                console.log('--- Submission Debug ---');
                console.log('Sending to Google:', googleUrl);

                const googlePromise = fetch(googleUrl, {
                    method: 'GET',
                    mode: 'no-cors'
                }).then(response => {
                    console.log('Google Sheet: Request sent successfully.');
                    console.log('Note: Opaque response (status 0) is expected and normal for Google Scripts.');
                    return response;
                }).catch(err => {
                    console.error('Google Sheet Error:', err);
                });

                // 2. Send to Audienceful
                // Audienceful likely expects standard form data
                const formData = new FormData();
                formData.append('email', email);

                const audiencefulPromise = fetch(AUDIENCEFUL_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Assuming we might hit CORS, standard form submission avoids it but fetch might need this
                    body: formData
                });

                // Wait for both (or just proceed, usually safe to assume success for UX if no network error)
                await Promise.all([googlePromise, audiencefulPromise]);

                // UI Success State
                form.style.display = 'none';
                const successMsg = document.querySelector('.subscribe-success');
                if (successMsg) {
                    successMsg.style.display = 'block';
                } else {
                    // Fallback if success message div is missing
                    const msg = document.createElement('div');
                    msg.innerHTML = '<i class="fa-solid fa-check"></i> Thanks for subscribing!';
                    msg.style.color = 'var(--accent-color)';
                    msg.style.marginTop = '1rem';
                    msg.style.fontWeight = '500';
                    form.parentNode.appendChild(msg);
                }

            } catch (error) {
                console.error('Subscription error:', error);
                btn.innerHTML = originalBtnText;
                btn.disabled = false;
                alert('Something went wrong. Please try again.');
            }
        });
    }
});
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz9frOXe9ti6w7Z4ZFyLrFzt1_PS4-lFBkbcAJjiQslEhjfIlQRD9HQM5b1J4ByXfvi/exec';
            const AUDIENCEFUL_URL = 'https://app.audienceful.com/api/subscribe/MmBamKh8nFJVSJZuQrNPMi/';
