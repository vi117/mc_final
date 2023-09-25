import { useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";

function AddItemView({
  onAddItem = () => {},
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [count, setCount] = useState("");

  return (
    <Form.Group>
      <h2>리워드 추가</h2>
      <Form.Control
        type="text"
        placeholder="이름"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Form.Control
        type="text"
        placeholder="설명"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Form.Control
        type="number"
        placeholder="가격"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Form.Control
        type="number"
        placeholder="수량"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <Button
        onClick={() => {
          onAddItem({
            title,
            content,
            price: parseInt(price),
            reward_count: parseInt(count),
          });
        }}
      >
        추가
      </Button>
    </Form.Group>
  );
}

export function RewardItemList({
  onChange = () => {},
}) {
  const [items, setItems] = useState([]);

  return (
    <div>
      <AddItemView
        onAddItem={(item) => {
          const updatedItems = [...items, item];
          setItems(updatedItems);
          onChange(updatedItems);
        }}
      />
      <ListGroup>
        {items.map((item, index) => (
          <ListGroup.Item key={index} style={{ "listStyleType": "None" }}>
            <strong>{item.title}</strong> - {item.content} - {item.price} -
            {item.reward_count}
            <Button
              onClick={() => {
                const updatedItems = [...items];
                updatedItems.splice(index, 1);
                setItems(updatedItems);
                onChange(updatedItems);
              }}
            >
              삭제
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
