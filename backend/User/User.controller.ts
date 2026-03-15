import type { Request, Response } from 'express';
import userRepository from './user.repository.ts';

class UserController {
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await userRepository.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json(user);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const updatedUser = await userRepository.update(userId, { name });

      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json(updatedUser);
    } catch (error: any) {
      console.error('error aa gya user profile update krte hue:', error);
      res.status(500).json({ message: 'failed to update profile' });
    }
  };

  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const deletedUser = await userRepository.delete(userId);

      if (!deletedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({ message: 'user account is nowdeleted successfully' });
    } catch (error: any) {
      console.error('Error deleting user account:', error);
      res.status(500).json({ message: 'failed to delete account brother...' });
    }
  };
}

export default new UserController();
