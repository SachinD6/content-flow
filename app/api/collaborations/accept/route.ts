import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface Collaboration {
  id: string;
  owner_id: string;
  collaborator_id: string | null;
  collaborator_email: string;
  permission: 'read' | 'write';
  status: 'pending' | 'active' | 'revoked';
  created_at: string;
  updated_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { collaborationId } = await request.json();

    if (!collaborationId) {
      return NextResponse.json({ error: 'Collaboration ID required' }, { status: 400 });
    }

    // Get the collaboration
    const { data: collaborationData, error: fetchError } = await supabase
      .from('collaborations')
      .select('*')
      .eq('id', collaborationId)
      .single();

    if (fetchError || !collaborationData) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
    }

    const collaboration = collaborationData as Collaboration;

    // Check if user is the invited collaborator
    if (collaboration.collaborator_email !== user.email) {
      return NextResponse.json({ error: 'Not authorized to accept this invitation' }, { status: 403 });
    }

    // Update the collaboration to active and set the collaborator_id
    const { data: updated, error } = await supabase
      .from('collaborations')
      .update({
        status: 'active',
        collaborator_id: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', collaborationId)
      .select()
      .single();

    if (error) {
      console.error('Error accepting collaboration:', error);
      return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      collaboration: updated,
      message: 'Invitation accepted successfully',
    });

  } catch (error) {
    console.error('Error in accept endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
