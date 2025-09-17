/* File: js/browse.js */
const gridContainer = document.getElementById('browse-grid-container');

async function fetchListings() {
    try {
        // MODIFIED: Changed "getListings" to "getlistings" to match your filename
        const response = await fetch('/.netlify/functions/getlistings');
        
        if (!response.ok) {
            throw new Error('Failed to fetch listings.');
        }

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

    gridContainer.innerHTML = ''; // Clear the "Loading..." message

    submissions.forEach(submission => {
        const fields = submission.data; // The submitted data is in the `data` property

        if (!fields.name || !fields.imageURL) {
            return;
        }

        const card = document.createElement('div');
        card.className = 'listing-card';
        card.innerHTML = `
            <img src="${fields.imageURL}" alt="${fields.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=Image+Not+Found';">
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

// Fetch listings when the page loads
document.addEventListener('DOMContentLoaded', fetchListings);