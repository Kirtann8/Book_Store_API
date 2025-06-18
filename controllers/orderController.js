const orderService = require('../services/orderService');

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const order = await orderService.createOrder(req.user.userId, shippingAddress, paymentMethod);
    
    if (!order) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Get All Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders(req.user.userId);

    res.json({
      success: true,
      data: orders
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.userId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Update Order Status
exports.updateOrder = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Request Headers:', req.headers);
    
    if (!req.body || !req.body.status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required in request body',
        receivedBody: req.body
      });
    }

    const { status } = req.body;
    
    const updatedOrder = await orderService.updateOrder(req.params.id, req.user.userId, status);

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (updatedOrder.error) {
      return res.status(400).json({
        success: false,
        error: updatedOrder.error
      });
    }

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (err) {
    console.error('Update Order Error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};
