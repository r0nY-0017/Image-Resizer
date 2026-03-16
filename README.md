# 🖼️ Image Resizer

A lightweight, fast image resizing tool built with **FastAPI** and deployed on **Vercel**. Upload any image, set your desired dimensions, and download the resized version instantly — no sign-up, no watermark, completely free.

🔗 **Live Demo:** [https://image-resizer-lovat.vercel.app](https://image-resizer-lovat.vercel.app)

---

## ✨ Features

- 📤 **Drag & Drop Upload** — Simply drag your image or click to browse
- 📐 **Custom Dimensions** — Set width and height independently in pixels
- 👁️ **Live Preview** — See the original image before resizing
- 📥 **Instant Download** — Get your resized image with one click
- 🗑️ **Clear & Reset** — Start fresh anytime
- ⚡ **Fast Processing** — Powered by FastAPI backend
- ☁️ **No Installation Needed** — Fully browser-based, deployed on Vercel

---

## 🖼️ Supported Formats

| Format | Upload | Download |
|--------|--------|----------|
| PNG | ✅ | ✅ |
| JPG / JPEG | ✅ | ✅ |
| WEBP | ✅ | ✅ |

> **Max file size:** 10MB

---

## 🚀 How to Use

1. **Go to** [https://image-resizer-lovat.vercel.app](https://image-resizer-lovat.vercel.app)
2. **Upload** your image by clicking the upload area or dragging & dropping
3. **Preview** the original image
4. **Enter** your desired **Width** and **Height** in pixels
5. **Click** `🔄 Resize Image`
6. **Download** the resized image using the `⬇️ Download` button

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/) (Python) |
| **Image Processing** | [Pillow (PIL)](https://pillow.readthedocs.io/) |
| **Frontend** | HTML, CSS, JavaScript |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
image-resizer/
├── api/
│   └── index.py          # FastAPI app — resize endpoint
├── static/
│   ├── index.html        # Frontend UI
│   ├── style.css         # Styling
│   └── script.js         # Upload, preview & download logic
├── requirements.txt      # Python dependencies
├── vercel.json           # Vercel deployment config
└── README.md
```

---

## ⚙️ Local Development

### Prerequisites
- Python 3.9+
- pip

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/image-resizer.git
cd image-resizer

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the FastAPI server
uvicorn api.index:app --reload

# 5. Open in browser
# http://localhost:8000
```

---

## 📦 Dependencies

```txt
fastapi
uvicorn
pillow
python-multipart
```

---

## 🌐 Deployment on Vercel

This project is configured for **serverless deployment** on Vercel.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**`vercel.json` config:**
```json
{
  "builds": [
    { "src": "api/index.py", "use": "@vercel/python" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "api/index.py" }
  ]
}
```

---

## 🔌 API Reference

### `POST /resize`

Resize an uploaded image to the specified dimensions.

**Request** — `multipart/form-data`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | ✅ | Image file (PNG, JPG, WEBP) |
| `width` | int | ✅ | Target width in pixels |
| `height` | int | ✅ | Target height in pixels |

**Response** — Returns the resized image file as a direct download.

**Example using curl:**
```bash
curl -X POST "https://image-resizer-lovat.vercel.app/resize" \
  -F "file=@photo.jpg" \
  -F "width=800" \
  -F "height=600" \
  --output resized.jpg
```

**Example using Python:**
```python
import requests

with open("photo.jpg", "rb") as f:
    response = requests.post(
        "https://image-resizer-lovat.vercel.app/resize",
        files={"file": f},
        data={"width": 800, "height": 600}
    )

with open("resized.jpg", "wb") as out:
    out.write(response.content)
```

---

## 📸 Screenshots

> Upload your image → Set dimensions → Download instantly

| Step | Description |
|------|-------------|
| 1️⃣ | Drag & drop or click to upload (PNG, JPG, WEBP · Max 10MB) |
| 2️⃣ | Original dimensions shown automatically |
| 3️⃣ | Enter new width & height in pixels |
| 4️⃣ | Click Resize → Download the result |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

<p align="center">
  Built with ❤️ using <a href="https://fastapi.tiangolo.com">FastAPI</a> • Deployed on <a href="https://vercel.com">Vercel</a>
</p>
