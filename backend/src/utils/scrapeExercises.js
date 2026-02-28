const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const categories = [
    { target: 'Chest', url: 'https://www.muscleandstrength.com/exercises/chest' },
    { target: 'Back', url: 'https://www.muscleandstrength.com/exercises/middle-back' },
    { target: 'Back', url: 'https://www.muscleandstrength.com/exercises/lats' },
    { target: 'Shoulders', url: 'https://www.muscleandstrength.com/exercises/shoulders' },
    { target: 'Legs', url: 'https://www.muscleandstrength.com/exercises/quads' },
    { target: 'Legs', url: 'https://www.muscleandstrength.com/exercises/hamstrings' },
    { target: 'Arms', url: 'https://www.muscleandstrength.com/exercises/biceps' },
    { target: 'Arms', url: 'https://www.muscleandstrength.com/exercises/triceps' },
    { target: 'Core', url: 'https://www.muscleandstrength.com/exercises/abs' },
];

// Helper to determine equipment based on name
function guessEquipment(name) {
    name = name.toLowerCase();
    if (name.includes('dumbbell')) return 'Dumbbell';
    if (name.includes('barbell') || name.includes('deadlift')) return 'Barbell';
    if (name.includes('machine') || name.includes('cable') || name.includes('smith')) return 'Machine/Cable';
    if (name.includes('pull-up') || name.includes('push-up') || name.includes('bodyweight') || name.includes('plank')) return 'Bodyweight';
    if (name.includes('band')) return 'Bands';
    return 'Other'; // Fallback
}

async function scrapeCategory(cat) {
    console.log(`Scraping ${cat.target} from ${cat.url}...`);
    try {
        const { data } = await axios.get(cat.url);
        const $ = cheerio.load(data);
        const exercises = [];

        $('.node-title a').each((index, element) => {
            if (index >= 12) return; // Get top 12 per category url

            const name = $(element).text().trim();
            const link = $(element).attr('href');

            if (name) {
                exercises.push({
                    name,
                    targetMuscle: cat.target,
                    equipment: guessEquipment(name),
                    link: `https://www.muscleandstrength.com${link}`,
                    defaultSets: 3,
                    defaultReps: '8-12',
                    rest: '60s-90s'
                });
            }
        });

        return exercises;
    } catch (err) {
        console.error(`Error scraping ${cat.url}:`, err.message);
        return [];
    }
}

async function runScrape() {
    let allExercises = [];
    for (const cat of categories) {
        const list = await scrapeCategory(cat);
        allExercises = allExercises.concat(list);
    }

    // De-duplicate in case of overlap between lats/middle-back, etc.
    const unique = [];
    const seen = new Set();
    for (const ex of allExercises) {
        if (!seen.has(ex.name)) {
            seen.add(ex.name);
            unique.push(ex);
        }
    }

    const dest = path.join(__dirname, '../data/exercises.json');
    fs.writeFileSync(dest, JSON.stringify(unique, null, 2));
    console.log(`\nSuccess! Wrote ${unique.length} exercises to ${dest}`);
}

runScrape();
