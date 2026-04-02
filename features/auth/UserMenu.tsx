"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Settings,
  LayoutDashboard,
  LogOut,
  PenLine,
  Users,
} from "lucide-react";
import { InviteUserModal } from "@/features/collaborations/InviteUserModal";

interface Collaborator {
  id: string;
  collaborator_email: string;
  permission: "read" | "write";
  status: "pending" | "active" | "revoked";
  created_at: string;
}

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  requiresAuth?: boolean;
}

interface UserMenuProps {
  user: {
    id: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
  };
  authNav?: NavItem[] | null;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "write": PenLine,
  "dashboard": LayoutDashboard,
  "settings": Settings,
  "signout": LogOut,
  "invite": Users,
  "default": PenLine,
};

const defaultAuthNav: NavItem[] = [
  { label: "Write a story", href: "/dashboard/posts/new" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Invite Collaborators", href: "#invite" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Sign out", href: "#signout" },
];

export function UserMenu({ user, authNav }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = authNav ?? defaultAuthNav;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCollaborators = async () => {
    try {
      const response = await fetch("/api/collaborations");
      if (response.ok) {
        const data = await response.json();
        setCollaborators(data.owned || []);
      }
    } catch (error) {
      console.error("Error fetching collaborators:", error);
    }
  };

  const handleSignOut = async () => {
    const response = await fetch("/api/auth/signout", { method: "POST" });
    if (response.ok) {
      window.location.href = "/";
    }
  };

  const handleItemClick = (item: NavItem) => {
    setIsOpen(false);
    if (item.href === "#invite") {
      setIsInviteModalOpen(true);
      fetchCollaborators();
    }
  };

  const displayName = user.displayName || user.email.split("@")[0];
  const initials = displayName.charAt(0).toUpperCase();

  // Group items: regular links first, then special actions
  const linkItems = navItems.filter(item => item.href !== "#invite" && item.href !== "#signout");
  const actionItems = navItems.filter(item => item.href === "#invite" || item.href === "#signout");

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 focus:outline-none cursor-pointer"
        >
          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-[#6154f0] border border-white/10 hover:border-white/30 transition-colors ">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={displayName}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-sm font-semibold text-white">
                {initials}
              </div>
            )}
          </div>
          <span className="text-sm text-zinc-300 hidden lg:block">
            {displayName}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#121319] border border-white/[0.08] shadow-xl shadow-black/50 py-2 z-50">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="text-sm font-medium text-white truncate">
                {displayName}
              </p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>

            <div className="py-1">
              {linkItems.map((item, index) => {
                const IconComponent = iconMap[item.label.toLowerCase().split(" ")[0]] || iconMap.default;
                return (
                  <Link
                    key={`${item.href}-${index}`}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                    onClick={() => handleItemClick(item)}
                  >
                    <IconComponent className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-white/[0.06] py-1">
              {actionItems.map((item, index) => {
                if (item.href === "#signout") {
                  return (
                    <button
                      key={`${item.href}-${index}`}
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                }
                if (item.href === "#invite") {
                  return (
                    <button
                      key={`${item.href}-${index}`}
                      onClick={() => handleItemClick(item)}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <Users className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </div>

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        collaborators={collaborators}
        onCollaboratorsChange={fetchCollaborators}
      />
    </>
  );
}