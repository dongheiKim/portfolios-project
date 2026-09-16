import { Link } from "react-router";
import { User as UserIcon } from "lucide-react";
import type { User } from "../model/userTypes";

interface UserBadgeProps {
  user: User | null;
  to?: string;
}

export function UserBadge({ user, to = "/orders" }: UserBadgeProps) {
  if (user) {
    return (
      <Link
        to={to}
        className="flex items-center gap-1.5 text-sm text-[#334155] transition-colors hover:text-[#346aff]"
      >
        <UserIcon size={18} className="text-[#346aff]" />
        <span className="hidden md:inline">{user.name}님</span>
      </Link>
    );
  }

  return (
    <Link
      to="/login"
      className="flex items-center gap-1.5 text-sm text-[#334155] transition-colors hover:text-[#346aff]"
    >
      <UserIcon size={18} className="text-[#346aff]" />
      <span className="hidden md:inline">로그인</span>
    </Link>
  );
}
