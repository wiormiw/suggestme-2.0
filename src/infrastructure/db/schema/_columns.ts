import { timestamp, varchar } from 'drizzle-orm/pg-core';

export const auditSchema = {
  createdAt: timestamp('created_at', { mode: 'date', precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 6, withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdBy: varchar('created_by', { length: 255 }),
};
