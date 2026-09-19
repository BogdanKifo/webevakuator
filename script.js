// ==========================================
// 1. ФУНКЦІЯ ВИЗНАЧЕННЯ ГЕОЛОКАЦІЇ (GPS)
// ==========================================
function getLocation() {
    const status = document.getElementById('geoStatus');
    const locationInput = document.getElementById('location');

    if (!navigator.geolocation) {
        if (status) {
            status.style.color = 'red';
            status.textContent = 'Геолокація не підтримується вашим браузером';
        }
        return;
    }

    if (status) {
        status.style.color = '#0d6efd';
        status.textContent = '⏳ Визначення геолокації... Зачекайте';
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Формуємо пряме посилання на точну точку в Google Maps
            const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;

            if (locationInput) {
                locationInput.value = mapUrl;
            }
            if (status) {
                status.style.color = 'green';
                status.textContent = '✅ Геолокацію успішно визначено!';
            }
        },
        (error) => {
            if (status) {
                status.style.color = 'red';
                status.textContent = '❌ Не вдалося отримати геолокацію. Введіть адресу вручну.';
            }
            console.error('Помилка геолокації:', error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// ==========================================
// 2. ОБРОБКА ВІДПРАВКИ ФОРМИ ЗАЯВКИ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        // Зупиняємо стандартну відправку форми та закриття вікна
        e.preventDefault();

        // Отримуємо або створюємо блок для статусу відправки
        let statusText = document.getElementById('formStatus');
        if (!statusText) {
            statusText = document.createElement('div');
            statusText.id = 'formStatus';
            statusText.style.marginTop = '15px';
            statusText.style.textAlign = 'center';
            statusText.style.fontWeight = 'bold';
            form.appendChild(statusText);
        }

        statusText.style.color = '#555';
        statusText.textContent = '⏳ Надсилання заявки...';

        // Збираємо дані з полів HTML
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const locationInput = document.getElementById('location');

        const orderData = {
            name: nameInput ? nameInput.value.trim() : 'Не вказано',
            phone: phoneInput ? phoneInput.value.trim() : 'Не вказано',
            location: locationInput ? locationInput.value.trim() : 'Не вказано'
        };

        try {
            const response = await fetch('/send-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                statusText.style.color = 'green';
                statusText.textContent = '✅ Заявку успішно відправлено! Очікуйте на дзвінок.';

                // Очищаємо форму та геолокаційний статус
                form.reset();
                const geoStatus = document.getElementById('geoStatus');
                if (geoStatus) geoStatus.textContent = '';

                // Автоматично закриваємо модальне вікно через 2 секунди
                setTimeout(() => {
                    const modalElement = document.querySelector('.modal.show');
                    if (modalElement && typeof bootstrap !== 'undefined') {
                        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                        if (modalInstance) modalInstance.hide();
                    }
                    statusText.textContent = '';
                }, 2000);

            } else {
                statusText.style.color = 'red';
                statusText.textContent = '❌ Помилка: ' + (result.message || 'Спробуйте пізніше');
            }
        } catch (error) {
            statusText.style.color = 'red';
            statusText.textContent = '❌ Помилка зєднання з сервером. Перевірте інтернет.';
            console.error('Помилка відправки:', error);
        }
    });
});