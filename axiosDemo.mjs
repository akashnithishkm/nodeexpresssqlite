import axios from 'axios';

const fetchData = async () => {
  try {
    // Define the API endpoint URL
    const api = "https://apis.ccbp.in/jokes/random";

    // Make a GET request using axios
    const response = await axios.get(api);

    // Process the response data
    const data = response.data;
    console.log(data);
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
  }
};

// Call the fetchData function
fetchData();
