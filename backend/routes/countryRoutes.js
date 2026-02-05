const express = require('express');
const router = express.Router();
const { countryCodes } = require('../utils/countryCodes');

/**
 * @desc    Get all country codes
 * @route   GET /api/countries
 * @access  Public
 */
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        count: countryCodes.length,
        data: countryCodes
    });
});

/**
 * @desc    Get country by code
 * @route   GET /api/countries/code/:code
 * @access  Public
 */
router.get('/code/:code', (req, res) => {
    const { getCountryByCode } = require('../utils/countryCodes');
    const country = getCountryByCode(req.params.code);

    if (!country) {
        return res.status(404).json({
            success: false,
            message: 'Country not found'
        });
    }

    res.status(200).json({
        success: true,
        data: country
    });
});

module.exports = router;
