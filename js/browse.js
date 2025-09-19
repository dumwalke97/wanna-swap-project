/* File: js/browse.js */
const gridContainer = document.getElementById('browse-grid-container');

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

        // FIXED: All instances of fields.Variable have been changed to fields.variable
        card.innerHTML = `
            <a href="${fields.imageURL}" target="_blank" rel="noopener noreferrer">
                <img src="${fields.imageURL}" alt="${fields.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/280x180?text=Image+Not+Found';">
            </a>
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

document.addEventListener('DOMContentLoaded', fetchListings);