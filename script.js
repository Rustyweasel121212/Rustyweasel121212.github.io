// IndexedDB Setup
const DB_NAME = 'BloxdioMarketplaceDB';
const DB_VERSION = 1;
const STORE_NAME = 'files';

let db;

// Initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
}

// Save file to IndexedDB
function saveFileToDB(file) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(file);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

// Get file from IndexedDB
function getFileFromDB(fileId) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(fileId);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

// Get all files from IndexedDB
function getAllFilesFromDB() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

// Initialize files data from localStorage and IndexedDB
let files = JSON.parse(localStorage.getItem('bloxdFiles')) || [
    {
        id: 1,
        name: 'Modern House Schematic',
        type: 'schematic',
        icon: '🏠',
        description: 'A beautiful modern house design with modern architecture and interior design.',
        author: 'BuilderPro',
        date: new Date(Date.now() - 7*24*60*60*1000),
        downloads: 245,
        hasFile: false
    },
    {
        id: 2,
        name: 'Crystal Texture Pack',
        type: 'texture',
        icon: '💎',
        description: 'High-quality crystal and gem textures for a magical experience.',
        author: 'DesignMaster',
        date: new Date(Date.now() - 3*24*60*60*1000),
        downloads: 189,
        hasFile: false
    },
    {
        id: 3,
        name: 'Castle Fort Schematic',
        type: 'schematic',
        icon: '🏰',
        description: 'Epic medieval castle with towers, walls, and interior rooms.',
        author: 'ArchitectKing',
        date: new Date(Date.now() - 14*24*60*60*1000),
        downloads: 412,
        hasFile: false
    },
    {
        id: 4,
        name: 'Neon Cyberpunk Texture',
        type: 'texture',
        icon: '🌃',
        description: 'Futuristic neon colors with glowing effects and cyberpunk aesthetics.',
        author: 'FutureTech',
        date: new Date(Date.now() - 5*24*60*60*1000),
        downloads: 156,
        hasFile: false
    },
    {
        id: 5,
        name: 'Floating Island Schematic',
        type: 'schematic',
        icon: '☁️',
        description: 'Amazing floating island with sky bases and waterfalls.',
        author: 'SkyBuilder',
        date: new Date(Date.now() - 2*24*60*60*1000),
        downloads: 89,
        hasFile: false
    }
];

// Show/Hide Sections
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function showHome() {
    showSection('home');
    loadFeatured();
}

function showBrowse() {
    showSection('browse');
    loadAllFiles();
}

function showUpload() {
    showSection('upload');
    document.getElementById('upload-form').reset();
    document.getElementById('upload-message').className = 'message';
}

// Load Featured Files
function loadFeatured() {
    const container = document.getElementById('featured-container');
    const featured = files.slice(0, 3);
    container.innerHTML = featured.map(file => createFileCard(file)).join('');
}

// Load All Files
function loadAllFiles() {
    const container = document.getElementById('files-container');
    const sortedFiles = [...files].sort((a, b) => b.date - a.date);
    container.innerHTML = sortedFiles.map(file => createFileCard(file)).join('');
}

// Create File Card HTML
function createFileCard(file) {
    const date = new Date(file.date);
    const dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
    return `
        <div class="file-card" onclick="openModal(${file.id})">
            <div class="file-icon">${file.icon}</div>
            <h3>${file.name}</h3>
            <div class="file-type">${file.type === 'schematic' ? '📁 Schematic' : '🎨 Texture Pack'}</div>
            <p class="file-description">${file.description}</p>
            <div class="file-meta">
                <span class="file-author">By ${file.author}</span>
                <span>${dateString}</span>
            </div>
            <div class="file-meta">
                <span class="file-downloads">📥 ${file.downloads} downloads</span>
            </div>
        </div>
    `;
}

// Filter Files
function filterFiles() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const typeFilter = document.getElementById('type-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;

    let filtered = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchInput) || 
                            file.description.toLowerCase().includes(searchInput);
        const matchesType = typeFilter === '' || file.type === typeFilter;
        return matchesSearch && matchesType;
    });

    // Sort
    if (sortFilter === 'newest') {
        filtered.sort((a, b) => b.date - a.date);
    } else if (sortFilter === 'oldest') {
        filtered.sort((a, b) => a.date - b.date);
    } else if (sortFilter === 'downloads') {
        filtered.sort((a, b) => b.downloads - a.downloads);
    }

    const container = document.getElementById('files-container');
    container.innerHTML = filtered.length > 0 
        ? filtered.map(file => createFileCard(file)).join('')
        : '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No files found. Try a different search!</p>';
}

// Open Modal
function openModal(fileId) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const date = new Date(file.date);
    const dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const modalBody = document.getElementById('modal-body');
    const downloadButtonHTML = file.hasFile 
        ? `<button class="download-btn" onclick="downloadFile(${file.id})">📥 Download (${formatFileSize(file.fileSize)})</button>`
        : `<button class="download-btn" style="opacity: 0.5; cursor: not-allowed;">📁 No File Uploaded</button>`;
    
    modalBody.innerHTML = `
        <div class="modal-detail-icon">${file.icon}</div>
        <h2 class="modal-detail-title">${file.name}</h2>
        <div class="modal-detail-badge">${file.type === 'schematic' ? '📁 Schematic (.bloxdschematic)' : '🎨 Texture Pack'}</div>
        
        <div class="modal-detail-meta">
            <div>
                <strong>Author:</strong> ${file.author}<br>
                <strong>Uploaded:</strong> ${dateString}
            </div>
            <div>
                <strong>Downloads:</strong> ${file.downloads}<br>
                <strong>Type:</strong> ${file.type}
            </div>
        </div>

        <div class="modal-detail-description">
            <strong>Description:</strong><br>
            ${file.description}
        </div>

        <div class="modal-detail-actions">
            ${downloadButtonHTML}
            <button class="close-btn" onclick="closeModal()">Close</button>
        </div>
    `;

    document.getElementById('modal').classList.add('show');
}

// Close Modal
function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Download File
async function downloadFile(fileId) {
    const file = files.find(f => f.id === fileId);
    if (!file || !file.hasFile) {
        alert('❌ File not available for download');
        return;
    }

    try {
        const fileData = await getFileFromDB(fileId);
        if (!fileData) {
            alert('❌ File not found in storage');
            return;
        }

        // Update download count
        file.downloads++;
        localStorage.setItem('bloxdFiles', JSON.stringify(files));

        // Create blob and download
        const blob = new Blob([fileData.fileContent], { type: fileData.mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileData.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showUploadMessage(`✅ Downloaded: ${file.name}`, 'success');
    } catch (error) {
        console.error('Download error:', error);
        alert('❌ Error downloading file: ' + error.message);
    }
}

// Cancel Upload
function cancelUpload() {
    if (confirm('Are you sure you want to cancel the upload?')) {
        document.getElementById('upload-form').reset();
        document.getElementById('upload-message').className = 'message';
        showHome();
    }
}

// Handle Upload
async function handleUpload(event) {
    event.preventDefault();

    const fileName = document.getElementById('file-name').value;
    const fileType = document.getElementById('file-type').value;
    const fileDescription = document.getElementById('file-description').value;
    const fileUpload = document.getElementById('file-upload');
    const authorName = document.getElementById('author-name').value;

    // Validation
    if (!fileName || !fileType || !fileUpload.files[0] || !authorName) {
        showUploadMessage('Please fill in all fields.', 'error');
        return;
    }

    const uploadedFile = fileUpload.files[0];
    
    // Check file size (max 500MB)
    if (uploadedFile.size > 500 * 1024 * 1024) {
        showUploadMessage('❌ File too large! Max 500MB allowed.', 'error');
        return;
    }

    try {
        showUploadMessage('📤 Uploading...', 'success');

        // Read file as array buffer
        const fileBuffer = await readFileAsBuffer(uploadedFile);
        
        const newFileId = Math.max(...files.map(f => f.id)) + 1;

        // Create file metadata
        const newFile = {
            id: newFileId,
            name: fileName,
            type: fileType,
            icon: fileType === 'schematic' ? '📁' : '🎨',
            description: fileDescription || 'No description provided.',
            author: authorName,
            date: new Date(),
            downloads: 0,
            hasFile: true,
            fileSize: uploadedFile.size,
            originalFileName: uploadedFile.name
        };

        // Save to IndexedDB
        const dbFile = {
            id: newFileId,
            fileName: uploadedFile.name,
            fileContent: fileBuffer,
            mimeType: uploadedFile.type
        };

        await saveFileToDB(dbFile);

        // Add to files array
        files.push(newFile);
        localStorage.setItem('bloxdFiles', JSON.stringify(files));

        // Show success message
        showUploadMessage(`✅ Successfully uploaded: ${fileName}! (${formatFileSize(uploadedFile.size)})`, 'success');

        // Reset form
        document.getElementById('upload-form').reset();

        // Scroll to top
        window.scrollTo(0, 0);

        // Show home after 2 seconds
        setTimeout(() => {
            showHome();
        }, 2000);
    } catch (error) {
        console.error('Upload error:', error);
        showUploadMessage('❌ Upload failed: ' + error.message, 'error');
    }
}

// Read file as buffer
function readFileAsBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Show Upload Message
function showUploadMessage(message, type) {
    const messageDiv = document.getElementById('upload-message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 5000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        showHome();
    } catch (error) {
        console.error('DB initialization error:', error);
        showHome();
    }
});