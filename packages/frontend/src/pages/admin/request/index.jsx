import clsx from "clsx";
import { Button, Carousel, ListGroup } from "react-bootstrap";
import { Container } from "../../../component/Container";
import { formatDate } from "../../../util/date";
import { isPSApprovedTag } from "../../../util/tag";
import Profileimg from "../../community/assets/user.png";
import classes from "./index.module.css";

import { NavLink, useParams } from "react-router-dom";
import { useFundingRequestById } from "../../../hook/useFundingRequestById";

export default function FundingRequestDetailPage() {
  const params = useParams();
  const id = parseInt(params.id);
  const { data, error, isLoading } = useFundingRequestById(id);
  console.log("id", id);

  if (isLoading) {
    return (
      <Container>
        <div>로딩 중 입니다.</div>
      </Container>
    );
  }

  if (error) {
    return <Container>에러 {error.message}</Container>;
  }

  const funding = data;
  return (
    <Container>
      <div className={classes["funding_title"]}>
        <ul className={classes["funding_detail_tags"]}>
          {funding.meta_parsed.tags.map((tag) => (
            <li
              key={tag.id}
              className={clsx({
                [classes["funding_detail_tags_ps_approved"]]: isPSApprovedTag(
                  tag,
                ),
              })}
            >
              #{tag}
            </li>
          ))}
        </ul>
        <h1>{funding.title}</h1>
      </div>

      <div className={classes["funding_detail_profilearea"]}>
        <Carousel
          fade
          className={classes["funding_thumbnail_carousel"]}
        >
          {funding.meta_parsed.content_thumbnails.map((thumbnail) => (
            <Carousel.Item key={thumbnail}>
              <img
                src={thumbnail}
                className={classes["carousel_thumbnail"]}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <div className={classes["funding_detail_description"]}>
          <table className={classes["funding_profile_table"]}>
            <tbody>
              <tr>
                <td className={classes["funding_table_bold"]}>목표금액</td>
                <td>{funding.target_value.toLocaleString()}원</td>
              </tr>
              <tr>
                <td className={classes["funding_table_bold"]}>펀딩기간</td>
                <td>
                  {formatDate(funding.begin_date)} ~{" "}
                  {formatDate(funding.end_date)}
                </td>
              </tr>
            </tbody>
          </table>

          <NavLink to={`/host-profile/${funding.host_id}`}>
            <div className={classes["funding_host_profile"]}>
              <div>
                <div>
                  <h4 className={classes["funding_host_profile_h4"]}>
                    창작자 소개
                  </h4>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    // TODO(vi117): set default profile image
                    src={funding.host_profile_image ?? Profileimg}
                    className={classes["user"]}
                    alt="Profile"
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span className={classes["host_nickname"]}>
                      {funding.host_nickname}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
      </div>

      <div className={classes.content_area}>
        <div>
          <div
            className={clsx(classes["content-wrapper"])}
          >
            <div
              className={classes.content}
              dangerouslySetInnerHTML={{ __html: funding.content }}
            />
          </div>
        </div>
        <div className={classes.reward_area}>
          <div className={classes.rewardtitle}>
            리워드
          </div>
          <div className={classes.reward_list_area}>
            <RewardList rewards={funding.meta_parsed.rewards} />
          </div>
          <div className={classes["account_number"]}>
            <p>후원자 계좌번호 : {funding.meta_parsed.account_number}</p>
            <FileDownloadButton
              links={funding.meta_parsed?.certificate ?? []}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

function RewardList(
  { rewards },
) {
  return (
    <ListGroup>
      <div className={classes.reward_list_container}>
        {rewards.map((reward) => {
          return (
            <ListGroup.Item
              className={clsx(classes.reward_list)}
              action
              bsPrefix="5151a"
              variant="success"
              key={reward.id}
            >
              <div className={classes.reward_table}>
                <span className={classes.reward_price}>
                  {reward.price.toLocaleString()}원
                </span>
              </div>
              <div className={classes.reward_title}>{reward.title}</div>
              <div className={classes.reward_content}>{reward.content}</div>
              <div className={classes.reward_count}>
                제한 수량 <b>{reward.reward_count}</b> 개
              </div>
            </ListGroup.Item>
          );
        })}
      </div>
    </ListGroup>
  );
}

function FileDownloadButton({
  links,
}) {
  links ??= [];
  return (
    <>
      {links.map(link => {
        return (
          <Button className={classes["go_funding_btn"]}>
            <a
              href={link}
              // for same origin
              download
            >
              증명서 확인
            </a>
          </Button>
        );
      })}
    </>
  );
}
