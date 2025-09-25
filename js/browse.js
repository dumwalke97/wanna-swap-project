/* File: js/browse.js */
console.log("browse.js script started."); // Log #1

const gridContainer = document.getElementById('browse-grid-container');
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModalButton = document.querySelector('.modal-close');
const contactModal = document.getElementById('contact-modal');
const closeContactModalButton = document.querySelector('.contact-modal-close');
const contactForm = document.getElementById('contact-form');
const contactFormStatus = document.getElementById('contact-form-status');
const recipientEmailInput = document.getElementById('recipient-email');
const itemNameInput = document.getElementById('item-name');

async function fetchListings() {
    console.log("fetchListings() function called."); // Log #2
    try {
        console.log("Attempting to fetch from /.netlify/functions/getlistings..."); // Log #3
        const response = await fetch('/.netlify/functions/getlistings');
        console.log("Fetch response received:", response); // Log #4

        if (!response.ok) {
            console.error("Response was not OK. Status:", response.status); // Log #5 (Error)
            throw new Error('Failed to fetch listings.');
        }

        console.log("Response was OK. Attempting to parse JSON..."); // Log #6
        const data = await response.json();
        console.log("JSON parsed successfully. Data:", data); // Log #7

        displayListings(data);
    } catch (error) {
        console.error("An error occurred in the fetchListings try/catch block:", error); // Log #8 (Error)
        gridContainer.innerHTML = '<p style="color: red;">Could not load listings. Please try again later.</p>';
    }
}

function displayListings(submissions) {
    console.log("displayListings() function called with submissions:", submissions); // Log #9
    if (submissions.length === 0) {
        gridContainer.innerHTML = '<p>No items have been listed yet. Be the first!</p>';
        return;
    }
    gridContainer.innerHTML = ''; 
    submissions.forEach(submission => {
        const fields = submission.data; 
        if (!fields.name || !fields.imageURL) { return; }
        const card = document.createElement('div');
        card.className = 'listing-card';
        card.innerHTML = `<img src="${fields.imageURL}" alt="${fields.name}" onerror="this.onerror=null;this.src='https.via.placeholder.com/280x180?text=Image+Not+Found';"><div class="listing-card-content"><h3>${fields.name}</h3><p><strong>Category:</strong> ${fields.category || 'N/A'}</p><p>${fields.description || 'No description provided.'}</p><p><strong>Seeking:</strong> ${fields.seeking || 'Open to offers'}</p><button class="cta-btn contact-swapper-btn" data-recipient="${fields.contactEmail}" data-item="${fields.name}">Contact Swapper</button></div>`;
        gridContainer.appendChild(card);
    });
}

function openImageModal(src) { modal.style.display = 'flex'; modalImage.src = src; document.body.classList.add('modal-open'); }
function closeImageModal() { modal.style.display = 'none'; document.body.classList.remove('modal-open'); }
closeImageModalButton.addEventListener('click', closeImageModal);
imageModal.addEventListener('click', (event) => { if (event.target === imageModal) { closeImageModal(); } });

function openContactModal(recipientEmail, itemName) { recipientEmailInput.value = recipientEmail; itemNameInput.value = itemName; contactModal.style.display = 'flex'; document.body.classList.add('modal-open'); }
function closeContactModal() { contactModal.style.display = 'none'; contactForm.reset(); contactFormStatus.textContent = ''; document.body.classList.remove('modal-open'); }
gridContainer.addEventListener('click', (event) => { if (event.target.tagName === 'IMG') { openImageModal(event.target.src); } if (event.target.classList.contains('contact-swapper-btn')) { const recipient = event.target.dataset.recipient; const item = event.target.dataset.item; openContactModal(recipient, item); } });
closeContactModalButton.addEventListener('click', closeContactModal);
contactModal.addEventListener('click', (event) => { if (event.target === contactModal) { closeContactModal(); } });
contactForm.addEventListener('submit', (e) => { e.preventDefault(); contactFormStatus.textContent = 'Sending...'; const formData = new FormData(contactForm); const headers = { "Content-Type": "application/x-www-form-urlencoded" }; const body = new URLSearchParams(formData).toString(); fetch('/', { method: 'POST', headers, body }).then(() => { contactFormStatus.textContent = 'Success! Your inquiry has been sent.'; contactFormStatus.style.color = 'var(--green-accent)'; setTimeout(closeContactModal, 2000); }).catch((error) => { contactFormStatus.textContent = `Error: ${error.message}`; contactFormStatus.style.color = 'red'; }); });

console.log("Adding DOMContentLoaded event listener."); // Log #10
document.addEventListener('DOMContentLoaded', fetchListings);