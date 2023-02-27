import { z } from 'zod'
import PrintLabelsRequestDTO from '../../../dtos/print-labels-request-dto'

const AddressSchema = z.object({
  name: z.string(),
  street: z.string(),
  houseNumber: z.string(),
  houseNumberInfo: z.string(),
  city: z.string(),
  zipCode: z.string(),
  countryIsoCode: z.string(),
  contactName: z.string(),
  contactPhone: z.string(),
  contactEmail: z.string(),
})

const OutboundParcelSchema = z.object({
  clientReference: z.string(),
  count: z.number().int().min(1).max(99),
  codAmount: z.number(),
  codReference: z.string(),
  content: z.string(),
  deliveryAddress: AddressSchema,
})

const PrintPositionSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
])

const PrinterTypeSchema = z.union([z.literal('A4_2x2'), z.literal('A4_4x1')])

const PrintLabelsRequestDTOSchema = z.object({
  parcels: z.array(OutboundParcelSchema),
  printPosition: PrintPositionSchema,
  printerType: PrinterTypeSchema,
})

export const parsePrintLabelsRequestDTO = (
  data: unknown
): PrintLabelsRequestDTO => {
  return PrintLabelsRequestDTOSchema.parse(data)
}
