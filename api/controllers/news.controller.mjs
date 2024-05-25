import { errorHandler } from "../utils/error.mjs";
import fetch from 'node-fetch';

export const news = async (req, res, next) => {
    const countries = ['in', 'us', 'gb', 'au', 'ca']; // Add more countries as needed
    const category = 'technology';
    const apiKey = 'e54dc098e56548bb93e7753bea0b4912';

    const urls = countries.map(country =>
        `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`
    );

    try {
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const data = await Promise.all(responses.map(response => response.json()));

        // Combine articles from all countries
        const combinedArticles = data.flatMap(({ articles }) => articles);

        // Shuffle the combined articles
        const shuffledArticles = shuffle(combinedArticles);

        const combinedData = {
            articles: shuffledArticles,
            status: 'ok',
            totalResults: shuffledArticles.length
        };

        res.json(combinedData);
    } catch (error) {
        console.error(error);
    }
};

// Function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
