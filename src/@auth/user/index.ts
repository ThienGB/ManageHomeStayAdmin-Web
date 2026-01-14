import { FuseAuthUser } from "@fuse/core/FuseAuthProvider/types/FuseAuthUser";
import { FuseSettingsConfigType } from "@fuse/core/FuseSettings/FuseSettings";
import { PartialDeep } from "type-fest";

/**
 * The type definition for a user object.
 */
export type User = FuseAuthUser & {
  id: string;
  role: string[] | string;
  name: string;
  gender ?: string;
  photoURL?: string;
  email?: string;
  shortcuts?: string[];
  settings?: PartialDeep<FuseSettingsConfigType>;
  loginRedirectUrl?: string; // The URL to redirect to after login.
};
