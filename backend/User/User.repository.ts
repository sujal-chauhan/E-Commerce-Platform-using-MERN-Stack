import User from "./user.model.ts";

class UserRepository {
  async findById(userId: string) {
    return await User.findById(userId).select('-__v');
  }

  async update(userId: string, data: { name: string }) {
    return await User.findByIdAndUpdate(
      userId,
      { name: data.name },
      { new: true }
    ).select('-__v');
  }

  async delete(userId: string) {
    return await User.findByIdAndDelete(userId);
  }
}

export default new UserRepository();
