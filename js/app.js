// ===== LocalStorage Functions =====
function getLostItems() {
    return JSON.parse(localStorage.getItem('lostItems')) || [];
}

function getFoundItems() {
    return JSON.parse(localStorage.getItem('foundItems')) || [];
}

function saveLostItem(item) {
    const items = getLostItems();
    items.push(item);
    localStorage.setItem('lostItems', JSON.stringify(items));
}

function saveFoundItem(item) {
    const items = getFoundItems();
    items.push(item);
    localStorage.setItem('foundItems', JSON.stringify(items));
}

function removeLostItem(id) {
    const items = getLostItems().filter(item => item.id !== id);
    localStorage.setItem('lostItems', JSON.stringify(items));
}

function removeFoundItem(id) {
    const items = getFoundItems().filter(item => item.id !== id);
    localStorage.setItem('foundItems', JSON.stringify(items));
}

// ===== Display Items on Homepage =====
function displayLostItems() {
    const container = document.getElementById('lostItems');
    const items = getLostItems();
    
    if (items.length === 0) {
        container.innerHTML = `
            <h3>Lost Items</h3>
            <div class="no-items">No lost items reported yet.</div>
        `;
        return;
    }

    let html = '<h3>Lost Items</h3>';
    items.forEach(item => {
        html += `
            <div class="item-card" data-id="${item.id}">
                <h4>${item.itemName}</h4>
                <p><strong>Lost on:</strong> ${item.lostDate}</p>
                <p><strong>Location:</strong> ${item.location || 'Not specified'}</p>
                ${item.description ? `<p><strong>Description:</strong> ${item.description}</p>` : ''}
                <button class="btn-action" onclick="markAsFound(${item.id})">Mark as Found</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function displayFoundItems() {
    const container = document.getElementById('foundItems');
    const items = getFoundItems();
    
    if (items.length === 0) {
        container.innerHTML = `
            <h3>Found Items</h3>
            <div class="no-items">No found items reported yet.</div>
        `;
        return;
    }

    let html = '<h3>Found Items</h3>';
    items.forEach(item => {
        html += `
            <div class="item-card" data-id="${item.id}">
                <h4>${item.itemName}</h4>
                <p><strong>Found on:</strong> ${item.foundDate}</p>
                <p><strong>Location:</strong> ${item.foundLocation}</p>
                <p><strong>Contact:</strong> ${item.finderContact}</p>
                ${item.description ? `<p><strong>Description:</strong> ${item.description}</p>` : ''}
                ${item.imageBase64 ? `<img src="${item.imageBase64}" alt="${item.itemName}" style="max-width: 100%; height: auto;">` : ''}
                <button class="btn-action" onclick="markAsReturned(${item.id})">Mark as Returned</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}
// ===== Form Handlers =====
function setupLostForm() {
    const form = document.getElementById('lostForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newItem = {
            id: Date.now(),
            itemName: document.getElementById('itemName').value,
            lostDate: document.getElementById('lostDate').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            status: 'lost',
            dateReported: new Date().toLocaleDateString()
        };
        
        saveLostItem(newItem);
        alert('Lost item reported successfully!');
        window.location.href = 'index.html';
    });
}

function setupFoundForm() {
    const form = document.getElementById('foundForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const imageFile = document.getElementById('itemImage').files[0];
        let imageBase64 = '';
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageBase64 = e.target.result;
                
                const newItem = {
                    id: Date.now(),
                    itemName: document.getElementById('foundItemName').value,
                    foundDate: document.getElementById('foundDate').value,
                    foundLocation: document.getElementById('foundLocation').value,
                    finderContact: document.getElementById('finderContact').value,
                    description: document.getElementById('foundDescription').value,
                    imageBase64: imageBase64,
                    status: 'found',
                    dateReported: new Date().toLocaleDateString()
                };
                
                saveFoundItem(newItem);
                alert('Found item reported successfully!');
                window.location.href = 'index.html';
            };
            reader.readAsDataURL(imageFile);
        } else {
            const newItem = {
                id: Date.now(),
                itemName: document.getElementById('foundItemName').value,
                foundDate: document.getElementById('foundDate').value,
                foundLocation: document.getElementById('foundLocation').value,
                finderContact: document.getElementById('finderContact').value,
                description: document.getElementById('foundDescription').value,
                imageBase64: '',
                status: 'found',
                dateReported: new Date().toLocaleDateString()
            };
            
            saveFoundItem(newItem);
            alert('Found item reported successfully!');
            window.location.href = 'index.html';
        }
    });
}
// ===== Search Functionality =====
function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchBtn) return;

    function performSearch() {
        const query = searchInput.value.toLowerCase();
        if (!query) {
            resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
            return;
        }

        const lostItems = getLostItems();
        const foundItems = getFoundItems();

        const lostResults = lostItems.filter(item => 
            item.itemName.toLowerCase().includes(query) || 
            (item.location && item.location.toLowerCase().includes(query))
        );

        const foundResults = foundItems.filter(item => 
            item.itemName.toLowerCase().includes(query) || 
            item.foundLocation.toLowerCase().includes(query)
        );

        displaySearchResults(lostResults, foundResults);
    }

    function displaySearchResults(lost, found) {
        if (lost.length === 0 && found.length === 0) {
            resultsContainer.innerHTML = '<p>No items found matching your search.</p>';
            return;
        }

        let html = '';

        if (lost.length > 0) {
            html += '<h2>Lost Items</h2>';
            lost.forEach(item => {
                html += `
                    <div class="result-card">
                        <h3>${item.itemName}</h3>
                        <p><strong>Lost on:</strong> ${item.lostDate}</p>
                        <p><strong>Location:</strong> ${item.location || 'Unknown'}</p>
                        ${item.description ? `<p><strong>Description:</strong> ${item.description}</p>` : ''}
                    </div>
                `;
            });
        }

        if (found.length > 0) {
            html += '<h2>Found Items</h2>';
            found.forEach(item => {
                html += `
                    <div class="result-card">
                        <h3>${item.itemName}</h3>
                        <p><strong>Found on:</strong> ${item.foundDate}</p>
                        <p><strong>Location:</strong> ${item.foundLocation}</p>
                        <p><strong>Contact:</strong> ${item.finderContact}</p>
                        ${item.description ? `<p><strong>Description:</strong> ${item.description}</p>` : ''}
                        ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.itemName}">` : ''}
                    </div>
                `;
            });
        }

        resultsContainer.innerHTML = html;
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') performSearch();
    });
}

// ===== Action Buttons =====
function markAsFound(id) {
    if (confirm('Mark this item as found?')) {
        removeLostItem(id);
        displayLostItems();
    }
}

function markAsReturned(id) {
    if (confirm('Mark this item as returned?')) {
        removeFoundItem(id);
        displayFoundItems();
    }
}

// ===== Initialize Page =====
document.addEventListener('DOMContentLoaded', function() {
    // Homepage
    if (document.getElementById('lostItems')) {
        displayLostItems();
        displayFoundItems();
    }
    
    // Forms
    setupLostForm();
    setupFoundForm();
    
    // Search
    setupSearch();
});
