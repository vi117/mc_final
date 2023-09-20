import { useState } from "react";

function AddItemView({
  onAddItem = () => {},
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [count, setCount] = useState("");

  return (
    <>
      <div>리워드 추가</div>
      <input
        type="text"
        placeholder="이름"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="설명"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="number"
        placeholder="가격"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="수량"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <button
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
      </button>
    </>
  );
}

export function ItemList({
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
      <ul>
        {items.map((item, index) => (
          <li key={index} style={{ "listStyleType": "None" }}>
            <strong>{item.title}</strong> - {item.content} - {item.price} -
            {item.reward_count}
            <button
              onClick={() => {
                const updatedItems = [...items];
                updatedItems.splice(index, 1);
                setItems(updatedItems);
                onChange(updatedItems);
              }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
