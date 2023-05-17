import { useCallback, useEffect, useRef } from "react";
import Canvas from "../Canvas/Canvas";

interface IVisualiser {
  isAudioPlaying: boolean;
  analyserNode: AnalyserNode | null;
  visualiserType: string;
}

function Visualiser({
  analyserNode,
  isAudioPlaying,
  visualiserType,
}: IVisualiser) {
  // create array of unsigned 8 bit integer with length equal to the bufferLength
  const dataArray = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (analyserNode === null) return;
    if (visualiserType === "bar") {
      analyserNode.fftSize = 512;
    } else {
      analyserNode.fftSize = 2048;
    }

    dataArray.current = new Uint8Array(analyserNode.frequencyBinCount).fill(
      visualiserType === "bar" ? 0 : 128
    );
  }, [analyserNode, visualiserType]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (analyserNode === null) return false;
      if (dataArray.current === null) return false;

      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;
      const bufferLength = analyserNode.frequencyBinCount;

      if (visualiserType === "bar") {
        if (isAudioPlaying) {
          analyserNode.getByteFrequencyData(dataArray.current);
        }

        // clear the canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // define properties of canvas
        ctx.fillStyle = "rgba(255,255,255, 0.5)";

        const barWidth = (canvasWidth / bufferLength) * 2.5;

        dataArray.current.forEach((value, idx) => {
          // multiply the idx with the bar width to get the x coordinate
          const x = idx * barWidth + 1;
          const barHeight = (value / 255) * canvasHeight * 0.75;

          const y = canvasHeight - barHeight;

          ctx.fillRect(x, y, barWidth, barHeight);
        });
      } else if (visualiserType === "line") {
        if (isAudioPlaying) {
          // put the result of getByteTimeDomainData to data array
          analyserNode.getByteTimeDomainData(dataArray.current);
        }

        // clear the canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // define properties of canvas
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#FFFFFF";

        ctx.beginPath();

        // set width(or distance) of each data points by dividing the data point and the data count;
        const sliceWidth = canvasWidth / bufferLength;

        dataArray.current.forEach((value, idx) => {
          // multiply the idx with the slice width to get the x coordinate
          const x = idx * sliceWidth;

          // divide the data point(value variable) point by 128 to half it (because the data point is 8 bit unsigned integer -> max 256) so result is always between 0 to 2 inclusive
          // then multiply the result by half of the height to get the y coordinate on the canvas
          const y = (value / 128.0) * (canvasHeight / 2);

          // just move to x,y if first iteration, else draw a line
          if (idx === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.lineTo(canvasWidth, canvasHeight / 2);
        ctx.stroke();
      }

      return isAudioPlaying;
    },
    [analyserNode, isAudioPlaying, visualiserType]
  );
  return <Canvas draw={draw} />;
}

export default Visualiser;
