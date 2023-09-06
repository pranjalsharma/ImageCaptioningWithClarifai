// Replace 'YOUR_API_KEY' with your Clarifai API key
const apiKey = '6a57795b775b45f5a6d7ac7a9df37838';

// Get references to HTML elements
const imageInput = document.getElementById('imageInput');
const captionButton = document.getElementById('captionButton');
const uploadedImage = document.getElementById('uploadedImage');
const captionText = document.getElementById('captionText');

// Event listener for image upload
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    const imageUrl = URL.createObjectURL(file);
    uploadedImage.src = imageUrl;
});

// Event listener for the 'Get Caption' button
captionButton.addEventListener('click', () => {
    // Get the uploaded image
    const file = imageInput.files[0];
    if (!file) {
        alert('Please select an image to caption.');
        return;
    }

    // Send a request to Clarifai for image captioning
    const formData = new FormData();
    formData.append('model', 'general-v1.3');
    formData.append('inputs', JSON.stringify({ data: { image: { base64: btoa(file) } } }));

    fetch('https://api.clarifai.com/v2/models/general-v1.3/outputs', {
        method: 'POST',
        headers: {
            'Authorization': `Key ${apiKey}`,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        const caption = data.outputs[0].data.description.captions[0].text;
        captionText.textContent = `Caption: ${caption}`;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing the image.');
    });
});
