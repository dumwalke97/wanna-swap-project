/* File: js/browse.js */

// --- Hamburger Menu Logic ---
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

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

// NEW: Variable to store all listings fetched from the server
let allListings = [];
// NEW: Get the filter button container
const filterContainer = document.querySelector('.filter-container');

async function fetchListings() {
    try {
        const response = await fetch('/.netlify/functions/getlistings');
        if (!response.ok) { throw new Error('Failed to fetch listings.'); }
        const data = await response.json();
        
        // NEW: Store all listings globally
        allListings = data;
        
        // Display all listings initially
        displayListings(allListings);
        
    } catch (error) {
        console.error(error);
        if(gridContainer) gridContainer.innerHTML = '<p style="color: red;">Could not load listings. Please try again later.</p>';
    }
}

// MODIFIED: This function now accepts an array of listings to display
function displayListings(listingsToDisplay) {
    if (!gridContainer) return;
    if (listingsToDisplay.length === 0) {
        gridContainer.innerHTML = '<p>No items found for this category.</p>';
        return;
    }
    gridContainer.innerHTML = ''; 
    listingsToDisplay.forEach(submission => {
        const fields = submission.data; 
        if (!fields.name || !fields.imageURL) { return; }
        const card = document.createElement('div');
        card.className = 'listing-card';
        card.innerHTML = `<img src="${fields.imageURL}" alt="${fields.name}" onerror="this.onerror=null;this.src='https.via.placeholder.com/280x180?text=Image+Not+Found';"><div class="listing-card-content"><h3>${fields.name}</h3><p><strong>Category:</strong> ${fields.category || 'N/A'}</p><p>${fields.description || 'No description provided.'}</p><p><strong>Seeking:</strong> ${fields.seeking || 'Open to offers'}</p><button class="cta-btn contact-swapper-btn" data-recipient="${fields.contactEmail}" data-item="${fields.name}">Contact Swapper</button></div>`;
        gridContainer.appendChild(card);
    });
}

// --- Modal Logic (Image & Contact) ---
// (The openModal, closeModal functions remain the same as before)
function openImageModal(src) { imageModal.style.display = 'flex'; modalImage.src = src; document.body.classList.add('modal-open'); }
function closeImageModal() { imageModal.style.display = 'none'; document.body.classList.remove('modal-open'); }
if(closeModalButton) closeModalButton.addEventListener('click', closeImageModal);
if(imageModal) imageModal.addEventListener('click', (event) => { if (event.target === imageModal) { closeImageModal(); } });
function openContactModal(recipientEmail, itemName) { recipientEmailInput.value = recipientEmail; itemNameInput.value = itemName; contactModal.style.display = 'flex'; document.body.classList.add('modal-open'); }
function closeContactModal() { contactModal.style.display = 'none'; contactForm.reset(); contactFormStatus.textContent = ''; document.body.classList.remove('modal-open'); }
if(gridContainer) gridContainer.addEventListener('click', (event) => { if (event.target.tagName === 'IMG') { openImageModal(event.target.src); } if (event.target.classList.contains('contact-swapper-btn')) { const recipient = event.target.dataset.recipient; const item = event.target.dataset.item; openContactModal(recipient, item); } });
if(closeContactModalButton) closeContactModalButton.addEventListener('click', closeContactModal);
if(contactModal) contactModal.addEventListener('click', (event) => { if (event.target === contactModal) { closeContactModal(); } });
if(contactForm) contactForm.addEventListener('submit', (e) => { e.preventDefault(); contactFormStatus.textContent = 'Sending...'; const formData = new FormData(contactForm); const headers = { "Content-Type": "application/x-www-form-urlencoded" }; const body = new URLSearchParams(formData).toString(); fetch('/', { method: 'POST', headers, body }).then(() => { contactFormStatus.textContent = 'Success! Your inquiry has been sent.'; contactFormStatus.style.color = 'var(--green-accent)'; setTimeout(closeContactModal, 2000); }).catch((error) => { contactFormStatus.textContent = `Error: ${error.message}`; contactFormStatus.style.color = 'red'; }); });


// --- NEW: Filter Logic ---
function filterListings(category) {
    if (category === 'All') {
        displayListings(allListings); // Show all listings
    } else {
        const filteredListings = allListings.filter(submission => submission.data.category === category);
        displayListings(filteredListings); // Show only filtered listings
    }
}

// NEW: Event listener for filter buttons
if (filterContainer) {
    filterContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('filter-btn')) {
            // Remove 'active' class from all buttons
            const buttons = filterContainer.querySelectorAll('.filter-btn');
            buttons.forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            const clickedButton = event.target;
            clickedButton.classList.add('active');

            // Get the category and filter
            const category = clickedButton.dataset.category;
            filterListings(category);
        }
    });
}

// Initial fetch when the page loads
if (gridContainer) {
    document.addEventListener('DOMContentLoaded', fetchListings);
}