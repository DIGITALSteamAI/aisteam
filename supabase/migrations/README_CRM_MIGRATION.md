# CRM Module Migration Instructions

## Step 1: Run the Database Migration

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase/migrations/crm_clients_contacts.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute the migration

This will create:
- `clients` table
- `contacts` table
- Add `client_id` and `primary_contact_id` columns to `projects` table
- Create indexes and triggers
- Set up RLS policies

## Step 2: Verify Migration Success

After running the migration, verify the tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('clients', 'contacts')
ORDER BY table_name;
```

You should see both `clients` and `contacts` in the results.

## Step 3: Test the API

Once the migration is complete, you can test the CRM module:

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/crm/clients`
3. Click "Add Client" to create your first client
4. Test the full CRUD operations

## Notes

- The migration uses `IF NOT EXISTS` so it's safe to run multiple times
- The `projects` table update will only add columns if they don't exist
- All tables have RLS enabled but policies allow all access (adjust for production)

