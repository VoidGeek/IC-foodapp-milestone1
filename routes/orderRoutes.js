const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

// Feedback Submission Route
router.post('/orders/:orderId/feedback', orderController.submitFeedback);

// Place Order Route
router.post('/orders/place', orderController.placeOrder);

module.exports = router;

