/* File: js/browse.js */

// --- Hamburger Menu Logic ---
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle && navMenu) { /* ... */ }

// --- Browse Page Logic ---
const gridContainer = document.getElementById('browse-grid-container');
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModalButton = document.querySelector('.modal-close');
const contactModal = document.getElementById('contact-modal');
const closeContactModalButton = document.querySelector('.contact-modal-close');
const contactForm = document.getElementById('inquiry-form');
const contactFormStatus = document.getElementById('contact-form-status');
const recipientEmailInput = document.getElementById('recipient_email');
const itemNameInput = document.getElementById('item_name');

let allListings = [];
const filterContainer = document.querySelector('.filter-container');
// NEW: Get the condition dropdown
const conditionFilterSelect = document.getElementById('condition-filter');

// NEW: Store current filter state
let currentCategory = 'All';
let currentCondition = 'All';

async function fetchListings() {
    try {
        const response = await fetch('/.netlify/functions/getlistings');
        if (!response.ok) { throw new Error('Failed to fetch listings.'); }
        const data = await response.json();
        allListings = data;
        applyFilters(); // Apply initial filters (defaults to "All")
    } catch (error) {
        console.error(error);
        if(gridContainer) gridContainer.innerHTML = '<p style="color: red;">Could not load listings. Please try again later.</p>';
    }
}

// MODIFIED: Displays listings based on provided array
function displayListings(listingsToDisplay) {
    if (!gridContainer) return;
    if (listingsToDisplay.length === 0) {
        gridContainer.innerHTML = '<p>No items match the current filters.</p>';
        return;
    }
    gridContainer.innerHTML = ''; 
    listingsToDisplay.forEach(submission => {
        const fields = submission.data; 
        if (!fields.name || !fields.imageURL) { return; }
        const card = document.createElement('div');
        card.className = 'listing-card';
        // ADDED: Display the condition in the card
        card.innerHTML = `<img src="${fields.imageURL}" alt="${fields.name}" onerror="this.onerror=null;this.src='https.via.placeholder.com/280x180?text=Image+Not+Found';"><div class="listing-card-content"><h3>${fields.name}</h3><p><strong>Category:</strong> ${fields.category || 'N/A'}</p><p><strong>Condition:</strong> ${fields.condition || 'N/A'}</p><p>${fields.description || 'No description provided.'}</p><p><strong>Seeking:</strong> ${fields.seeking || 'Open to offers'}</p><button class="cta-btn contact-swapper-btn" data-recipient="${fields.contactEmail}" data-item="${fields.name}">Contact Swapper</button></div>`;
        gridContainer.appendChild(card);
    });
}

// NEW: Combined filter logic
function applyFilters() {
    let filteredListings = allListings;

    // Filter by category
    if (currentCategory !== 'All') {
        filteredListings = filteredListings.filter(submission => submission.data.category === currentCategory);
    }

    // Filter by condition
    if (currentCondition !== 'All') {
        filteredListings = filteredListings.filter(submission => submission.data.condition === currentCondition);
    }

    displayListings(filteredListings);
}

// --- Modal Logic (Image & Contact) ---
// (The openModal, closeModal functions remain the same)
function openImageModal(src) { /* ... */ }
function closeImageModal() { /* ... */ }
if(closeModalButton) closeModalButton.addEventListener('click', closeImageModal);
if(imageModal) imageModal.addEventListener('click', (event) => { if (event.target === imageModal) { closeImageModal(); } });
function openContactModal(recipientEmail, itemName) { /* ... */ }
function closeContactModal() { /* ... */ }
if(gridContainer) gridContainer.addEventListener('click', (event) => { /* ... */ });
if(closeContactModalButton) closeContactModalButton.addEventListener('click', closeContactModal);
if(contactModal) contactModal.addEventListener('click', (event) => { if (event.target === contactModal) { closeContactModal(); } });
if(contactForm) contactForm.addEventListener('submit', (e) => { /* ... */ });

// --- Filter Event Listeners ---
// Listener for category buttons
if (filterContainer) {
    filterContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('category-btn')) {
            const buttons = filterContainer.querySelectorAll('.category-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            const clickedButton = event.target;
            clickedButton.classList.add('active');
            
            currentCategory = clickedButton.dataset.category; // Update current category
            applyFilters(); // Apply both filters
        }
    });
}

// NEW: Listener for condition dropdown
if (conditionFilterSelect) {
    conditionFilterSelect.addEventListener('change', (event) => {
        currentCondition = event.target.value; // Update current condition
        applyFilters(); // Apply both filters
    });
}

// Initial fetch when the page loads
if (gridContainer) {
    document.addEventListener('DOMContentLoaded', fetchListings);
}