import { UserInfo } from "@/types/UserInfo";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

export function getUserInfo(
  getUser: () => KindeUser<Record<string, string>> | null
): UserInfo {
  const user = getUser();
  const userInfo: UserInfo = {
    email: user?.email || "",
    name: user?.given_name + " " + user?.family_name,
  };
  return userInfo;
}
