/**
 * Country Codes Utility
 * List of countries with their phone codes and currency
 */

const countryCodes = [
    { country: 'Nepal', code: '+977', currency: 'NPR', symbol: 'Rs.' },
    { country: 'India', code: '+91', currency: 'INR', symbol: '₹' },
    { country: 'United States', code: '+1', currency: 'USD', symbol: '$' },
    { country: 'United Kingdom', code: '+44', currency: 'GBP', symbol: '£' },
    { country: 'China', code: '+86', currency: 'CNY', symbol: '¥' },
    { country: 'Japan', code: '+81', currency: 'JPY', symbol: '¥' },
    { country: 'Australia', code: '+61', currency: 'AUD', symbol: 'A$' },
    { country: 'Canada', code: '+1', currency: 'CAD', symbol: 'C$' },
    { country: 'Germany', code: '+49', currency: 'EUR', symbol: '€' },
    { country: 'France', code: '+33', currency: 'EUR', symbol: '€' },
    { country: 'Italy', code: '+39', currency: 'EUR', symbol: '€' },
    { country: 'Spain', code: '+34', currency: 'EUR', symbol: '€' },
    { country: 'Brazil', code: '+55', currency: 'BRL', symbol: 'R$' },
    { country: 'Russia', code: '+7', currency: 'RUB', symbol: '₽' },
    { country: 'South Korea', code: '+82', currency: 'KRW', symbol: '₩' },
    { country: 'Mexico', code: '+52', currency: 'MXN', symbol: 'Mex$' },
    { country: 'Indonesia', code: '+62', currency: 'IDR', symbol: 'Rp' },
    { country: 'Saudi Arabia', code: '+966', currency: 'SAR', symbol: 'SR' },
    { country: 'Turkey', code: '+90', currency: 'TRY', symbol: '₺' },
    { country: 'Switzerland', code: '+41', currency: 'CHF', symbol: 'Fr.' },
    { country: 'Sweden', code: '+46', currency: 'SEK', symbol: 'kr' },
    { country: 'Norway', code: '+47', currency: 'NOK', symbol: 'kr' },
    { country: 'Denmark', code: '+45', currency: 'DKK', symbol: 'kr' },
    { country: 'Poland', code: '+48', currency: 'PLN', symbol: 'zł' },
    { country: 'Thailand', code: '+66', currency: 'THB', symbol: '฿' },
    { country: 'Malaysia', code: '+60', currency: 'MYR', symbol: 'RM' },
    { country: 'Singapore', code: '+65', currency: 'SGD', symbol: 'S$' },
    { country: 'Philippines', code: '+63', currency: 'PHP', symbol: '₱' },
    { country: 'Vietnam', code: '+84', currency: 'VND', symbol: '₫' },
    { country: 'Pakistan', code: '+92', currency: 'PKR', symbol: '₨' },
    { country: 'Bangladesh', code: '+880', currency: 'BDT', symbol: '৳' },
    { country: 'Sri Lanka', code: '+94', currency: 'LKR', symbol: 'Rs.' },
    { country: 'South Africa', code: '+27', currency: 'ZAR', symbol: 'R' },
    { country: 'Nigeria', code: '+234', currency: 'NGN', symbol: '₦' },
    { country: 'Egypt', code: '+20', currency: 'EGP', symbol: 'E£' },
    { country: 'UAE', code: '+971', currency: 'AED', symbol: 'dh' },
    { country: 'New Zealand', code: '+64', currency: 'NZD', symbol: 'NZ$' },
    { country: 'Argentina', code: '+54', currency: 'ARS', symbol: '$' },
    { country: 'Chile', code: '+56', currency: 'CLP', symbol: '$' },
    { country: 'Colombia', code: '+57', currency: 'COP', symbol: '$' },
];

/**
 * Get country by code
 * @param {String} code - Phone code (e.g., '+977')
 * @returns {Object|null} - Country object or null
 */
const getCountryByCode = (code) => {
    return countryCodes.find(c => c.code === code) || null;
};

/**
 * Get country by name
 * @param {String} name - Country name
 * @returns {Object|null} - Country object or null
 */
const getCountryByName = (name) => {
    return countryCodes.find(c => c.country.toLowerCase() === name.toLowerCase()) || null;
};

/**
 * Get currency symbol
 * @param {String} currency - Currency code (e.g., 'NPR')
 * @returns {String} - Currency symbol
 */
const getCurrencySymbol = (currency) => {
    const country = countryCodes.find(c => c.currency === currency);
    return country ? country.symbol : currency;
};

/**
 * Format amount with currency
 * @param {Number} amount - Amount to format
 * @param {String} currency - Currency code (default: 'NPR')
 * @returns {String} - Formatted amount
 */
const formatCurrency = (amount, currency = 'NPR') => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol} ${amount.toLocaleString('en-NP')}`;
};

module.exports = {
    countryCodes,
    getCountryByCode,
    getCountryByName,
    getCurrencySymbol,
    formatCurrency
};
