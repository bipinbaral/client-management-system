/**
 * Recommendation Engine using K-Nearest Neighbors (KNN) Algorithm
 * Used for finding similar clients and recommending workouts
 */

/**
 * Calculate Euclidean distance between two clients
 * @param {Object} client1 - First client
 * @param {Object} client2 - Second client
 * @returns {Number} - Distance score (lower is more similar)
 */
const calculateClientSimilarity = (client1, client2) => {
    let distance = 0;

    // Age similarity (normalized to 0-1 range, assuming age 10-100)
    const ageDiff = Math.abs((client1.age || 30) - (client2.age || 30)) / 90;
    distance += ageDiff * ageDiff * 0.2; // 20% weight

    // Fitness level similarity (exact match = 0, different = 1)
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    const level1Index = levels.indexOf(client1.fitnessLevel || 'Beginner');
    const level2Index = levels.indexOf(client2.fitnessLevel || 'Beginner');
    const levelDiff = Math.abs(level1Index - level2Index) / 2; // 0 to 1
    distance += levelDiff * levelDiff * 0.4; // 40% weight

    // Goals similarity (Jaccard similarity)
    const goals1 = client1.goals || [];
    const goals2 = client2.goals || [];
    const intersection = goals1.filter(goal => goals2.includes(goal)).length;
    const union = new Set([...goals1, ...goals2]).size;
    const goalsSimilarity = union > 0 ? 1 - (intersection / union) : 1;
    distance += goalsSimilarity * goalsSimilarity * 0.3; // 30% weight

    // BMI similarity (if available)
    if (client1.height && client1.weight && client2.height && client2.weight) {
        const bmi1 = client1.weight / Math.pow(client1.height / 100, 2);
        const bmi2 = client2.weight / Math.pow(client2.height / 100, 2);
        const bmiDiff = Math.abs(bmi1 - bmi2) / 40; // Normalize (assuming BMI 15-55)
        distance += bmiDiff * bmiDiff * 0.1; // 10% weight
    }

    return Math.sqrt(distance);
};

/**
 * Find K nearest neighbors (similar clients)
 * @param {Object} targetClient - Client to find similar clients for
 * @param {Array} allClients - All clients in database
 * @param {Number} k - Number of neighbors to find
 * @returns {Array} - K most similar clients
 */
const findSimilarClients = (targetClient, allClients, k = 5) => {
    // Calculate similarity scores for all clients
    const similarities = allClients
        .filter(client => client._id.toString() !== targetClient._id.toString())
        .map(client => ({
            client: client,
            similarity: calculateClientSimilarity(targetClient, client),
            similarityScore: Math.round((1 - calculateClientSimilarity(targetClient, client)) * 100)
        }))
        .sort((a, b) => a.similarity - b.similarity) // Lower distance = more similar
        .slice(0, k);

    return similarities;
};

/**
 * Recommend workouts based on similar clients (Collaborative Filtering)
 * @param {Object} targetClient - Client to recommend workouts for
 * @param {Array} allClients - All clients
 * @param {Array} allWorkouts - All workouts
 * @param {Number} limit - Max recommendations
 * @returns {Array} - Recommended workouts
 */
const recommendWorkoutsCollaborative = async (targetClient, allClients, allWorkouts, limit = 5) => {
    // Find similar clients
    const similarClients = findSimilarClients(targetClient, allClients, 5);

    if (similarClients.length === 0) {
        // Fallback: recommend popular workouts for their fitness level
        return recommendWorkoutsContentBased(targetClient, allWorkouts, limit);
    }

    // Aggregate workouts from similar clients (would need workout history in real implementation)
    // For now, return content-based recommendations
    return recommendWorkoutsContentBased(targetClient, allWorkouts, limit);
};

/**
 * Recommend workouts based on client attributes (Content-Based Filtering)
 * @param {Object} client - Client to recommend for
 * @param {Array} workouts - All available workouts
 * @param {Number} limit - Max recommendations
 * @returns {Array} - Recommended workouts
 */
const recommendWorkoutsContentBased = (client, workouts, limit = 5) => {
    const clientFitnessLevel = client.fitnessLevel || 'Beginner';
    const clientGoals = client.goals || [];

    // Goal to category mapping
    const goalToCategoryMap = {
        'Weight Loss': ['Cardio', 'HIIT'],
        'Muscle Gain': ['Strength', 'CrossFit'],
        'Endurance': ['Cardio', 'HIIT'],
        'Flexibility': ['Yoga', 'Flexibility'],
        'General Fitness': ['Cardio', 'Strength', 'HIIT'],
        'Athletic Performance': ['HIIT', 'CrossFit', 'Sports']
    };

    // Calculate score for each workout
    const scoredWorkouts = workouts
        .filter(workout => workout.isActive !== false)
        .map(workout => {
            let score = 0;

            // Fitness level match (exact match gets high score)
            if (workout.difficulty === clientFitnessLevel) {
                score += 40;
            } else {
                const levels = ['Beginner', 'Intermediate', 'Advanced'];
                const workoutLevelIndex = levels.indexOf(workout.difficulty);
                const clientLevelIndex = levels.indexOf(clientFitnessLevel);
                const levelDiff = Math.abs(workoutLevelIndex - clientLevelIndex);

                if (levelDiff === 1) score += 20; // One level away
                // Two levels away gets 0 points
            }

            // Category match with client goals
            clientGoals.forEach(goal => {
                const preferredCategories = goalToCategoryMap[goal] || [];
                if (preferredCategories.includes(workout.category)) {
                    score += 30;
                }
            });

            // Popularity boost
            const popularityScore = Math.min(workout.popularity || 0, 20);
            score += popularityScore;

            // Rating boost
            const ratingScore = (parseFloat(workout.averageRating || 0) || 0) * 2;
            score += ratingScore;

            return {
                workout: workout,
                score: score,
                reasons: {
                    levelMatch: workout.difficulty === clientFitnessLevel,
                    goalsMatch: clientGoals.some(goal =>
                        (goalToCategoryMap[goal] || []).includes(workout.category)
                    ),
                    popularity: workout.popularity || 0,
                    rating: workout.averageRating || 0
                }
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return scoredWorkouts.map(item => ({
        ...item.workout.toObject(),
        recommendationScore: Math.round(item.score),
        recommendationReasons: item.reasons
    }));
};

/**
 * Hybrid recommendation (combines collaborative and content-based)
 * @param {Object} targetClient - Client to recommend for
 * @param {Array} allClients - All clients
 * @param {Array} allWorkouts - All workouts
 * @param {Number} limit - Max recommendations
 * @returns {Array} - Recommended workouts
 */
const recommendWorkoutsHybrid = async (targetClient, allClients, allWorkouts, limit = 5) => {
    // Get content-based recommendations
    const contentBased = recommendWorkoutsContentBased(targetClient, allWorkouts, limit * 2);

    // Get similar clients
    const similarClients = findSimilarClients(targetClient, allClients, 3);

    // Boost scores for workouts that similar clients have (if we had workout history)
    // For now, return content-based with similarity info

    return contentBased.slice(0, limit).map(workout => ({
        ...workout,
        similarClientsCount: similarClients.length
    }));
};

/**
 * Get client match percentage
 * @param {Object} client1 - First client
 * @param {Object} client2 - Second client
 * @returns {Number} - Match percentage (0-100)
 */
const getClientMatchPercentage = (client1, client2) => {
    const similarity = calculateClientSimilarity(client1, client2);
    return Math.round((1 - similarity) * 100);
};

module.exports = {
    findSimilarClients,
    recommendWorkoutsCollaborative,
    recommendWorkoutsContentBased,
    recommendWorkoutsHybrid,
    getClientMatchPercentage,
    calculateClientSimilarity
};
