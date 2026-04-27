export enum Category {
  VIVIENDA = 'VIVIENDA',
  SUMINISTROS = 'SUMINISTROS',
  ALIMENTACION_LIMPIEZA = 'ALIMENTACION_LIMPIEZA',
  EDUCACION_EXTRAESCOLARES = 'EDUCACION_EXTRAESCOLARES',
  SEGUROS = 'SEGUROS',
  TRANSPORTE_COMBUSTIBLE = 'TRANSPORTE_COMBUSTIBLE',
  SALUD_FARMACIA = 'SALUD_FARMACIA',
  OCIO_SUSCRIPCIONES = 'OCIO_SUSCRIPCIONES',
  GASTOS_HORMIGA = 'GASTOS_HORMIGA',
  FONDO_EMERGENCIA = 'FONDO_EMERGENCIA',
  // Nuevas categorías basadas en propiedades
  CALERA_43 = 'CALERA 43',
  CALERA_14 = 'CALERA 14',
  MALAGA = 'MALAGA',
  MIJAS = 'MIJAS',
  LUCENA = 'LUCENA',
  TETUAN_5 = 'TETUÁN 5',
  SCENI = 'SCENI',
  GASOIL_IBI = 'GASOIL / IBI',
  COMIDA_HOGAR = 'COMIDA/HOGAR'
}

export class Expense {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly description: string,
    public readonly category: Category,
    public readonly date: Date,
    public readonly userId: string,
    public readonly familyId: string,
    public readonly dueDate?: Date,
    public readonly receiptUrl?: string,
    public readonly isRecurring: boolean = false,
    public readonly interval?: string,
    public readonly propertyId?: string,
    public readonly paymentMethodId?: string
  ) {}
}
