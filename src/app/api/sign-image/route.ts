
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary with your credentials from environment variables
cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;

    if (!paramsToSign || typeof paramsToSign !== 'object') {
        return NextResponse.json({ message: "Missing or invalid paramsToSign" }, { status: 400 });
    }
    
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!);

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Error signing image upload:', error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ message: "Failed to sign upload", error: errorMessage }, { status: 500 });
  }
}
