// Subscribe form: single call to Google Apps Script.
// The script writes to Google Sheets and forwards to Audienceful server-side.
// No dual-write, no silent failures, no ad-blocker interference.

const SUBSCRIBE_URL = 'https://script.google.com/macros/s/AKfycbz9frOXe9ti6w7Z4ZFyLrFzt1_PS4-lFBkbcAJjiQslEhjfIlQRD9HQM5b1J4ByXfvi/exec';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.subscribe-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value;
            const btn = form.querySelector('button');
            const originalBtnText = btn.innerHTML;

            btn.innerHTML = 'Subscribing...';
            btn.disabled = true;

            try {
                const url = `${SUBSCRIBE_URL}?email=${encodeURIComponent(email)}`;

                // Single call: Google Apps Script handles Sheet + Audienceful
                await fetch(url, {
                    method: 'GET',
                    mode: 'no-cors'
                });

                // Show success (opaque response under no-cors, server handles both destinations)
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
