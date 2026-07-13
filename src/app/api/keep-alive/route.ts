import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Perform a lightweight query to register activity on the database
    const { error } = await supabase.from('classrooms').select('id').limit(1);

    if (error) {
      console.error('Keep-alive error:', error);
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase pinged successfully to prevent pausing.',
      timestamp: new Date().toISOString() 
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Unknown error' }, 
      { status: 500 }
    );
  }
}
