/**
 * Analytics Algorithms - Statistical functions for data analysis
 * Includes moving averages, linear regression, and trend analysis
 */

/**
 * Calculate Simple Moving Average (SMA)
 * @param {Array} data - Array of numbers
 * @param {Number} window - Window size
 * @returns {Array} - Moving averages
 */
const simpleMovingAverage = (data, window = 7) => {
    if (data.length < window) return data;

    const result = [];
    for (let i = 0; i < data.length; i++) {
        if (i < window - 1) {
            result.push(null);
        } else {
            const subset = data.slice(i - window + 1, i + 1);
            const average = subset.reduce((a, b) => a + b, 0) / window;
            result.push(Math.round(average * 100) / 100);
        }
    }
    return result;
};

/**
 * Calculate Exponential Moving Average (EMA)
 * @param {Array} data - Array of numbers
 * @param {Number} window - Window size
 * @returns {Array} - Exponential moving averages
 */
const exponentialMovingAverage = (data, window = 7) => {
    if (data.length === 0) return [];

    const multiplier = 2 / (window + 1);
    const result = [data[0]];

    for (let i = 1; i < data.length; i++) {
        const ema = (data[i] * multiplier) + (result[i - 1] * (1 - multiplier));
        result.push(Math.round(ema * 100) / 100);
    }

    return result;
};

/**
 * Calculate linear regression for trend prediction
 * @param {Array} data - Array of {x, y} points or just y values
 * @returns {Object} - {slope, intercept, predict}
 */
const linearRegression = (data) => {
    let points = data;

    // If data is array of numbers, convert to {x, y} format
    if (typeof data[0] === 'number') {
        points = data.map((y, x) => ({ x, y }));
    }

    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    points.forEach(point => {
        sumX += point.x;
        sumY += point.y;
        sumXY += point.x * point.y;
        sumXX += point.x * point.x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return {
        slope: Math.round(slope * 100) / 100,
        intercept: Math.round(intercept * 100) / 100,
        predict: (x) => slope * x + intercept,
        equation: `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`
    };
};

/**
 * Calculate standard deviation
 * @param {Array} data - Array of numbers
 * @returns {Number} - Standard deviation
 */
const standardDeviation = (data) => {
    if (data.length === 0) return 0;

    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const squaredDiffs = data.map(value => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;

    return Math.sqrt(variance);
};

/**
 * Calculate percentile
 * @param {Array} data - Array of numbers
 * @param {Number} percentile - Percentile to calculate (0-100)
 * @returns {Number} - Value at percentile
 */
const calculatePercentile = (data, percentile) => {
    if (data.length === 0) return 0;

    const sorted = [...data].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    if (lower === upper) return sorted[lower];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

/**
 * Calculate growth rate (percentage change)
 * @param {Number} oldValue - Previous value
 * @param {Number} newValue - Current value
 * @returns {Number} - Growth rate percentage
 */
const growthRate = (oldValue, newValue) => {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return Math.round(((newValue - oldValue) / oldValue) * 10000) / 100;
};

/**
 * Forecast future values using linear regression
 * @param {Array} historicalData - Historical data points
 * @param {Number} periodsAhead - Number of periods to forecast
 * @returns {Array} - Forecasted values
 */
const forecast = (historicalData, periodsAhead = 7) => {
    const regression = linearRegression(historicalData);
    const forecast = [];

    for (let i = 1; i <= periodsAhead; i++) {
        const nextIndex = historicalData.length + i;
        const predictedValue = regression.predict(nextIndex);
        forecast.push(Math.max(0, Math.round(predictedValue * 100) / 100));
    }

    return forecast;
};

/**
 * Calculate revenue trends
 * @param {Array} payments - Payment records with amount and date
 * @param {Number} window - Window for moving average
 * @returns {Object} - Trend analysis
 */
const analyzeRevenueTrend = (payments, window = 7) => {
    if (payments.length === 0) {
        return {
            totalRevenue: 0,
            averagePayment: 0,
            trend: 'stable',
            growthRate: 0,
            movingAverage: [],
            forecast: []
        };
    }

    // Sort by date
    const sorted = payments.sort((a, b) => new Date(a.paidDate) - new Date(b.paidDate));

    // Extract amounts
    const amounts = sorted.map(p => p.finalAmount || p.amount);

    // Calculate statistics
    const totalRevenue = amounts.reduce((a, b) => a + b, 0);
    const averagePayment = totalRevenue / amounts.length;

    // Calculate moving average
    const movAvg = simpleMovingAverage(amounts, Math.min(window, amounts.length));

    // Determine trend
    const recentData = amounts.slice(-window);
    const regression = linearRegression(recentData);
    let trend = 'stable';
    if (regression.slope > 0.5) trend = 'increasing';
    if (regression.slope < -0.5) trend = 'decreasing';

    // Calculate growth rate (comparing recent vs older periods)
    const halfWay = Math.floor(amounts.length / 2);
    const firstHalfAvg = amounts.slice(0, halfWay).reduce((a, b) => a + b, 0) / halfWay || 1;
    const secondHalfAvg = amounts.slice(halfWay).reduce((a, b) => a + b, 0) / (amounts.length - halfWay) || 0;
    const growth = growthRate(firstHalfAvg, secondHalfAvg);

    // Forecast next 7 days
    const forecastValues = forecast(amounts, 7);

    return {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averagePayment: Math.round(averagePayment * 100) / 100,
        trend,
        trendSlope: regression.slope,
        growthRate: growth,
        movingAverage: movAvg,
        forecast: forecastValues,
        standardDeviation: Math.round(standardDeviation(amounts) * 100) / 100
    };
};

/**
 * Calculate client activity distribution
 * @param {Array} clients - Client records
 * @returns {Object} - Activity distribution
 */
const analyzeClientActivity = (clients) => {
    const activityScores = clients.map(client =>
        typeof client.calculateActivityScore === 'function'
            ? client.calculateActivityScore()
            : 50
    );

    const distributions = {
        veryActive: activityScores.filter(score => score >= 80).length,
        active: activityScores.filter(score => score >= 60 && score < 80).length,
        moderate: activityScores.filter(score => score >= 40 && score < 60).length,
        low: activityScores.filter(score => score >= 20 && score < 40).length,
        inactive: activityScores.filter(score => score < 20).length
    };

    const total = clients.length || 1;

    return {
        distributions,
        percentages: {
            veryActive: Math.round((distributions.veryActive / total) * 100),
            active: Math.round((distributions.active / total) * 100),
            moderate: Math.round((distributions.moderate / total) * 100),
            low: Math.round((distributions.low / total) * 100),
            inactive: Math.round((distributions.inactive / total) * 100)
        },
        averageScore: Math.round(activityScores.reduce((a, b) => a + b, 0) / total),
        medianScore: calculatePercentile(activityScores, 50),
        p90Score: calculatePercentile(activityScores, 90),
        p10Score: calculatePercentile(activityScores, 10)
    };
};

module.exports = {
    simpleMovingAverage,
    exponentialMovingAverage,
    linearRegression,
    standardDeviation,
    calculatePercentile,
    growthRate,
    forecast,
    analyzeRevenueTrend,
    analyzeClientActivity
};
