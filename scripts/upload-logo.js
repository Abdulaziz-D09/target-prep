const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load env vars
const supabaseUrl = "https://wvtokhuhokehqsgbyifm.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "YOUR_SERVICE_KEY_HERE"

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function upload() {
  const filePath = path.join(__dirname, '../public/logo.jpg')
  if (!fs.existsSync(filePath)) {
    console.error("logo.jpg not found in public folder!")
    process.exit(1)
  }

  const fileBuffer = fs.readFileSync(filePath)

  console.log("Creating 'assets' bucket if it doesn't exist...")
  const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('assets', {
    public: true,
    fileSizeLimit: 5242880 // 5MB
  })

  if (bucketError && !bucketError.message.includes('already exists')) {
    console.error("Error creating bucket:", bucketError)
  } else {
    console.log("Bucket ready.")
  }

  console.log("Uploading logo.jpg to public assets bucket...")
  const { data, error } = await supabase.storage.from('assets').upload('logo.jpg', fileBuffer, {
    contentType: 'image/jpeg',
    upsert: true
  })

  if (error) {
    console.error("Upload error:", error)
    process.exit(1)
  }

  console.log("Success! File uploaded successfully.")
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/assets/logo.jpg`
  console.log("Public URL:", publicUrl)
}

upload()
