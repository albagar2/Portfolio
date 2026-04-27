import { Property } from '../entities/Property';

export interface IPropertyRepository {
  findAllByFamily(familyId: string): Promise<Property[]>;
  save(property: Property): Promise<Property>;
  delete(id: string): Promise<void>;
}
