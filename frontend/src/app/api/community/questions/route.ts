import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id') || undefined;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || '0';
    
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    params.append('limit', limit);
    params.append('offset', offset);
    
    const response = await fetch(`${BACKEND_URL}/api/community/questions?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error fetching questions:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch questions', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error fetching questions:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...questionData } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${BACKEND_URL}/api/community/questions/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error creating question:', errorText);
      return NextResponse.json(
        { error: 'Failed to create question', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error creating question:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

