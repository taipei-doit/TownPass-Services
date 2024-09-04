import axios from 'axios';

export async function googleSearch(query: string) {
    try {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        const cx = import.meta.env.VITE_GOOGLE_CX;

        if (!apiKey || !cx) {
            throw new Error('Missing Google API key or Search Engine ID');
        }

        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: apiKey,
                cx: cx,
                q: query,
            },
        });

        // Handle the response data
        const data = response.data;
        console.log(data);
        return data
    } catch (error) {
        console.error('Error making the request:', error);
    }
}
