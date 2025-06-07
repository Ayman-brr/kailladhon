// DOM Elements
const video = document.getElementById('video');
const videoWrapper = document.querySelector('.video-wrapper');
const textContent = document.getElementById('text-content');
const fontSize = document.getElementById('font-size');
const textColor = document.getElementById('text-color');
const bgColor = document.getElementById('bg-color');
const opacity = document.getElementById('opacity');
const opacityValue = document.getElementById('opacity-value');
const addTextBtn = document.getElementById('add-text');
const uploadBtn = document.getElementById('upload');
const processBtn = document.getElementById('process');
const exportBtn = document.getElementById('export');
const status = document.getElementById('status');
const progressBar = document.getElementById('progress-bar');
const outputContainer = document.getElementById('output');
const outputVideo = document.getElementById('output-video');

// State
let overlays = [];
let currentOverlay = null;
let videoFile = null;

// Initialize
opacityValue.textContent = `${opacity.value}%`;

// Event Listeners
addTextBtn.addEventListener('click', addTextOverlay);
uploadBtn.addEventListener('click', uploadVideo);
processBtn.addEventListener('click', processVideo);
exportBtn.addEventListener('click', exportVideo);
opacity.addEventListener('input', updateOpacityValue);

// Functions
function addTextOverlay() {
    const text = textContent.value.trim();
    if (!text) return;

    const overlay = document.createElement('div');
    overlay.className = 'text-overlay';
    overlay.textContent = text;
    overlay.style.fontSize = `${fontSize.value}px`;
    overlay.style.color = textColor.value;
    overlay.style.backgroundColor = `rgba(${hexToRgb(bgColor.value)}, ${opacity.value / 100})`;
    
    // Center overlay initially
    const rect = videoWrapper.getBoundingClientRect();
    overlay.style.left = `${rect.width / 2 - 100}px`;
    overlay.style.top = `${rect.height / 2 - 50}px`;
    
    // Add drag functionality
    overlay.addEventListener('mousedown', startDrag);
    overlay.addEventListener('click', () => selectOverlay(overlay));
    
    videoWrapper.appendChild(overlay);
    overlays.push(overlay);
    selectOverlay(overlay);
}

function selectOverlay(overlay) {
    if (currentOverlay) {
        currentOverlay.style.border = 'none';
    }
    currentOverlay = overlay;
    overlay.style.border = '2px dashed #2a9d8f';
    
    // Update controls
    textContent.value = overlay.textContent;
    textColor.value = rgbToHex(overlay.style.color);
    fontSize.value = parseInt(overlay.style.fontSize);
    
    const bg = overlay.style.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
    if (bg) {
        bgColor.value = rgbToHex(`rgb(${bg[1]},${bg[2]},${bg[3]}`);
        opacity.value = Math.round(bg[4] * 100);
        opacityValue.textContent = `${opacity.value}%`;
    }
}

function startDrag(e) {
    e.preventDefault();
    const overlay = e.target;
    const rect = overlay.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    function move(e) {
        const videoRect = videoWrapper.getBoundingClientRect();
        let x = e.clientX - videoRect.left - offsetX;
        let y = e.clientY - videoRect.top - offsetY;
        
        // Boundary check
        x = Math.max(0, Math.min(videoRect.width - rect.width, x));
        y = Math.max(0, Math.min(videoRect.height - rect.height, y));
        
        overlay.style.left = `${x}px`;
        overlay.style.top = `${y}px`;
    }
    
    function stop() {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stop);
    }
    
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stop);
}

function uploadVideo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    
    input.onchange = e => {
        videoFile = e.target.files[0];
        if (videoFile) {
            // Clear existing overlays
            overlays.forEach(overlay => overlay.remove());
            overlays = [];
            currentOverlay = null;
            
            // Load new video
            video.src = URL.createObjectURL(videoFile);
            outputContainer.hidden = true;
            exportBtn.disabled = true;
            status.textContent = `Loaded: ${videoFile.name}`;
        }
    };
    
    input.click();
}

function processVideo() {
    if (!overlays.length) {
        status.textContent = "Please add at least one text overlay";
        return;
    }
    
    status.textContent = "Processing video...";
    progressBar.style.width = '0%';
    exportBtn.disabled = true;
    
    // Simulate processing (in real app, use ffmpeg.wasm)
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                status.textContent = "Processing complete!";
                outputVideo.src = video.src;
                outputContainer.hidden = false;
                exportBtn.disabled = false;
            }, 500);
        }
    }, 100);
}

function exportVideo() {
    const link = document.createElement('a');
    link.href = outputVideo.src;
    link.download = 'edited-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    status.textContent = "Video downloaded!";
}

function updateOpacityValue() {
    opacityValue.textContent = `${opacity.value}%`;
    if (currentOverlay) {
        const rgb = hexToRgb(bgColor.value);
        currentOverlay.style.backgroundColor = `rgba(${rgb}, ${opacity.value / 100})`;
    }
}

// Helper functions
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

function rgbToHex(rgb) {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return '#000000';
    
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
}

// Initialize with sample overlay when video loads
video.addEventListener('loadedmetadata', () => {
    setTimeout(() => {
        textContent.value = "Sample Text";
        addTextOverlay();
    }, 500);
});
