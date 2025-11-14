import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { cohortId } = resolvedParams;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id') || undefined;
    
    const queryParams = new URLSearchParams();
    if (userId) queryParams.append('user_id', userId);
    
    const response = await fetch(`${BACKEND_URL}/api/community/cohorts/${cohortId}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error fetching cohort:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch cohort', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error fetching cohort:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


