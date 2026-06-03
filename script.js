// Initialize files data from localStorage
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
        fileUrl: '#download-1'
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
        fileUrl: '#download-2'
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
        fileUrl: '#download-3'
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
        fileUrl: '#download-4'
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
        fileUrl: '#download-5'
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
            <button class="download-btn" onclick="downloadFile(${file.id})">📥 Download</button>
            <button class="close-btn" onclick="closeModal()">Close</button>
        </div>
    `;

    document.getElementById('modal').classList.add('show');
}

// Close Modal
function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

// Download File
function downloadFile(fileId) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    // Update download count
    file.downloads++;
    localStorage.setItem('bloxdFiles', JSON.stringify(files));

    // Simulate download (in real app, this would download an actual file)
    alert(`✅ Downloaded: ${file.name}\n\nDownloads: ${file.downloads}`);
    
    // In a real application, you would:
    // const link = document.createElement('a');
    // link.href = file.fileUrl;
    // link.download = file.name;
    // link.click();
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
function handleUpload(event) {
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

    // Create new file entry
    const newFile = {
        id: files.length + 1,
        name: fileName,
        type: fileType,
        icon: fileType === 'schematic' ? '📁' : '🎨',
        description: fileDescription || 'No description provided.',
        author: authorName,
        date: new Date(),
        downloads: 0,
        fileUrl: '#' + Date.now()
    };

    // Add to files array
    files.push(newFile);
    localStorage.setItem('bloxdFiles', JSON.stringify(files));

    // Show success message
    showUploadMessage(`✅ Successfully uploaded: ${fileName}!`, 'success');

    // Reset form
    document.getElementById('upload-form').reset();

    // Scroll to top
    window.scrollTo(0, 0);

    // Show home after 2 seconds
    setTimeout(() => {
        showHome();
    }, 2000);
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
document.addEventListener('DOMContentLoaded', () => {
    showHome();
});