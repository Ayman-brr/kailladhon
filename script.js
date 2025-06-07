* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background: linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c);
    color: #fff;
    min-height: 100vh;
    padding: 20px;
    overflow-x: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

h1 {
    font-size: 2.8rem;
    margin-bottom: 10px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 700px;
    margin: 0 auto;
}

.editor-container {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 25px;
    margin-bottom: 30px;
}

.video-section {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.preview-container {
    position: relative;
    background: #000;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;
    aspect-ratio: 16/9;
}

#video-preview {
    width: 100%;
    height: 100%;
    display: block;
}

.controls {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
    flex-wrap: wrap;
}

.btn {
    background: linear-gradient(45deg, #3498db, #2980b9);
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn:active {
    transform: translateY(1px);
}

.btn.btn-process {
    background: linear-gradient(45deg, #2ecc71, #27ae60);
}

.btn.btn-export {
    background: linear-gradient(45deg, #e74c3c, #c0392b);
}

.text-controls {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.panel-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
}

input, select, textarea {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
}

input:focus, select:focus, textarea:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
}

.color-picker {
    display: flex;
    align-items: center;
    gap: 15px;
}

.color-preview {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: white;
}

.text-overlay {
    position: absolute;
    padding: 10px;
    cursor: move;
    user-select: none;
    border: 2px dashed rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.5);
    max-width: 300px;
    word-wrap: break-word;
    transition: all 0.2s ease;
}

.text-overlay.selected {
    border: 2px solid #3498db;
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.7);
}

.status {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    padding: 25px;
    margin-top: 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.status-title {
    font-size: 1.4rem;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.progress-container {
    height: 30px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    overflow: hidden;
    margin: 20px 0;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #3498db, #2ecc71);
    width: 0%;
    transition: width 0.3s ease;
    border-radius: 15px;
}

.output-container {
    display: none;
    margin-top: 20px;
    text-align: center;
}

#output-video {
    width: 100%;
    border-radius: 10px;
    margin-top: 15px;
}

.instructions {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    margin-top: 20px;
    font-size: 0.9rem;
}

.instructions ul {
    padding-left: 20px;
    margin-top: 10px;
}

.instructions li {
    margin-bottom: 8px;
}

footer {
    text-align: center;
    margin-top: 40px;
    opacity: 0.7;
    font-size: 0.9rem;
}

/* Responsive design */
@media (max-width: 900px) {
    .editor-container {
        grid-template-columns: 1fr;
    }
    
    h1 {
        font-size: 2.2rem;
    }
}

@media (max-width: 600px) {
    .controls {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
}
