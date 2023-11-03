import axios from 'axios';

function send(data) {
    // Encode the title for use in the  URL
    const encodedTitle = encodeURIComponent(data.title);

    const urlPost = `https://dweet.io/dweet/for/${encodedTitle}`
    const urlGet = `https://dweet.io/get/latest/dweet/for/${encodedTitle}`
    console.log(urlPost + "\n" + urlGet);

    return axios.post(urlPost, data)
        .then((response) => {
            console.log('Data published successfully.');
            console.log('Dweet.io Response:', response.data);
            return urlGet;
        })
        .catch((error) => {
            console.error('Error publishing data to Dweet.io:', error);
            throw error; // Re-throw the error for handling at the caller's level
        });
}

// Test data
const testData = {
    title: "Bananer eller epler",
    Votes: 5,
    owner: "Torje",
    double: 2.4
};

send(testData)
    .then((url) => {
        console.log('Retrieval URL:', url);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
