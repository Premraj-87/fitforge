const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://www.muscleandstrength.com/exercises/chest';

async function testScrape() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Find grid items for exercises
        // M&S usually has a structure like <div class="cell ..."> <div class="node-title"><a ...>
        const titles = [];
        $('.node-title a').each((i, el) => {
            titles.push($(el).text().trim());
        });

        console.log("Found Titles via .node-title a:", titles.slice(0, 5));

        if (titles.length === 0) {
            // Try another selector
            const altTitles = [];
            $('h3 a, h4 a, .exercise-name').each((i, el) => {
                altTitles.push($(el).text().trim());
            });
            console.log("Alternative Titles:", altTitles.slice(0, 5));
        }

    } catch (err) {
        console.error("Scrape Error:", err.message);
    }
}

testScrape();
