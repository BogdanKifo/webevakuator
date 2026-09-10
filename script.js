document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('evakuatorForm');
    const statusDiv = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Запобігаємо перезавантаженню сторінки

            statusDiv.style.color = '#000';
            statusDiv.textContent = 'Надсилання заявки...';

            const name = document.getElementById('userName').value;
            const phone = document.getElementById('userPhone').value;
            const location = document.getElementById('userLocation').value;

            try {
                const response = await fetch('/send-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, phone, location })
                });

                if (response.ok) {
                    statusDiv.style.color = 'green';
                    statusDiv.textContent = '✅ Дякуємо! Заявку прийнято. Ми зателефонуємо вам через 1-2 хвилини.';
                    form.reset();
                } else {
                    statusDiv.style.color = 'red';
                    statusDiv.textContent = '❌ Помилка надсилання. Будь ласка, зателефонуйте нам прямо зараз!';
                }
            } catch (error) {
                console.error(error);
                statusDiv.style.color = 'red';
                statusDiv.textContent = '❌ Мережева помилка. Зателефонуйте нам за номером на сайті.';
            }
        });
    }
});