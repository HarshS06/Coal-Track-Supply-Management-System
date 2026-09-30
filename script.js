// Function to fetch data from a REST API endpoint
async function loadDashboardData(apiEndpoint) {
    try {
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Successfully fetched data:", data);
        return data;
    } catch (error) {
        console.error("Failed to load data:", error.message);
        // Display user-friendly error fallback in UI
    }
}