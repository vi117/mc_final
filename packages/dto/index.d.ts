export interface FundingRequestObject {
  id: number;
  title: string;
  /**
   * findAll() returns the content truncated to 100 characters.
   * if your content is longer than 100 characters, it will be truncated to 100.
   * findOne() returns the full content
   */
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
    account_bank_name?: string;
    /**
     * 증명서들.
     */
    certificate?: string[];
  } | null;
}

export interface FundingRewardInput {
  id?: number;
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
  funding_request_id: number;

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

export interface FundingUserObject {
  user_id: number;
  phone: string;
  address: string;
  created_at: Date;
  funding_id: number;
  reward_id: number;
  recipient: string;
  user_email: string;
  user_nickname: string;
  user_profile_image: string | null;
  reward_title: string;
  reward_price: number;
  reward_content: string;
}

export interface FundingReportObject {
  id: number;
  funding_id: number;
  user_id: number;
  /**
   * 펀딩 신고 사유
   */
  content: string;
  meta: string | null;
  created_at: Date;
  user_nickname: string;
  user_profile_image: string | null;
  user_email: string;
  /**
   * 신고된 펀딩의 제목
   */
  funding_title: string;
  funding_thumbnail: string;
  funding_begin_date: Date;
  funding_end_date: Date;

  meta_parsed: string[] | null;
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

export interface ArticleReportObject {
  id: number;
  article_title: string;
  created_at: Date;
  article_id: number;
  user_id: number;
  content: string;
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
