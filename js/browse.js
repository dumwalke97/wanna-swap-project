/* File: js/browse.js */
const gridContainer = document.getElementById('browse-grid-container');

// NEW: Get modal elements from the DOM
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModalButton = document.querySelector('.modal-close');

async function fetchListings() {
    try {
        const response = await fetch('/.netlify/functions/getlistings');
        if (!response.ok) { throw new Error('Failed to fetch listings.'); }
        const data = await response.json();
        displayListings(data);
    } catch (error) {
        console.error(error);
        gridContainer.innerHTML = '<p style="color: red;">Could not load listings. Please try again later.</p>';
    }
}

function displayListings(submissions) {
    if (submissions.length === 0) {
        gridContainer.innerHTML = '<p>No items have been listed yet. Be the first!</p>';
        return;
    }

    gridContainer.innerHTML = ''; 

    submissions.forEach(submission => {
        const fields = submission.data; 

        if (!fields.name || !fields.imageURL) {
            return;
        }

        const card = document.createElement('div');
        card.className = 'listing-card';

        // MODIFIED: Removed the <a> tag. We'll handle clicks with JavaScript.
        card.innerHTML = `
            <img src="${fields.imageURL}" alt="${fields.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/280x180?text=Image+Not+Found';">
            <div class="listing-card-content">
                <h3>${fields.name}</h3>
                <p><strong>Category:</strong> ${fields.category || 'N/A'}</p>
                <p>${fields.description || 'No description provided.'}</p>
                <p><strong>Seeking:</strong> ${fields.seeking || 'Open to offers'}</p> 
                <a href="mailto:${fields.contactEmail}" class="cta-btn" style="padding: 10px 20px;">Contact Swapper</a>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// NEW: Function to open the modal
function openModal(src) {
    modal.style.display = 'flex';
    modalImage.src = src;
    document.body.classList.add('modal-open');
}

// NEW: Function to close the modal
function closeModal() {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

// NEW: Event listener for the whole grid (event delegation)
gridContainer.addEventListener('click', (event) => {
    // Check if an image inside a card was clicked
    if (event.target.tagName === 'IMG') {
        openModal(event.target.src);
    }
});

// NEW: Event listeners for closing the modal
closeModalButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
    // Close modal if the dark overlay is clicked, but not the image itself
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', fetchListings);