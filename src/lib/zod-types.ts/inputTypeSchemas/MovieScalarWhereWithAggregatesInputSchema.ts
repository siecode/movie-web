import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { StringWithAggregatesFilterSchema } from './StringWithAggregatesFilterSchema';
import { StringNullableWithAggregatesFilterSchema } from './StringNullableWithAggregatesFilterSchema';

export const MovieScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MovieScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MovieScalarWhereWithAggregatesInputSchema),z.lazy(() => MovieScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MovieScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MovieScalarWhereWithAggregatesInputSchema),z.lazy(() => MovieScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  uuid: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  thumbnailUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export default MovieScalarWhereWithAggregatesInputSchema;