from flask import Flask, render_template, request, jsonify, send_from_directory
import requests
import os

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')

BOT_TOKEN = "8237856709:AAHFaWtbajVK33ZsY15_9i3zmuqQTH6N-VI"
CHAT_ID = "840383602"

@app.route('/')
def home():
    # Скануємо папку photo і шукаємо файли, які починаються на 'gallery-'
    photo_dir = 'photo'
    gallery_images = []
    
    if os.path.exists(photo_dir):
        files = os.listdir(photo_dir)
        # Беремо всі фотографії, що містять 'gallery' у назві та мають розширення зображень
        gallery_images = [
            f for f in files 
            if f.lower().startswith('gallery') and f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))
        ]
        # Сортуємо за назвою, щоб порядок був логічним (gallery-1, gallery-2...)
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
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            return jsonify({"status": "success", "message": "Заявку відправлено!"}), 200
        else:
            return jsonify({"status": "error", "message": response.text}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Сервер запущено: http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
