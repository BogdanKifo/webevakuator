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
        if (status) status.textContent = 'Геолокація не підтримується';
        return;
    }

    if (status) status.textContent = 'Визначення геолокації...';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
            
            locationInput.value = mapUrl;
            if (status) status.textContent = '✅ Геолокацію визначено!';
        },
        (error) => {
            if (status) status.textContent = '❌ Помилка геолокації. Введіть адресу вручну.';
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// Отправка формы заявки
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm'); // Убедись, что id формы orderForm
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const statusText = document.getElementById('formStatus') || document.createElement('div');
        statusText.id = 'formStatus';
        statusText.style.marginTop = '10px';
        statusText.style.textAlign = 'center';
        statusText.style.fontWeight = 'bold';
        statusText.textContent = 'Надсилання заявки...';
        form.appendChild(statusText);

        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const locationInput = document.getElementById('location');

        const data = {
            name: nameInput ? nameInput.value : 'Не вказано',
            phone: phoneInput ? phoneInput.value : 'Не вказано',
            location: locationInput ? locationInput.value : 'Не вказано'
        };

        try {
            const response = await fetch('/send-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                statusText.style.color = 'green';
                statusText.textContent = '✅ Заявку успішно відправлено!';
                form.reset();
            } else {
                statusText.style.color = 'red';
                statusText.textContent = '❌ Помилка: ' + (result.message || 'Спробуйте пізніше');
            }
        } catch (error) {
            statusText.style.color = 'red';
            statusText.textContent = '❌ Помилка зєднання з сервером';
            console.error(error);
        }
    });
});
