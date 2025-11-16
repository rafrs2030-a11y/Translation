/**
 * Script to create users in Supabase Auth
 * This syncs the users from public.users table to auth.users
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const users = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@arabresearch.com',
    password: 'Admin@123',
    role: 'admin',
    user_metadata: {
      username: 'admin'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'ahmad@example.com',
    password: 'Test@123',
    role: 'researcher',
    user_metadata: {
      username: 'ahmad_mohammed'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'fatima@example.com',
    password: 'Test@123',
    role: 'researcher',
    user_metadata: {
      username: 'fatima_ali'
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'mohammed@example.com',
    password: 'Test@123',
    role: 'researcher',
    user_metadata: {
      username: 'mohammed_hassan'
    }
  }
];

async function createAuthUsers() {
  console.log('🔐 Creating users in Supabase Auth...\n');

  for (const user of users) {
    try {
      // Create user using admin API
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: user.user_metadata
      });

      if (error) {
        console.error(`❌ Failed to create user ${user.email}:`, error.message);
      } else {
        console.log(`✅ Created user: ${user.email} (Role: ${user.role})`);
      }
    } catch (err) {
      console.error(`❌ Error creating user ${user.email}:`, err.message);
    }
  }

  console.log('\n✨ Done!');
}

createAuthUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

