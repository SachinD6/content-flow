import { z } from 'zod';

export const profileSchema = z.object({
  displayName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be 50 characters or less'),
  email: z.string().email(),
  bio: z.string()
    .max(200, 'Bio must be 200 characters or less')
    .optional()
    .or(z.literal('')),
  website: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

// Infer type from schema per Weframetech TypeScript standards
export type ProfileFormValues = z.infer<typeof profileSchema>;
