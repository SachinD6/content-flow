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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the collaboration to check permissions
    const { data: collaborationData, error: fetchError } = await supabase
      .from('collaborations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !collaborationData) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
    }

    const collaboration = collaborationData as Collaboration;

    // Only owner can delete/revoke
    if (collaboration.owner_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Soft delete by updating status to revoked
    const { error } = await supabase
      .from('collaborations')
      .update({
        status: 'revoked',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error revoking collaboration:', error);
      return NextResponse.json({ error: 'Failed to revoke collaboration' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Collaboration revoked successfully',
    });

  } catch (error) {
    console.error('Error in DELETE collaboration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { permission } = await request.json();

    if (!permission || !['read', 'write'].includes(permission)) {
      return NextResponse.json({ error: 'Invalid permission' }, { status: 400 });
    }

    // Get the collaboration to check permissions
    const { data: collaborationData, error: fetchError } = await supabase
      .from('collaborations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !collaborationData) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
    }

    const collaboration = collaborationData as Collaboration;

    // Only owner can update permission
    if (collaboration.owner_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { data: updated, error } = await supabase
      .from('collaborations')
      .update({
        permission,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating collaboration:', error);
      return NextResponse.json({ error: 'Failed to update collaboration' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      collaboration: updated,
      message: 'Permission updated successfully',
    });

  } catch (error) {
    console.error('Error in PATCH collaboration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
