// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'b2838349b7dc4081820729745aff7cfc';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'salesforce';       
const APP_ID = 'blip';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'general-english-image-caption-blip-2';
const MODEL_VERSION_ID = '71cb98f572694e28a99fa8fa86aaa825';

const imageUrlInput = document.getElementById('imageUrlInput');

// Function to send a request to Clarifai Blip model
function getBlipCaption(imageUrl) {
    // const imageUrl = 'https://samples.clarifai.com/metro-north.jpg';
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": imageUrl
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT,
            'Content-Type': 'application/json' // Specify content type
        },
        body: raw
    };

    // Send a request to the Clarifai Blip model
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => {
            // response.json();
            response.json().then((jsonResponse) => {
                displayBlipCaption(jsonResponse);
            })
        }) // Parse response as JSON
        .then(result => {
            // console.log(result.text());
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while processing the image.');
        });
}

// Function to display the Blip caption
function displayBlipCaption(response) {
    // Check if the response contains outputs
    console.log(response);
    if (response && response.outputs && response.outputs.length > 0) {
        // Extract the raw caption text from the response
        const captionText = response.outputs[0].data.text.raw;

        // Display the caption on your web app
        const captionElement = document.getElementById('captionText');
        captionElement.textContent = `Blip Caption: ${captionText}`;
    } else {
        // Handle the case when the response does not contain valid data
        alert('Unable to retrieve the Blip caption.');
    }
}

// Event listener for the input field when a file is selected
// const imageInput = document.getElementById('imageInput');
// imageInput.addEventListener('change', () => {
//     const file = imageInput.files[0];
//     if (file) {
//         const imageUrl = URL.createObjectURL(file);
//         document.getElementById('uploadedImage').src = imageUrl;
//     }
// });

// Event listener for the "Get Blip Caption" button
const getCaptionButton = document.getElementById('captionButton');
getCaptionButton.addEventListener('click', () => {
    // const file = imageInput.files[0];

    // if (file) {
    //     // Convert the uploaded image to a URL
    //     const imageUrl = URL.createObjectURL(file);
    //     // Now, you can use this imageUrl with the Clarifai API
    //     getBlipCaption();
    // } else {
    //     alert('Please select an image to caption.');
    // }

    const imageUrl = imageUrlInput.value.trim();

    // Check if the URL is empty
    if (!imageUrl) {
        alert('Please enter a valid image URL.');
        return;
    }

    document.getElementById('uploadedImage').src = imageUrl;

    // Call a function to send the image URL to Clarifai for caption generation
    getBlipCaption(imageUrl);
});
