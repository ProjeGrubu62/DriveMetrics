// ... existing code ...

const fetchVehicleImage = async (make: string, model: string, year: string) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('Google API key is not configured');
    }

    const searchQuery = `${year} ${make} ${model}`;
    const response = await fetch(
      `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=YOUR_SEARCH_ENGINE_ID&q=${searchQuery}&searchType=image&num=1`
    );

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    }
    return null;
  } catch (error) {
    console.error('Error fetching vehicle image:', error);
    return null;
  }
};

// ... existing code ...