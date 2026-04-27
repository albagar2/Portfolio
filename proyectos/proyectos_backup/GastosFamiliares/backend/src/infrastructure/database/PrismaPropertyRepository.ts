import { PrismaClient } from '@prisma/client';
import { IPropertyRepository } from '../../domain/repositories/IPropertyRepository';
import { Property } from '../../domain/entities/Property';

export class PrismaPropertyRepository implements IPropertyRepository {
  private prisma = new PrismaClient();

  async findAllByFamily(familyId: string): Promise<Property[]> {
    const properties = await this.prisma.property.findMany({
      where: { familyId }
    });
    return properties.map(p => new Property(p.id, p.name, p.familyId, p.address || undefined, p.createdAt));
  }

  async save(property: Property): Promise<Property> {
    const saved = await this.prisma.property.create({
      data: {
        name: property.name,
        address: property.address,
        familyId: property.familyId
      }
    });
    return new Property(saved.id, saved.name, saved.familyId, saved.address || undefined, saved.createdAt);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.property.delete({ where: { id } });
  }
}
