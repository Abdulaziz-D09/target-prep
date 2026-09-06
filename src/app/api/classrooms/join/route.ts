import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const joinCode = searchParams.get('code');

    if (!joinCode) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing Supabase config' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabaseAdmin
      .from('classrooms')
      .select('*')
      .eq('join_code', joinCode.trim().toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });
    }

    return NextResponse.json({ classroom: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
