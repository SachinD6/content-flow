import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Use service role for database operations
    const serviceSupabase = createServiceRoleClient();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, permission } = await request.json();

    if (!email || !permission) {
      return NextResponse.json({ error: 'Email and permission required' }, { status: 400 });
    }

    // Check if user is trying to invite themselves
    const { data: ownerProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (ownerProfile?.email === email) {
      return NextResponse.json({ error: 'Cannot invite yourself' }, { status: 400 });
    }

    // Check if invitation already exists
    const { data: existingCollab } = await serviceSupabase
      .from('collaborations')
      .select('*')
      .eq('owner_id', user.id)
      .eq('collaborator_email', email)
      .in('status', ['pending', 'active'])
      .single();

    if (existingCollab) {
      return NextResponse.json({ error: 'Invitation already exists' }, { status: 400 });
    }

    // Check if the collaborator already has an account
    const { data: collaboratorProfile } = await serviceSupabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    // Create the collaboration
    const { data: collaboration, error } = await serviceSupabase
      .from('collaborations')
      .insert({
        owner_id: user.id,
        collaborator_email: email,
        collaborator_id: collaboratorProfile?.id || null,
        permission,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating collaboration:', error);
      return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
    }

    // TODO: Send email notification here
    // For now, we'll just return success

    return NextResponse.json({ 
      success: true, 
      collaboration,
      message: 'Invitation sent successfully'
    });

  } catch (error) {
    console.error('Error in invite endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use service role for database operations
    const serviceSupabase = createServiceRoleClient();

    // Get collaborations where user is the owner
    const { data: ownedCollaborations, error: ownedError } = await serviceSupabase
      .from('collaborations')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (ownedError) {
      console.error('Error fetching owned collaborations:', ownedError);
      return NextResponse.json({ error: 'Failed to fetch collaborations' }, { status: 500 });
    }

    // Get collaborations where user is the collaborator
    const { data: memberCollaborations, error: memberError } = await serviceSupabase
      .from('collaborations')
      .select('*')
      .eq('collaborator_id', user.id)
      .order('created_at', { ascending: false });

    if (memberError) {
      console.error('Error fetching member collaborations:', memberError);
      return NextResponse.json({ error: 'Failed to fetch collaborations' }, { status: 500 });
    }

    return NextResponse.json({
      owned: ownedCollaborations || [],
      member: memberCollaborations || [],
    });

  } catch (error) {
    console.error('Error in GET collaborations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
