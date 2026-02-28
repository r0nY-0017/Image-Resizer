from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image
import io
import base64
import os

app = FastAPI(title="Image Resizer")

# Static files mount
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def home():
    """Serve index.html from static folder"""
    try:
        with open("static/index.html", "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(content="<h1>Error: index.html not found in static folder</h1>")

@app.post("/resize")
async def resize_image(
    image: UploadFile = File(...),
    width: int = Form(...),
    height: int = Form(...)
):
    # Validate inputs
    if width <= 0 or height <= 0:
        return JSONResponse(
            status_code=400,
            content={"error": "Width and height must be greater than 0"}
        )

    if not image.content_type.startswith("image/"):
        return JSONResponse(
            status_code=400,
            content={"error": "Only image files are allowed"}
        )

    try:
        # Read uploaded image
        contents = await image.read()
        
        # Open image with PIL
        img = Image.open(io.BytesIO(contents))
        
        # Resize image
        resized_img = img.resize((width, height))
        
        # Save to bytes buffer
        img_bytes = io.BytesIO()
        
        # Determine format (preserve original or use JPEG)
        format = img.format if img.format else 'JPEG'
        
        # Save resized image to bytes
        resized_img.save(img_bytes, format=format)
        img_bytes.seek(0)
        
        # Convert to base64
        img_base64 = base64.b64encode(img_bytes.getvalue()).decode()
        
        # Create data URL
        mime_type = f"image/{format.lower()}"
        data_url = f"data:{mime_type};base64,{img_base64}"
        
        return {
            "preview_url": data_url,
            "message": "Image ready"
        }
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Image processing failed: {str(e)}"}
        )