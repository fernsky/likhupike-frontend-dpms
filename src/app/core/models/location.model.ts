import { z } from 'zod';

export const ProvinceSchema = z.object({
  code: z.string(),
  name: z.string().optional(),
  nameNepali: z.string().optional(),
});

export const DistrictSchema = z.object({
  code: z.string(),
  name: z.string().optional(),
  nameNepali: z.string().optional(),
});

export const MunicipalitySchema = z.object({
  code: z.string(),
  name: z.string().optional(),
  nameNepali: z.string().optional(),
});

export const WardSchema = z.object({
  wardNumber: z.number(),
});

export type Province = z.infer<typeof ProvinceSchema>;
export type District = z.infer<typeof DistrictSchema>;
export type Municipality = z.infer<typeof MunicipalitySchema>;
export type Ward = z.infer<typeof WardSchema>;

export interface LocationSearchParams {
  fields: string[];
  page?: number;
  limit?: number;
  search?: string;
  provinceCode?: string;
  districtCode?: string;
  municipalityCode?: string;
}
