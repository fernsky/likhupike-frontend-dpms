import { z } from 'zod';

export const MetaSchema = z
  .object({
    total: z.number(),
    perPage: z.number(),
    currentPage: z.number(),
    lastPage: z.number(),
    firstItem: z.number().nullable(),
    lastItem: z.number().nullable(),
    hasPages: z.boolean(),
    hasMorePages: z.boolean(),
    isEmpty: z.boolean(),
  })
  .partial();

export const createApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: dataSchema,
    meta: MetaSchema.optional(),
    timestamp: z.string(),
  });

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstItem: number | null;
    lastItem: number | null;
    hasPages: boolean;
    hasMorePages: boolean;
    isEmpty: boolean;
  };
  timestamp: string;
};
