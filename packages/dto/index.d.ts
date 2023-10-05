export interface FundingRequestObject {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date;
  /**
   * 0: pending, 1: approved, 2: rejected
   */
  funding_state: number;
  reason: string | null;
  funding_request_id: number | null;
  host_id: number;
  target_value: number;
  begin_date: Date;
  end_date: Date;

  host_nickname: string;
  host_profile_image: string | null;
  host_email: string;

  meta: string | null;
  meta_parsed: {
    tags: string[];
    rewards: FundingRewardInput[];
    content_thumbnails?: string[];
    /**
     * 계좌번호. 계좌 외 다른 방식으로 지급되면 undefined
     */
    account_number?: string;
    /**
     * 증명서들.
     */
    certificate?: string[];
  } | null;
}

export interface FundingRewardInput {
  title: string;
  content: string;
  price: number;
  reward_count: number;
}

export type FundingMetaParsed = FundingRequestObject["meta_parsed"];

export interface FundingRewards {
  id: number;
  title: string;
  content: string;
  price: number;
  reward_count: number;
  reward_current_count: number;
  created_at: Date;
  deleted_at: Date | null;
}

export interface FundingObject {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  content_thumbnails: string[];
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date;
  target_value: number;
  current_value: number;
  begin_date: Date;
  end_date: Date;

  host_id: number;

  host_nickname: string;
  host_profile_image: string | null;
  host_email: string;
  host_introduction: string | null;

  interest_funding_id?: number | null;
  participated_reward_id?: number | null;

  tags: {
    id: number;
    tag: string;
  }[];
}

export interface UserObject {
  id: number;
  nickname: string;
  profile_image: string | null;
  email: string;
  email_approved: number;
  is_admin: number;
  phone: string;
  address: string;
  address_detail: string;
  password: string;
  introduction: string | null;
  created_at: Date;
  deleted_at: Date | null;
}

export interface ArticleObject {
  id: number;
  title: string;
  content: string;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date | null;
  like_count: number;
  user_id: number;
  category: string;
  view_count: number;
  related_funding_id: number | null;

  author_id: number;
  author_nickname: string;
  author_profile_image: string | null;
  author_email: string;

  like_user_id?: number | null;
  like_created_at?: Date | null;

  tags: {
    tag: string;
  }[];
}

export interface ArticleSingleObject extends ArticleObject {
  comments?: CommentObject[];
  related_funding: {
    id: number;
    title: string;
    thumbnail: string;
  } | null;
}

export interface CommentObject {
  id: number;
  content: string;
  created_at: Date;
  deleted_at: Date | null;
  updated_at: Date | null;
  user_id: number;
  nickname: string;
  profile_image: string | null;
  email: string;
}
