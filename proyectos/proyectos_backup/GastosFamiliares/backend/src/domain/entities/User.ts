export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly familyId: string | null,
    public readonly role: Role,
    public readonly password?: string
  ) {}
}
