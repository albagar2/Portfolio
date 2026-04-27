import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaUserRepository } from '../../database/PrismaUserRepository';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

const SECRET = JWT_SECRET;

export class AuthController {
  private userRepository = new PrismaUserRepository();

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.userRepository.findByEmail(email);

      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, familyId: user.familyId, role: user.role },
        SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name, familyId: user.familyId, role: user.role }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
