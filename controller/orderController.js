const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });
const Order = require('../models/order');

// Feedback Submission
exports.submitFeedback = async (req, res) => {
  try {
    const { rating } = req.body;
    const orderId = req.params.orderId;

    // Handle file uploads (image and text)
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'text', maxCount: 1 }])(req, res, async function (err) {
      if (err) {
        console.error('File upload error:', err);
        return res.status(500).json({ error: 'File upload error' });
      }

      const imageLink = req.files['image'] ? req.files['image'][0].path : null; // Get path to uploaded image
      const textFile = req.files['text'] ? req.files['text'][0] : null; // Get uploaded text file

      let fileData = null;
      if (textFile) {
        // Extract text data from text file
        fileData = await extractTextFromFile(textFile);
      }

      // Update order with feedback data
      const updatedOrder = await Order.findByIdAndUpdate(orderId, {
        rating,
        imageLink,
        fileData,
        updatedAt: new Date()
      }, { new: true });

      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({ success: true, message: 'Feedback submitted successfully', updatedOrder });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { userId, foodId, paymentMode, quantity } = req.body;
    const orderId = generateOrderId(); // Implement this function to generate a unique ID

    const newOrder = new Order({
      userId,
      foodId,
      paymentMode,
      quantity,
      orderId,
      status: 'pending'
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to extract text from a file
async function extractTextFromFile(file) {
  try {
    const text = fs.readFileSync(file.path, 'utf-8');
    return text;
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Error extracting text from file');
  }
}

// Function to generate a unique order ID
function generateOrderId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}
