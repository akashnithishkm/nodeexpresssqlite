import fetch from 'node-fetch';

const fetchData = async () => {
  try {
    // Define the API endpoint URL
    const api = "https://apis.ccbp.in/jokes/random";

    // Make a GET request using fetch
    const response = await fetch(api);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Parse the JSON data
    const data = await response.json();

    // Process the JSON data
    console.log(data);
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
  }
};

// Call the fetchData function
fetchData();
