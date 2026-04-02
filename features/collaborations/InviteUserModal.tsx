'use client';

import { useState } from 'react';
import { Mail, Plus, X, Users, Eye, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

interface Collaborator {
  id: string;
  collaborator_email: string;
  permission: 'read' | 'write';
  status: 'pending' | 'active' | 'revoked';
  created_at: string;
}

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborators: Collaborator[];
  onCollaboratorsChange: () => void;
}

export function InviteUserModal({ isOpen, onClose, collaborators, onCollaboratorsChange }: InviteUserModalProps) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'read' | 'write'>('read');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), permission }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      toast.success('Invitation sent successfully!');
      setEmail('');
      onCollaboratorsChange();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const activeCollaborators = collaborators.filter(c => c.status !== 'revoked');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="bg-[#121319] border border-white/[0.08] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl"
        style={{ margin: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6154f0]/10 rounded-lg">
              <Users className="h-5 w-5 text-[#6154f0]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Share Access</h3>
              <p className="text-sm text-zinc-500">Invite others to collaborate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Invite Form */}
          <form onSubmit={handleInvite} className="mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0b0c10] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#6154f0]/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Permission Level
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPermission('read')}
                    className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                      permission === 'read'
                        ? 'bg-[#6154f0]/10 border-[#6154f0]/30 text-white'
                        : 'bg-[#0b0c10] border-white/[0.08] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Can View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermission('write')}
                    className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                      permission === 'write'
                        ? 'bg-[#6154f0]/10 border-[#6154f0]/30 text-white'
                        : 'bg-[#0b0c10] border-white/[0.08] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Can Edit</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6154f0] text-white text-sm font-medium rounded-lg hover:bg-[#5841e8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Collaborators List */}
          {activeCollaborators.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-zinc-400 mb-3">Collaborators</h4>
              <div className="space-y-2">
                {activeCollaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-3 bg-[#0b0c10] rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-white">{collaborator.collaborator_email}</p>
                      <p className="text-xs text-zinc-500">
                        {collaborator.status === 'pending' ? 'Pending invitation' : 'Active'}
                        {' • '}
                        {collaborator.permission === 'read' ? 'Can view' : 'Can edit'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
