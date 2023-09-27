import { useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { GoInfo } from "react-icons/go";
import classes from "../FundingWrite.module.css";

function AddItemView({
  onAddItem = () => {},
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [count, setCount] = useState("");

  return (
    <Form.Group className={classes.reward_area}>
      <h1>리워드 설계</h1>
      <p>
        선물은 후원자에게 프로젝트의 가치를 전달하는 수단입니다.<br></br>
        다양한 금액대로 여러 개의 선물을 만들어주세요. <br></br>
        펀딩 성공률이 높아지고, 더 많은 후원 금액을 모금할 수 있어요.
      </p>
      <ul className={classes.guide}>
        <li className={classes.guide_bold}>
          <GoInfo className={classes.guide_svg}></GoInfo>
          리워드 설계 조건
        </li>
        <li>혜택이 좋은 순서대로 등록해 주세요.</li>
        <li>
          각 리워드끼리 쉽게 구분될 수 있도록 규칙적이고 정확한 리워드명을
          사용해 주세요.
        </li>
        <li>
          각 리워드별 제공할 수 있는 수량을 입력해 주세요. 제한된 수량이 모두
          소진되면 이 리워드를 선택할 수 없어요.
        </li>
      </ul>
      <Form.Control
        className={classes.reward_input}
        type="text"
        placeholder="리워드 이름을 입력해주세요.  예) [혜택] + [브랜드/제품명] + [구성]"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Form.Control
        className={classes.reward_input}
        type="text"
        placeholder="리워드 설명을 입력해주세요. 예) 블랙-230mm 1개 + [사은품]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Form.Control
        className={classes.reward_input}
        type="number"
        placeholder="가격"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Form.Control
        className={classes.reward_input}
        type="number"
        placeholder="제한 수량"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <Button
        className={classes.reward_btn}
        onClick={() => {
          onAddItem({
            title,
            content,
            price: parseInt(price),
            reward_count: parseInt(count),
          });
        }}
      >
        추가하기
      </Button>
    </Form.Group>
  );
}

export function RewardItemList({
  onChange = () => {},
}) {
  const [items, setItems] = useState([]);

  return (
    <>
      <AddItemView
        onAddItem={(item) => {
          const updatedItems = [...items, item];
          setItems(updatedItems);
          onChange(updatedItems);
        }}
      />
      <div className={classes.reward_item_area}>
        <ListGroup variant="flush">
          <p>내가 만든 리워드</p>
          {items.map((item, index) => (
            <ListGroup.Item
              key={index}
              style={{
                "listStyleType": "None",
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong>{item.title}</strong> , {item.content} , {item.price}원 ,
              {item.reward_count}
              <Button
                className={classes.reward_btn}
                onClick={() => {
                  const updatedItems = [...items];
                  updatedItems.splice(index, 1);
                  setItems(updatedItems);
                  onChange(updatedItems);
                }}
              >
                삭제하기
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
}
