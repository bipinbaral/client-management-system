const Fuse = require('fuse.js');

/**
 * Fuzzy Search Algorithm using Fuse.js
 * Implements Levenshtein Distance for typo-tolerant search
 */

/**
 * Search clients with fuzzy matching
 * @param {Array} clients - Array of client objects
 * @param {String} query - Search query
 * @param {Object} options - Custom fuzzy search options
 * @returns {Array} - Matched clients sorted by relevance
 */
const searchClients = (clients, query, options = {}) => {
    const defaultOptions = {
        keys: [
            { name: 'name', weight: 0.5 },
            { name: 'email', weight: 0.3 },
            { name: 'phone', weight: 0.2 }
        ],
        threshold: 0.3, // 0 = exact match, 1 = match anything
        distance: 100, // Maximum distance for match
        includeScore: true,
        minMatchCharLength: 2,
        shouldSort: true,
        useExtendedSearch: true
    };

    const fuseOptions = { ...defaultOptions, ...options };
    const fuse = new Fuse(clients, fuseOptions);

    const results = fuse.search(query);

    // Return matched items with scores
    return results.map(result => ({
        ...result.item,
        matchScore: (1 - result.score).toFixed(2), // Convert to percentage (higher is better)
        relevanceScore: Math.round((1 - result.score) * 100)
    }));
};

/**
 * Search workouts with fuzzy matching
 * @param {Array} workouts - Array of workout objects
 * @param {String} query - Search query
 * @returns {Array} - Matched workouts
 */
const searchWorkouts = (workouts, query, options = {}) => {
    const defaultOptions = {
        keys: [
            { name: 'title', weight: 0.4 },
            { name: 'description', weight: 0.3 },
            { name: 'category', weight: 0.2 },
            { name: 'tags', weight: 0.1 }
        ],
        threshold: 0.4,
        includeScore: true,
        shouldSort: true
    };

    const fuseOptions = { ...defaultOptions, ...options };
    const fuse = new Fuse(workouts, fuseOptions);

    const results = fuse.search(query);

    return results.map(result => ({
        ...result.item,
        relevanceScore: Math.round((1 - result.score) * 100)
    }));
};

/**
 * Advanced multi-field search with filters
 * @param {Array} data - Data to search
 * @param {String} query - Search query
 * @param {Array} keys - Fields to search
 * @param {Object} filters - Additional filters
 * @returns {Array} - Filtered and matched results
 */
const advancedSearch = (data, query, keys, filters = {}) => {
    // First apply filters
    let filteredData = data;

    Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            if (Array.isArray(filters[key])) {
                // Array filter (e.g., goals: ['Weight Loss', 'Muscle Gain'])
                filteredData = filteredData.filter(item => {
                    if (Array.isArray(item[key])) {
                        return filters[key].some(val => item[key].includes(val));
                    }
                    return filters[key].includes(item[key]);
                });
            } else {
                // Exact match filter
                filteredData = filteredData.filter(item => item[key] === filters[key]);
            }
        }
    });

    // If no query, return filtered data
    if (!query || query.trim() === '') {
        return filteredData;
    }

    // Apply fuzzy search on filtered data
    const fuseOptions = {
        keys: keys.map(key => ({ name: key, weight: 1 / keys.length })),
        threshold: 0.3,
        includeScore: true,
        shouldSort: true
    };

    const fuse = new Fuse(filteredData, fuseOptions);
    const results = fuse.search(query);

    return results.map(result => ({
        ...result.item,
        relevanceScore: Math.round((1 - result.score) * 100)
    }));
};

/**
 * Autocomplete suggestions
 * @param {Array} data - Data source
 * @param {String} query - Partial input
 * @param {String} field - Field to search
 * @param {Number} limit - Max suggestions
 * @returns {Array} - Suggestions
 */
const autocomplete = (data, query, field = 'name', limit = 5) => {
    if (!query || query.length < 2) return [];

    const fuseOptions = {
        keys: [field],
        threshold: 0.2,
        includeScore: true,
        shouldSort: true
    };

    const fuse = new Fuse(data, fuseOptions);
    const results = fuse.search(query);

    return results.slice(0, limit).map(result => result.item[field]);
};

module.exports = {
    searchClients,
    searchWorkouts,
    advancedSearch,
    autocomplete
};
