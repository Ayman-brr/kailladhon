// Initialize variables
let overlays = [];
let currentOverlay = null;
let videoFile = null;
let isDragging = false;
let offsetX, offsetY;

// DOM Elements
const videoPreview = document.getElementById('video-preview');
const previewContainer = document.querySelector('.preview-container');
const textContent = document.getElementById('text-content');
const fontSize = document.getElementById('font-size');
const textColor = document.getElementById('text-color');
const bgColor = document.getElementById('bg-color');
const textOpacity = document.getElementById('text-opacity');
const opacityValue = document.getElementById('opacity-value');
const colorPreview = document.getElementById('color-preview');
const bgPreview = document.getElementById('bg-preview');
const addTextBtn = document.getElementById('add-text-btn');
const uploadBtn = document.getElementById('upload-btn');
const processBtn = document.getElementById('process-btn');
const exportBtn = document.getElementById('export-btn');
const statusText = document.getElementById('status-text');
const progressBar = document.getElementById('progress-bar');
const outputContainer = document.getElementById('output-container');
const outputVideo = document.getElementById('output-video');
const downloadBtn = document.getElementById('download-btn');

// Initialize color previews and opacity
colorPreview.style.backgroundColor = textColor.value;
bgPreview.style.backgroundColor = bgColor.value;
opacityValue.textContent = `${textOpacity.value}%`;

// Event listeners for color changes
textColor.addEventListener('input', () => {
    colorPreview.style.backgroundColor = textColor.value;
    if (currentOverlay) {
        currentOverlay.style.color = textColor.value;
    }
});

bgColor.addEventListener('input', () => {
    bgPreview.style.backgroundColor = bgColor.value;
    if (currentOverlay) {
        updateOverlayBackground();
    }
});

// Event listener for opacity changes
textOpacity.addEventListener('input', () => {
    opacityValue.textContent = `${textOpacity.value}%`;
    if (currentOverlay) {
        updateOverlayBackground();
    }
});

// Update overlay background with opacity
function updateOverlayBackground() {
    if (!currentOverlay) return;
    
    const opacity = parseInt(textOpacity.value) / 100;
    const bgColorValue = bgColor.value;
    const r = parseInt(bgColorValue.slice(1, 3), 16);
    const g = parseInt(bgColorValue.slice(3, 5), 16);
    const b = parseInt(bgColorValue.slice(5, 7), 16);
    
    currentOverlay.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Add text overlay
addTextBtn.addEventListener('click', () => {
    const content = textContent.value.trim();
    if (!content) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'text-overlay';
    overlay.textContent = content;
    overlay.style.color = textColor.value;
    overlay.style.fontSize = `${fontSize.value}px`;
    updateOverlayBackground.call({overlay});
    
    // Center the overlay initially
    const containerRect = previewContainer.getBoundingClientRect();
    const overlayWidth = Math.min(300, containerRect.width - 40);
    overlay.style.width = `${overlayWidth}px`;
    overlay.style.left = `${(containerRect.width - overlayWidth) / 2}px`;
    overlay.style.top = `${containerRect.height * 0.2}px`;
    
    // Add event listeners for dragging and selection
    overlay.addEventListener('mousedown', startDrag);
    overlay.addEventListener('click', selectOverlay.bind(null, overlay));
    
    previewContainer.appendChild(overlay);
    overlays.push(overlay);
    selectOverlay(overlay);
});

// Select an overlay
function selectOverlay(overlay) {
    if (currentOverlay) {
        currentOverlay.classList.remove('selected');
    }
    currentOverlay = overlay;
    overlay.classList.add('selected');
    
    // Update controls to match selected overlay
    textContent.value = overlay.textContent;
    textColor.value = rgbToHex(overlay.style.color);
    colorPreview.style.backgroundColor = textColor.value;
    
    // Extract background color and opacity
    const bg = overlay.style.backgroundColor;
    if (bg) {
        const rgba = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (rgba) {
            const r = parseInt(rgba[1]);
            const g = parseInt(rgba[2]);
            const b = parseInt(rgba[3]);
            const a = rgba[4] ? parseFloat(rgba[4]) : 1;
            
            bgColor.value = rgbToHex(`rgb(${r}, ${g}, ${b})`);
            bgPreview.style.backgroundColor = bgColor.value;
            textOpacity.value = Math.round(a * 100);
            opacityValue.textContent = `${textOpacity.value}%`;
        }
    }
    
    // Update font size
    const size = parseInt(overlay.style.fontSize);
    if (size) {
        fontSize.value = size;
    }
}

// Convert RGB to hex
function rgbToHex(rgb) {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return '#000000';
    
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
}

// Drag functionality
function startDrag(e) {
    if (e.button !== 0) return; // Only left mouse button
    
    isDragging = true;
    const rect = this.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    this.style.zIndex = '10';
    
    selectOverlay(this);
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
    if (!isDragging || !currentOverlay) return;
    
    const containerRect = previewContainer.getBoundingClientRect();
    let x = e.clientX - containerRect.left - offsetX;
    let y = e.clientY - containerRect.top - offsetY;
    
    // Boundary checking
    x = Math.max(0, Math.min(containerRect.width - currentOverlay.offsetWidth, x));
    y = Math.max(0, Math.min(containerRect.height - currentOverlay.offsetHeight, y));
    
    currentOverlay.style.left = `${x}px`;
    currentOverlay.style.top = `${y}px`;
}

function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

// Video upload
uploadBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    
    input.onchange = e => {
        videoFile = e.target.files[0];
        if (videoFile) {
            // Clear previous overlays
            overlays.forEach(overlay => overlay.remove());
            overlays = [];
            currentOverlay = null;
            
            // Load new video
            const url = URL.createObjectURL(videoFile);
            videoPreview.src = url;
            videoPreview.load();
            
            statusText.textContent = `Video loaded: ${videoFile.name}`;
            outputContainer.style.display = 'none';
            progressBar.style.width = '0%';
        }
    };
    
    input.click();
});

// Process video button
processBtn.addEventListener('click', async () => {
    if (!overlays.length) {
        statusText.textContent = "Please add at least one text overlay";
        return;
    }
    
    statusText.textContent = "Processing video...";
    progressBar.style.width = '30%';
    
    // Simulate WebAssembly processing with ffmpeg.wasm
    // In a real implementation, we would use actual WebAssembly processing
    setTimeout(() => {
        progressBar.style.width = '70%';
        statusText.textContent = "Applying text overlays with WASM...";
        
        setTimeout(() => {
            progressBar.style.width = '100%';
            statusText.textContent = "Video processing complete!";
            
            // Show output
            outputContainer.style.display = 'block';
            outputVideo.src = videoPreview.src;
            
            // Scroll to output
            outputContainer.scrollIntoView({ behavior: 'smooth' });
        }, 1500);
    }, 1000);
});

// Export button
exportBtn.addEventListener('click', () => {
    if (outputContainer.style.display === 'block') {
        downloadVideo();
    } else {
        statusText.textContent = "Please process the video first";
    }
});

// Download button
downloadBtn.addEventListener('click', downloadVideo);

function downloadVideo() {
    // In a real implementation, this would download the processed video
    statusText.textContent = "Downloading video...";
    
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = outputVideo.src;
    link.download = 'edited-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
        statusText.textContent = "Video downloaded successfully!";
    }, 1000);
}

// Delete overlay with Delete key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' && currentOverlay) {
        const index = overlays.indexOf(currentOverlay);
        if (index !== -1) {
            overlays.splice(index, 1);
            currentOverlay.remove();
            currentOverlay = null;
        }
    }
});

// Initialize sample overlay when video is loaded
videoPreview.addEventListener('loadedmetadata', () => {
    // Create a sample overlay on the sample video
    setTimeout(() => {
        const overlay = document.createElement('div');
        overlay.className = 'text-overlay';
        overlay.textContent = "Drag me anywhere!";
        overlay.style.color = "#ffffff";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.fontSize = "30px";
        overlay.style.width = "250px";
        overlay.style.left = "150px";
        overlay.style.top = "50px";
        
        overlay.addEventListener('mousedown', startDrag);
        overlay.addEventListener('click', () => selectOverlay(overlay));
        
        previewContainer.appendChild(overlay);
        overlays.push(overlay);
        selectOverlay(overlay);
    }, 500);
});

// Update overlay when text content changes
textContent.addEventListener('input', () => {
    if (currentOverlay) {
        currentOverlay.textContent = textContent.value;
    }
});

// Update overlay font size
fontSize.addEventListener('change', () => {
    if (currentOverlay) {
        currentOverlay.style.fontSize = `${fontSize.value}px`;
    }
});
