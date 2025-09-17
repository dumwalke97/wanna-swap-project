// File: netlify/functions/getlistings.js

const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const { NETLIFY_ACCESS_TOKEN, FORM_ID } = process.env;
    const url = `https://api.netlify.com/api/v1/forms/${FORM_ID}/submissions`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`
            }
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Failed to fetch submissions from Netlify API.' })
            };
        }

        const submissions = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(submissions)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error in function.' })
        };
    }
};