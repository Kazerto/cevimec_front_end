import {Member, MemberRole} from "./member.model";
import {Permission} from "./permission.model";

export interface AppUser {
  id: number;
  userName: string;
  password: string;
  role: MemberRole;
  permissions: Set<Permission>;
  member: Member;
}
