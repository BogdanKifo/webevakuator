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


            function getLocation() {
    const status = document.getElementById('geoStatus');
    const locationInput = document.getElementById('location');

    if (!navigator.geolocation) {
        status.textContent = 'Геолокація не підтримується вашим браузером';
        return;
    }

    status.textContent = 'Визначення геолокації...';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Формируем ссылку на Google Maps
            const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
            
            // Записываем ссылку или координаты в поле ввода
            locationInput.value = mapUrl;
            status.textContent = '✅ Геолокацію успішно визначено!';
        },
        (error) => {
            status.textContent = '❌ Не вдалося отримати геолокацію. Введіть адресу вручну.';
            console.error(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

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
