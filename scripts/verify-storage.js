/**
 * Storage Configuration Verification Script
 * 
 * This script verifies that the Supabase storage is properly configured.
 * Run this in the browser console while logged in to check storage setup.
 */

(async function verifyStorage() {
  console.log('🔍 Starting Storage Configuration Verification...\n');

  try {
    // Import Supabase client (assumes it's already loaded)
    if (typeof supabase === 'undefined') {
      console.error('❌ Supabase client not found. Make sure you run this in the application context.');
      return;
    }

    // 1. Check authentication
    console.log('1️⃣ Checking authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ Not authenticated. Please log in first.');
      return;
    }
    console.log('✅ Authenticated as:', user.email);
    console.log('   User ID:', user.id);

    // 2. Check if storage buckets are accessible
    console.log('\n2️⃣ Checking storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
      return;
    }
    
    console.log('✅ Available buckets:', buckets.map(b => b.name).join(', '));
    
    // 3. Check if research-files bucket exists
    console.log('\n3️⃣ Checking research-files bucket...');
    const researchFilesBucket = buckets.find(b => b.id === 'research-files');
    
    if (!researchFilesBucket) {
      console.error('❌ research-files bucket not found!');
      console.log('💡 Solution: Create the bucket in Supabase Dashboard or run the schema.sql');
      return;
    }
    
    console.log('✅ research-files bucket exists');
    console.log('   Public:', researchFilesBucket.public);
    console.log('   Created:', researchFilesBucket.created_at);

    // 4. Test file upload
    console.log('\n4️⃣ Testing file upload...');
    const testFileName = `test-${Date.now()}.txt`;
    const testFilePath = `${user.id}/temp/${testFileName}`;
    const testFile = new File(['Test upload verification'], testFileName, { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('research-files')
      .upload(testFilePath, testFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('❌ Upload failed:', uploadError.message);
      console.log('💡 Check storage policies in Supabase Dashboard');
      return;
    }
    
    console.log('✅ File uploaded successfully');
    console.log('   Path:', uploadData.path);

    // 5. Test getting public URL
    console.log('\n5️⃣ Testing URL retrieval...');
    const { data: urlData } = supabase.storage
      .from('research-files')
      .getPublicUrl(testFilePath);
    
    if (!urlData || !urlData.publicUrl) {
      console.error('❌ Failed to get public URL');
      return;
    }
    
    console.log('✅ URL retrieved successfully');
    console.log('   URL:', urlData.publicUrl);

    // 6. Test file deletion (cleanup)
    console.log('\n6️⃣ Cleaning up test file...');
    const { error: deleteError } = await supabase.storage
      .from('research-files')
      .remove([testFilePath]);
    
    if (deleteError) {
      console.warn('⚠️  Could not delete test file:', deleteError.message);
    } else {
      console.log('✅ Test file cleaned up');
    }

    // 7. Check storage policies
    console.log('\n7️⃣ Checking storage policies...');
    const { data: policies, error: policiesError } = await supabase.rpc('get_storage_policies').catch(() => ({ data: null, error: null }));
    
    if (policies) {
      console.log('✅ Storage policies:', policies);
    } else {
      console.log('ℹ️  Could not retrieve policies (this is normal)');
    }

    // Summary
    console.log('\n✅ ============================================');
    console.log('✅ Storage Configuration Verification Complete!');
    console.log('✅ ============================================');
    console.log('\nAll checks passed! Your storage is properly configured.');
    console.log('\nYou can now:');
    console.log('  • Upload research files');
    console.log('  • Submit research papers');
    console.log('  • Download submitted files');
    
  } catch (error) {
    console.error('\n❌ Verification failed with error:');
    console.error(error);
    console.log('\n💡 Troubleshooting:');
    console.log('  1. Check that you are logged in');
    console.log('  2. Verify Supabase configuration in .env');
    console.log('  3. Ensure storage bucket is created');
    console.log('  4. Check storage policies in Supabase Dashboard');
    console.log('  5. Review docs/TROUBLESHOOTING_STORAGE.md');
  }
})();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { verifyStorage };
}

