import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, Role } from '../../domain/entities/User';

export class PrismaUserRepository implements IUserRepository {
  private prisma = new PrismaClient();

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return new User(user.id, user.email, user.name, user.familyId, user.role as Role, user.password);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return new User(user.id, user.email, user.name, user.familyId, user.role as Role, user.password);
  }

  async save(user: User): Promise<User> {
    const saved = await this.prisma.user.upsert({
      where: { id: user.id || 'new' },
      update: {
        email: user.email,
        name: user.name,
        password: user.password,
        familyId: user.familyId,
        role: user.role
      },
      create: {
        email: user.email,
        name: user.name,
        password: user.password!,
        familyId: user.familyId,
        role: user.role
      }
    });
    return new User(saved.id, saved.email, saved.name, saved.familyId, saved.role as Role);
  }
}
