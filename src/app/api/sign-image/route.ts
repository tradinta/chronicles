
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary with your credentials
cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function POST(request: Request) {
  try {
    const timestamp = Math.round((new Date).getTime()/1000);
    const public_id = `story_image_${timestamp}`;
    
    // The `eager` parameter is sometimes added by client-side libraries.
    // Including it in the signature ensures consistency.
    const eager = "w_400,h_300,c_pad|w_260,h_200,c_crop";

    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      public_id: public_id,
      eager: eager,
    }, process.env.CLOUDINARY_API_SECRET!);

    return NextResponse.json({ signature, timestamp, public_id, eager });
  } catch (error) {
    console.error('Error signing image upload:', error);
    return NextResponse.json({ message: "Failed to sign upload" }, { status: 500 });
  }
}
