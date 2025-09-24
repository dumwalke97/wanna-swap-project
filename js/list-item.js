/* File: js/list-item.js */

// IMPORTANT: Make sure your actual Cloudinary credentials are in these lines
const CLOUDINARY_CLOUD_NAME = 'drpwtrhxp';
const CLOUDINARY_UPLOAD_PRESET = 'wanna-swap';

const form = document.getElementById('listing-form');
const statusMessage = document.getElementById('form-status');
const imageFileInput = document.getElementById('imageFile');
const hiddenImageURLInput = document.getElementById('imageURL');

// Listen for the main form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusMessage.textContent = 'Uploading image...';
    
    const imageFile = imageFileInput.files[0];
    if (!imageFile) {
        statusMessage.textContent = 'Please select an image to upload.';
        statusMessage.style.color = 'red';
        return;
    }

    try {
        const imageUrl = await uploadImageToCloudinary(imageFile);
        
        hiddenImageURLInput.value = imageUrl;

        statusMessage.textContent = 'Submitting your listing...';
        await submitFormToNetlify();

    } catch (error) {
        console.error('An error occurred:', error);
        statusMessage.textContent = `Error: ${error.message}`;
        statusMessage.style.color = 'red';
    }
});


// This function handles the direct upload to Cloudinary
async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Image upload failed.');
    }

    const data = await response.json();
    return data.secure_url; 
}

// This function handles the final submission to Netlify Forms
async function submitFormToNetlify() {
    const formData = new FormData(form);
    
    const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
    });

    if (!response.ok) {
        throw new Error('Netlify form submission failed.');
    }

    statusMessage.textContent = 'Success! Your item has been listed.';
    statusMessage.style.color = 'var(--green-accent)';
    form.reset();
    
    document.getElementById('file-name').textContent = 'No file chosen';
    document.getElementById('file-name').style.color = '#aaa';
}

// Update file name display when a file is chosen
imageFileInput.addEventListener('change', () => {
    const fileNameSpan = document.getElementById('file-name');
    if (imageFileInput.files.length > 0) {
        fileNameSpan.textContent = imageFileInput.files[0].name;
        fileNameSpan.style.color = '#fff';
    } else {
        fileNameSpan.textContent = 'No file chosen';
        fileNameSpan.style.color = '#aaa';
    }
});