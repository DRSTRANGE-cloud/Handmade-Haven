import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js"; 
export const confirmCOD = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }
  if (order.paymentMethod !== 'COD') {
    res.status(400)
    throw new Error('Order is not COD')
  }
  order.isPaid = false // COD is paid on delivery
  order.paymentResult = {
    id: `COD-${Date.now()}`,
    status: 'COD_CONFIRMED',
    update_time: new Date().toISOString(),
    email_address: order.user.email,
  }
  const updatedOrder = await order.save()
  res.json(updatedOrder)
})
// @desc    Mark order as delivered (Admin/Seller)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin or Seller

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  if (order.paymentMethod === 'COD' && !order.isPaid) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: `COD-${order._id}`,
      status: 'PAID_ON_DELIVERY',
      update_time: new Date().toISOString(),
    }
  }

  order.isDelivered = true
  order.deliveredAt = Date.now()

  const updatedOrder = await order.save()

  res.json(updatedOrder)
})

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        if (product.countInStock < item.qty) {
          res.status(400);
          throw new Error(`Not enough stock for ${product.name}`);
        }
        product.countInStock -= item.qty;
        await product.save();
      }
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: "desc",
  });
  res.json(orders);
});

const getOrders = asyncHandler(async (req, res) => {
  let orders;
  if (req.user.isAdminSeller) {
    orders = await Order.find({})
      .sort({ createdAt: "desc" })
      .populate("user", "id name");
    orders = orders.filter((order) => {
      const orderItems = order.orderItems.filter((product) => {
        return mongoose.Types.ObjectId(req.user.id).equals(product.sellerId);
      });

      order.orderItems = orderItems;
      return orderItems.length > 0;
    });
  } else {
    orders = await Order.find({})
      .sort({ createdAt: "desc" })
      .populate("user", "id name");
  }
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
};
