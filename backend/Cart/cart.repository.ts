import Cart from './cart.model.ts';
import mongoose from 'mongoose';

class CartRepository {


  async findByUserId(userId: string) {
    return await Cart.findOne({ userId }).lean();
  }

 
  async create(userId: string) {
    return await Cart.create({
      userId,
      items: [],
      totalAmount: 0,
    });
  }



  async addItem(userId: string, itemData: any) {
    // productId ko string me convert kra, for comparison
    const productIdStr = itemData.productId.toString();

    let cart = await Cart.findOneAndUpdate(
      { 
        userId, 
        "items.productId": itemData.productId 
      },
      { 
        $inc: { "items.$.quantity": itemData.quantity },
        $set: { isCheckingOut: false }
      },
      { new: true }
    );

    if (!cart) {

      cart = await Cart.findOneAndUpdate(
        { userId },
        { 
          $push: { items: itemData },
          $set: { isCheckingOut: false }
        },
        { 
          new: true, 
          upsert: true,
          setDefaultsOnInsert: true
        }
      );
    }

    if (cart) {
      await cart.save();
    }
    
    return cart;
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number) {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.find(
      (item: any) => item.productId.toString() === productId
    );

    if (!item) {
      throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
        // agar quantity 0 ya negative ho to item remove kr denge
      cart.items.pull({ productId });
    } else {
      item.quantity = quantity;
    }

    cart.isCheckingOut = false;
    await cart.save();
    return cart;
  }



  async removeItem(userId: string, productId: string) {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new Error('Cart not found');
    }

    // item ko remove kr denge
    cart.items.pull({ productId });
    
    cart.isCheckingOut = false;
    await cart.save();
    return cart;
  }



  async clearCart(userId: string) {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return null;
    }

    // empty the cart
    cart.items.splice(0, cart.items.length);
    cart.totalAmount = 0;
    cart.isCheckingOut = false;
    await cart.save();
    return cart;
  }

  async deleteCart(userId: string) {
    return await Cart.findOneAndDelete({ userId });
  }

  // async getItemCount(userId: string) {
  //   const cart = await Cart.findOne({ userId });
    
  //   if (!cart) {
  //     return 0;
  //   }

  //   return cart.items.reduce((total: number, item: any) => total + item.quantity, 0);
  // }

  async lockForCheckout(userId: string) {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    return await Cart.findOneAndUpdate(
      { 
        userId, 
        $or: [
          { isCheckingOut: false },
          { updatedAt: { $lt: oneMinuteAgo } }
        ],
        'items.0': { $exists: true } 
      },
      { $set: { isCheckingOut: true } },
      { new: true }
    );
  }

  async unlockCheckout(userId: string) {
    return await Cart.findOneAndUpdate(
      { userId },
      { $set: { isCheckingOut: false } },
      { new: true }
    );
  }
}

export default new CartRepository();
