import Order from './order.model.ts';
import mongoose from 'mongoose';


class OrderRepository {
    generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}-${random}`;
  }


  async create(orderData: any) {
    const orderId = this.generateOrderId();
    return await Order.create({
      ...orderData,
      orderId,
    });
  }


  async findByOrderId(orderId: string) {
    return await Order.findOne({ orderId })
      .populate('userId', 'name email')
      .lean();
  }


  //dind all orders by user
  async findByUserId(userId: string) {
    const [orders, total] = await Promise.all([
      Order.find({ userId })
        .sort({ orderDate: -1 })
        .lean(),
      Order.countDocuments({ userId }),
    ]);

    return { orders, total };
  }


  async updateStatus(orderId: string, status: string) {
    return await Order.findOneAndUpdate(
      { orderId },
      { $set: { status } },
      { new: true }
    ).lean();
  }




 //admin he kr skta hai oerder delete
  async delete(orderId: string) {
    return await Order.findOneAndDelete({ orderId }).lean();
  }

  

};


export default new OrderRepository();




