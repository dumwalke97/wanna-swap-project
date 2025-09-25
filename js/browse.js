/* File: js/browse.js */
const gridContainer = document.getElementById('browse-grid-container');

// Image Modal Elements
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeImageModalButton = document.querySelector('.modal-close');

// NEW: Contact Form Modal Elements
const contactModal = document.getElementById('contact-modal');
const closeContactModalButton = document.querySelector('.contact-modal-close');
const contactForm = document.getElementById('contact-form');
const contactFormStatus = document.getElementById('contact-form-status');
const recipientEmailInput = document.getElementById('recipient-email');
const itemNameInput = document.getElementById('item-name');

async function fetchListings() {
    // ... (this function remains the same) ...
}

function displayListings(submissions) {
    if (submissions.length === 0) { /* ... */ return; }
    gridContainer.innerHTML = ''; 

    submissions.forEach(submission => {
        const fields = submission.data; 
        if (!fields.name || !fields.imageURL) { return; }

        const card = document.createElement('div');
        card.className = 'listing-card';

        // MODIFIED: Added data attributes to the contact button
        card.innerHTML = `
            <img src="${fields.imageURL}" alt="${fields.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/280x180?text=Image+Not+Found';">
            <div class="listing-card-content">
                <h3>${fields.name}</h3>
                <p><strong>Category:</strong> ${fields.category || 'N/A'}</p>
                <p>${fields.description || 'No description provided.'}</p>
                <p><strong>Seeking:</strong> ${fields.seeking || 'Open to offers'}</p> 
                <button class="cta-btn contact-swapper-btn" data-recipient="${fields.contactEmail}" data-item="${fields.name}">Contact Swapper</button>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// --- Image Modal Logic ---
function openImageModal(src) { /* ... */ }
function closeImageModal() { /* ... */ }
closeImageModalButton.addEventListener('click', closeImageModal);
imageModal.addEventListener('click', (event) => { if (event.target === imageModal) { closeImageModal(); } });

// --- NEW: Contact Modal Logic ---
function openContactModal(recipientEmail, itemName) {
    recipientEmailInput.value = recipientEmail;
    itemNameInput.value = itemName;
    contactModal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closeContactModal() {
    contactModal.style.display = 'none';
    contactForm.reset();
    contactFormStatus.textContent = '';
    document.body.classList.remove('modal-open');
}

// Event Delegation for all buttons on the grid
gridContainer.addEventListener('click', (event) => {
    // If an image is clicked, open the image modal
    if (event.target.tagName === 'IMG') {
        openImageModal(event.target.src);
    }
    // If a contact button is clicked, open the contact modal
    if (event.target.classList.contains('contact-swapper-btn')) {
        const recipient = event.target.dataset.recipient;
        const item = event.target.dataset.item;
        openContactModal(recipient, item);
    }
});

// Listeners for closing the contact modal
closeContactModalButton.addEventListener('click', closeContactModal);
contactModal.addEventListener('click', (event) => { if (event.target === contactModal) { closeContactModal(); } });

// Listener for the contact form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactFormStatus.textContent = 'Sending...';

    const formData = new FormData(contactForm);
    const recipient = formData.get('recipient-email');

    // Netlify requires a special header for email notifications
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    // We send a special 'destination-email' field to our serverless function
    const body = new URLSearchParams(formData).toString();

    fetch('/', { method: 'POST', headers, body })
    .then(() => {
        contactFormStatus.textContent = 'Success! Your inquiry has been sent.';
        contactFormStatus.style.color = 'var(--green-accent)';
        // Close the modal after a short delay
        setTimeout(closeContactModal, 2000);
    })
    .catch((error) => {
        contactFormStatus.textContent = `Error: ${error.message}`;
        contactFormStatus.style.color = 'red';
    });
});

document.addEventListener('DOMContentLoaded', fetchListings);