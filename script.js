// Subscribe form handling: Dual background delivery with keepalive
// Ensures both Audienceful (real browser headers) and Google Sheets receive submissions,
// surviving tab closures and avoiding bot-protection blocks.

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz9frOXe9ti6w7Z4ZFyLrFzt1_PS4-lFBkbcAJjiQslEhjfIlQRD9HQM5b1J4ByXfvi/exec';
const AUDIENCEFUL_URL = 'https://app.audienceful.com/api/subscribe/MmBamKh8nFJVSJZuQrNPMi/';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.subscribe-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            const btn = form.querySelector('button');
            const originalBtnText = btn.innerHTML;

            btn.innerHTML = 'Subscribing...';
            btn.disabled = true;

            try {
                // 1. Google Sheets request (with keepalive to survive immediate tab close)
                const googleUrl = `${GOOGLE_SCRIPT_URL}?email=${encodeURIComponent(email)}`;
                const googlePromise = fetch(googleUrl, {
                    method: 'GET',
                    mode: 'no-cors',
                    keepalive: true
                }).catch(err => {
                    console.error('Google Sheet Error:', err);
                });

                // 2. Audienceful request (direct from browser to pass anti-bot checks)
                const formData = new FormData();
                formData.append('email', email);

                const audiencefulPromise = fetch(AUDIENCEFUL_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    keepalive: true,
                    body: formData
                }).catch(err => {
                    console.error('Audienceful Error:', err);
                });

                // Await both dispatches
                await Promise.all([googlePromise, audiencefulPromise]);

                // Update UI to success state
                form.style.display = 'none';
                const successMsg = document.querySelector('.subscribe-success');
                if (successMsg) {
                    successMsg.style.display = 'block';
                } else {
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
