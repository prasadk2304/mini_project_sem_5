const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const camera = document.getElementById('camera');
const openCameraBtn = document.getElementById('openCamera');
const resultDiv = document.getElementById('result');
let selectedFile;

// Handle drag and drop
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('dragover');
    selectedFile = event.dataTransfer.files[0];
});

dropArea.addEventListener('click', () => {
    fileInput.click();
});

// Handle file selection
fileInput.addEventListener('change', (event) => {
    selectedFile = event.target.files[0];
});

// Handle camera opening
openCameraBtn.addEventListener('click', async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        camera.srcObject = stream;
        camera.style.display = 'block';

        camera.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            canvas.width = camera.videoWidth;
            canvas.height = camera.videoHeight;
            canvas.getContext('2d').drawImage(camera, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                selectedFile = new File([blob], 'camera.jpg', { type: 'image/jpeg' });
            });
            camera.style.display = 'none';
        });
    } else {
        alert('Camera not supported by your browser.');
    }
});

// Handle file upload and prediction
uploadBtn.addEventListener('click', async () => {
    if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://127.0.0.1:8000/product', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <p>Prediction result: <strong>${result.class}</strong></p>
                    <p>Confidence: <strong>${result.confidence}</strong></p>
                `;
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    } else {
        alert('Please select or capture an image first.');
    }
});
