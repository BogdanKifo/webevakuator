import os
import requests
from flask import Flask, jsonify, render_template, request, send_from_directory

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')

# Токен з правильною малою літерою 'w'
BOT_TOKEN = "8237856709:AAHFawtbajVK33ZsY15_9i3zmuqQTH6N-VI"
CHAT_ID = "840383602"

@app.route('/')
def home():
    photo_dir = 'photo'
    gallery_images = []
    
    if os.path.exists(photo_dir):
        files = os.listdir(photo_dir)
        gallery_images = [
            f for f in files 
            if f.lower().startswith('gallery') and f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))
        ]
        gallery_images.sort()

    return render_template('index.html', gallery_images=gallery_images)

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/send-order', methods=['POST'])
def send_order():
    data = request.json or {}
    name = data.get('name', 'Не вказано')
    phone = data.get('phone', 'Не вказано')
    location = data.get('location', 'Не вказано')

    text = (
        "🚨 НОВА ЗАЯВКА НА ЕВАКУАТОР! 🚨\n\n"
        f"👤 Ім'я: {name}\n"
        f"📞 Телефон: {phone}\n"
        f"📍 Локація: {location}\n"
    )

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": text
    }

    try:
        response = requests.post(url, json=payload, timeout=10)
        res_data = response.json()
        
        if response.status_code == 200 and res_data.get("ok"):
            return jsonify({"status": "success", "message": "Заявку відправлено!"}), 200
        else:
            # Друкуємо точну помилку від Telegram у логи Render
            print(f"❌ Telegram API Error: {response.status_code} - {response.text}")
            return jsonify({"status": "error", "message": res_data.get("description", "Помилка Telegram API")}), 400

    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
