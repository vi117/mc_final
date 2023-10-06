import { useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import classes from "../FundingsWrite.module.css";

function AddItemView({
  onAddItem = () => {},
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [count, setCount] = useState("");

  return (
    <Form.Group className={classes.reward_area}>
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
