import clsx from "clsx";
import { Button, Carousel, ListGroup } from "react-bootstrap";
import { Container } from "../../../component/Container";
import { formatDate } from "../../../util/date";
import { isPSApprovedTag } from "../../../util/tag";
import classes from "./index.module.css";

import { NavLink, useParams } from "react-router-dom";

const old_data = {
  "host_nickname": "admin",
  "host_profile_image": null,
  "host_email": "admin@gmail.com",
  "id": 8,
  "begin_date": "2023-10-05T02:55:42.000Z",
  "content":
    "<h3>01. 진행 팀 소개 &amp; 창작 동기</h3><p>안녕하세요? 저희는 거창고등학교 2학년 2반입니다. 저희는 이번에 수업시간에 프로젝트 연구를 시작하면서 다양한 사회문...",
  "created_at": "2023-10-04T18:02:00.000Z",
  "deleted_at": null,
  "end_date": "2023-10-05T02:55:42.000Z",
  "funding_request_id": 7,
  // 0이면 승인 대기, 1이면 승인 완료, 2이면 승인 거부
  "funding_state": 1,
  "host_id": 1,
  "meta":
    "{\"tags\":[\"강아지\"],\"rewards\":[{\"title\":\"선물 없이 후원\",\"content\":\"후원자 명당에서 제외됨\",\"price\":1000,\"reward_count\":9999},{\"title\":\"후원\",\"content\":\"배송비 포함\",\"price\":7000,\"reward_count\":100}],\"content_thumbnails\":[\"https://s3.prelude.duckdns.org/happytail/78c22da1-34cc-4f93-8e35-f4bbc1c4dcb6.webp\"],\"account_number\":\"4654-45654321-45654\",\"certificate\":[\"https://s3.prelude.duckdns.org/happytail/74f8d038-7ff5-4759-9ff0-28564808508c.webp\"]}",
  "reason": null,
  "target_value": 1000000,
  "title": "[Go Dog]강아지를 구하라",
  "thumbnail":
    "https://s3.prelude.duckdns.org/happytail/c582cf66-eff0-427c-9f27-ebe2e52834a1.webp",
  "updated_at": "2023-10-05T03:07:53.000Z",
  "meta_parsed": {
    "tags": [
      "강아지",
    ],
    "rewards": [
      {
        "title": "선물 없이 후원",
        "content": "후원자 명당에서 제외됨",
        "price": 1000,
        "reward_count": 9999,
      },
      {
        "title": "후원",
        "content": "배송비 포함",
        "price": 7000,
        "reward_count": 100,
      },
    ],
    "content_thumbnails": [
      "https://s3.prelude.duckdns.org/happytail/78c22da1-34cc-4f93-8e35-f4bbc1c4dcb6.webp",
    ],
    // 계좌번호
    "account_number": "4654-45654321-45654",
    "certificate": [
      // 증명 기록 파일 링크
      "https://s3.prelude.duckdns.org/happytail/74f8d038-7ff5-4759-9ff0-28564808508c.webp",
    ],
  },
};

export default function FundingRequestDetailPage() {
  const params = useParams();
  const id = parseInt(params.id);

  console.log("id", id);

  const funding = old_data;
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
                    src={funding.host_profile_image ?? ""}
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
          </div>
        </div>
      </div>
      <FileDownloadButton />
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

function FileDownloadButton() {
  return (
    <Button variant="outline-primary">
      <a
        href="https://s3.prelude.duckdns.org/happytail/74f8d038-7ff5-4759-9ff0-28564808508c.webp"
        download={"certificate.webp"}
      >
        증명서 확인
      </a>
    </Button>
  );
}
