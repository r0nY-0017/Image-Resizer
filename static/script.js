(function() {
  // DOM Elements
  const fileInput = document.getElementById('fileInput');
  const uploadTrigger = document.getElementById('uploadTrigger');
  const widthInput = document.getElementById('widthInput');
  const heightInput = document.getElementById('heightInput');
  const resizeBtn = document.getElementById('resizeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const statusBadge = document.getElementById('statusBadge');
  const placeholder = document.getElementById('placeholder');
  const previewImage = document.getElementById('previewImage');
  const downloadSection = document.getElementById('downloadSection');
  const downloadBtn = document.getElementById('downloadBtn');
  const downloadInfo = document.getElementById('downloadInfo');
  const tempMessage = document.getElementById('tempMessage');
  const originalWidth = document.getElementById('originalWidth');
  const originalHeight = document.getElementById('originalHeight');

  let currentFile = null;
  let originalImgWidth = 0;
  let originalImgHeight = 0;

  // Get image dimensions from file
  function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  // Show image in preview
  function showImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.style.display = 'block';
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  // Update UI after file upload
  async function handleFileUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return false;
    }

    try {
      // Get original dimensions
      const dimensions = await getImageDimensions(file);
      originalImgWidth = dimensions.width;
      originalImgHeight = dimensions.height;
      
      // Update original size badges
      originalWidth.textContent = `original: ${originalImgWidth}px`;
      originalHeight.textContent = `original: ${originalImgHeight}px`;
      
      // Set input values to original dimensions
      widthInput.value = originalImgWidth;
      heightInput.value = originalImgHeight;

      // Show preview
      showImagePreview(file);
      
      // Update badge
      statusBadge.textContent = 'image loaded';
      statusBadge.className = 'badge success';
      
      // Enable resize button
      resizeBtn.disabled = false;
      
      // Hide download section (new image, so old resized result hidden)
      downloadSection.classList.add('hidden');
      
      currentFile = file;
      return true;
      
    } catch (error) {
      console.error('Error loading image:', error);
      alert('Error loading image. Please try again.');
      return false;
    }
  }

  // Reset all
  function resetAll() {
    currentFile = null;
    originalImgWidth = 0;
    originalImgHeight = 0;
    fileInput.value = '';
    
    previewImage.style.display = 'none';
    placeholder.style.display = 'block';
    
    downloadSection.classList.add('hidden');
    
    statusBadge.textContent = 'no image';
    statusBadge.className = 'badge waiting';
    
    widthInput.value = '400';
    heightInput.value = '300';
    
    originalWidth.textContent = 'original: --';
    originalHeight.textContent = 'original: --';
    
    resizeBtn.disabled = true;
  }

  // Event Listeners
  uploadTrigger.addEventListener('click', () => fileInput.click());

  uploadTrigger.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadTrigger.style.background = 'rgba(37,99,235,0.1)';
  });

  uploadTrigger.addEventListener('dragleave', () => {
    uploadTrigger.style.background = '';
  });

  uploadTrigger.addEventListener('drop', async (e) => {
    e.preventDefault();
    uploadTrigger.style.background = '';
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      await handleFileUpload(file);
    }
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(file);
    } else {
      resetAll();
    }
  });

  // Clear button
  clearBtn.addEventListener('click', resetAll);

  // Resize button
  resizeBtn.addEventListener('click', async () => {
    if (!currentFile) {
      alert('Please select an image first');
      return;
    }

    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);

    if (!width || !height || width < 10 || height < 10) {
      alert('Please enter valid dimensions (minimum 10px)');
      return;
    }

    // Show loading state
    statusBadge.textContent = 'resizing...';
    statusBadge.className = 'badge waiting';
    resizeBtn.disabled = true;

    const formData = new FormData();
    formData.append('image', currentFile);
    formData.append('width', width);
    formData.append('height', height);

    try {
      const res = await fetch('/resize', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.error) {
        alert('Error: ' + data.error);
        statusBadge.textContent = 'error';
        statusBadge.className = 'badge waiting';
        resizeBtn.disabled = false;
        return;
      }

      // Show resized image in preview
      previewImage.src = data.preview_url;
      
      // Update download section
      downloadBtn.href = data.preview_url;
      downloadInfo.textContent = `Resized: ${width} × ${height}`;
      
      // Show message if any
      if (data.message) {
        tempMessage.textContent = '✓ ' + data.message;
      }
      
      downloadSection.classList.remove('hidden');
      
      // Update badge
      statusBadge.textContent = 'resized ready';
      statusBadge.className = 'badge success';
      resizeBtn.disabled = false;

    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
      statusBadge.textContent = 'error';
      statusBadge.className = 'badge waiting';
      resizeBtn.disabled = false;
    }
  });

  // Initialize
  resetAll();
})();