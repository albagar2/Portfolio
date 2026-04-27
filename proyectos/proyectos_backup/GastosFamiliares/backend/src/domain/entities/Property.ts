export class Property {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly familyId: string,
    public readonly address?: string,
    public readonly createdAt?: Date
  ) {}
}
