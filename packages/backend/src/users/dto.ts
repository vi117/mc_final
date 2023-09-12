// import { DB } from "@/db/util.js";

export interface UserDTO {
  id: number;
  nickname: string;
  profile_image: string | null;
  email: string;
  email_approved: number;
  is_admin: number;
  phone: string;
  address: string;
  password: string;
  introduction: string | null;
  created_at: Date;
  deleted_at: Date | null;
}

export type UserInsertDTO = {
  nickname: string;
  profile_image: string | null;
  email: string;
  phone: string;
  address: string;
  password: string;
  introduction: string | null;
  deleted_at: Date | null;
};
