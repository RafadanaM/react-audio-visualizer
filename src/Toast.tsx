import { useState, MouseEvent, AnimationEvent } from "react";
import "./Toast.css";

const Toast = () => {
  const [toasts, setToasts] = useState([{ id: 1, title: "HALLO" }]);

  function addToast() {
    setToasts((prevState) => [
      ...prevState,
      { id: Math.random(), title: "mantap" },
    ]);
  }

  function deleteToast(id: number, e: MouseEvent<HTMLDivElement>) {
    e.currentTarget.classList.add("slide-out");
    setTimeout(() => {
      setToasts((prevState) => prevState.filter((toast) => toast.id !== id));
    }, 250);
  }

  function handleAnimationEnd(e: AnimationEvent<HTMLDivElement>) {
    if (e.animationName === "slide-in") {
      e.currentTarget.classList.remove("slide-in");
    }
  }

  return (
    <>
      <button onClick={addToast}>Add Toast</button>
      <div className="toast-container">
        {toasts.map(({ id, title }) => (
          <div
            onAnimationEnd={handleAnimationEnd}
            key={id}
            onClick={(e) => deleteToast(id, e)}
            className="toast slide-in left"
          >
            {title}
          </div>
        ))}
      </div>
    </>
  );
};

export default Toast;
