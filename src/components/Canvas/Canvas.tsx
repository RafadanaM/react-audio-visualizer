import { useLayoutEffect, useRef } from "react";
import styles from "./Canvas.module.css";

interface ICanvas {
  draw: (ctx: CanvasRenderingContext2D) => boolean;
}

function Canvas({ draw }: ICanvas) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frameId = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (canvasRef.current === null) return;
    const canvasCtx = canvasRef.current.getContext("2d");
    if (canvasCtx === null) return;

    const render = () => {
      const shouldAnimate = draw(canvasCtx);

      if (shouldAnimate) {
        frameId.current = window.requestAnimationFrame(render);
      } else {
        if (frameId.current) {
          window.cancelAnimationFrame(frameId.current);
        }
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      if (canvasRef.current === null) return;

      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = 400;
      if (frameId.current) {
        window.cancelAnimationFrame(frameId.current);
      }
      render();
    });

    resizeObserver.observe(document.body);
    return () => {
      resizeObserver.disconnect();
      if (frameId.current) {
        window.cancelAnimationFrame(frameId.current);
      }
    };
  }, [draw]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}

export default Canvas;
