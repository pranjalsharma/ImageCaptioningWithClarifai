// Your PAT (Personal Access Token) can be found in the portal under Authentication
const PAT = 'b2838349b7dc4081820729745aff7cfc';
const MODEL_ID = 'general-english-image-caption-blip-2';

// Function to send a request to Clarifai Blip model
function getBlipCaption(imageFile) {
    const formData = new FormData();
    formData.append('model', MODEL_ID);
    formData.append('inputs', JSON.stringify({ data: { image: { base64: btoa(imageFile) } } }));

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Key ' + PAT,
        },
        body: formData
    };

    // Send a request to the Clarifai Blip model
    fetch('https://api.clarifai.com/v2/models/' + MODEL_ID + '/outputs', requestOptions)
        .then(response => response.json())
        .then(result => {
            // Handle the response here
            displayBlipCaption(result);
        })
        .catch(error => console.error('error', error));
}

// Function to display the Blip caption
function displayBlipCaption(data) {
    if (data && data.json && data.json.data && data.json.data.text && data.json.data.text.raw) {
        const caption = data.json.data.text.raw;
        const captionText = document.getElementById('captionText');
        captionText.textContent = `Blip Caption: ${caption}`;
    } else {
        console.error('Invalid API response:', data);
        alert('Invalid response from the API. Please try again later.');
    }
}

// Event listener for the input field when a file is selected
const imageInput = document.getElementById('imageInput');
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        document.getElementById('uploadedImage').src = imageUrl;
    }
});

// Event listener for the "Get Blip Caption" button
const getCaptionButton = document.getElementById('captionButton');
getCaptionButton.addEventListener('click', () => {
    const file = imageInput.files[0];
    if (file) {
        getBlipCaption(file);
    } else {
        alert('Please select an image to caption.');
    }
});
