const User = require('../models/User');
const Order = require('../models/Order');

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.book');
    
    if (user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    const { shippingAddress, paymentMethod } = req.body;

    const order = new Order({
      user: user._id,
      items: user.cart,
      totalAmount: user.cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0),
      shippingAddress,
      paymentMethod,
      status: 'Placed'
    });

    await order.save();
    
    // Clear the user's cart after successful order
    user.cart = [];
    await user.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('items.book')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: populatedOrder
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
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.book')
      .sort({ createdAt: -1 });

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
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('items.book');

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
    
    // Validate status
    const validStatuses = ['Pending', 'Placed', 'Shipped', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }
    
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('items.book');

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
