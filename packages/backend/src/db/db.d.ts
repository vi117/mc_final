import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface ArticleLikes {
  user_id: number;
  article_id: number;
  created_at: Generated<Date>;
}

export interface ArticleReports {
  id: Generated<number>;
  article_id: number;
  user_id: number;
  content: string;
  created_at: Generated<Date>;
}

export interface Articles {
  id: Generated<number>;
  title: string;
  content: string;
  created_at: Generated<Date>;
  deleted_at: Date | null;
  updated_at: Date | null;
  like_count: Generated<number>;
  user_id: number;
  category: string;
  view_count: Generated<number>;
  related_funding_id: number | null;
}

export interface ArticleTagRel {
  article_id: number;
  tag_id: number;
}

export interface ArticleTags {
  id: Generated<number>;
  tag: string;
}

export interface Comments {
  id: Generated<number>;
  article_id: number;
  content: string;
  created_at: Generated<Date>;
  deleted_at: Date | null;
  updated_at: Date | null;
  user_id: number;
}

export interface FundingRequests {
  id: Generated<number>;
  title: string;
  content: string;
  thumbnail: string;
  created_at: Generated<Date>;
  deleted_at: Date | null;
  updated_at: Generated<Date>;
  funding_state: Generated<number>;
  reason: string | null;
  funding_request_id: number | null;
  host_id: number;
  target_value: number;
  begin_date: Date;
  end_date: Date;
  meta: string | null;
}

export interface FundingRewards {
  id: Generated<number>;
  funding_id: number;
  title: string;
  content: string;
  price: number;
  reward_count: Generated<number>;
  reward_current_count: Generated<number>;
  created_at: Generated<Date>;
  deleted_at: Date | null;
}

export interface Fundings {
  id: Generated<number>;
  title: string;
  content: string;
  thumbnail: string;
  created_at: Generated<Date>;
  deleted_at: Date | null;
  updated_at: Generated<Date>;
  host_id: number;
  target_value: number;
  current_value: Generated<number>;
  begin_date: Date;
  end_date: Date;
  content_thumbnails: Generated<string>;
}

export interface FundingTagRel {
  funding_id: number;
  tag_id: number;
}

export interface FundingTags {
  id: Generated<number>;
  tag: string;
  tag_type: Generated<number>;
}

export interface FundingUsers {
  user_id: number;
  funding_id: number;
  reward_id: number;
  address: string;
  created_at: Generated<Date>;

  recipient: string;
  phone: string;
}

export interface UserFundingInterest {
  user_id: number;
  funding_id: number;
  created_at: Generated<Date>;
}

export interface Users {
  id: Generated<number>;
  nickname: string;
  profile_image: string | null;
  email: string;
  email_approved: Generated<number>;
  is_admin: Generated<number>;
  phone: string;
  address: string;
  password: string;
  introduction: string | null;
  created_at: Generated<Date>;
  deleted_at: Date | null;
}

export interface DB {
  article_likes: ArticleLikes;
  article_reports: ArticleReports;
  article_tag_rel: ArticleTagRel;
  article_tags: ArticleTags;
  articles: Articles;
  comments: Comments;
  funding_requests: FundingRequests;
  funding_rewards: FundingRewards;
  funding_tag_rel: FundingTagRel;
  funding_tags: FundingTags;
  funding_users: FundingUsers;
  fundings: Fundings;
  user_funding_interest: UserFundingInterest;
  users: Users;
}
