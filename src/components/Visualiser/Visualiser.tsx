import { useCallback, useEffect, useRef } from "react";
import Canvas from "../Canvas/Canvas";

interface IVisualiser {
  isAudioPlaying: boolean;
  analyserNodeL: AnalyserNode | null;
  analyserNodeR: AnalyserNode | null;
  visualiserType: string;
}

function Visualiser({
  analyserNodeL,
  analyserNodeR,
  isAudioPlaying,
  visualiserType,
}: IVisualiser) {
  // create array of unsigned 8 bit integer with length equal to the bufferLength
  const dataArrayL = useRef<Uint8Array | null>(null);
  const dataArrayR = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (analyserNodeL === null) return;
    if (analyserNodeR === null) return;
    if (visualiserType === "bar") {
      analyserNodeL.fftSize = 512;
      analyserNodeR.fftSize = 512;
    } else {
      analyserNodeL.fftSize = 2048;
      analyserNodeR.fftSize = 2048;
    }

    dataArrayL.current = new Uint8Array(analyserNodeL.frequencyBinCount).fill(
      visualiserType === "bar" ? 0 : 128
    );

    dataArrayR.current = new Uint8Array(analyserNodeR.frequencyBinCount).fill(
      visualiserType === "bar" ? 0 : 128
    );
  }, [analyserNodeL, analyserNodeR, visualiserType]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (analyserNodeL === null) return false;
      if (dataArrayL.current === null) return false;
      if (analyserNodeR === null) return false;
      if (dataArrayR.current === null) return false;

      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;

      const bufferLengthL = analyserNodeL.frequencyBinCount;
      const bufferLengthR = analyserNodeR.frequencyBinCount;
      if (bufferLengthL !== bufferLengthR) return false;

      if (visualiserType === "bar") {
        if (isAudioPlaying) {
          analyserNodeL.getByteFrequencyData(dataArrayL.current);
          analyserNodeR.getByteFrequencyData(dataArrayR.current);
        }

        // clear the canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // define properties of canvas
        ctx.fillStyle = "rgba(255,255,255, 0.5)";

        const barWidth = (canvasWidth / bufferLengthL) * 2.5;
        for (let i = 0; i < bufferLengthL; i++) {
          const valueL = dataArrayL.current[i];
          const valueR = dataArrayR.current[i];

          const x = i * barWidth + 1;

          // get the height of the bars and divide it by 2 since the canvas has 2 equal sections
          const barHeightL = ((valueL / 255) * canvasHeight) / 2;
          const barHeightR = ((valueR / 255) * canvasHeight) / 2;

          const yL = canvasHeight / 2 - barHeightL;

          ctx.fillRect(x, yL, barWidth, barHeightL);
          ctx.fillRect(x, canvasHeight / 2, barWidth, barHeightR);
        }

        // });
      } else if (visualiserType === "line") {
        if (isAudioPlaying) {
          // put the result of getByteTimeDomainData to data array
          analyserNodeL.getByteTimeDomainData(dataArrayL.current);
          analyserNodeR.getByteTimeDomainData(dataArrayR.current);
        }

        // clear the canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // define properties of canvas
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#FFFFFF";

        ctx.beginPath();

        // set width(or distance) of each data points by dividing the data point and the data count;
        const sliceWidth = canvasWidth / bufferLengthL;

        for (let i = 0; i < bufferLengthL; i++) {
          const valueL = dataArrayL.current[i];
          const valueR = dataArrayR.current[i];
          const valueAvg = (valueL + valueR) / 2;

          // multiply the idx with the slice width to get the x coordinate
          const x = i * sliceWidth;

          // divide the data point(value variable) point by 128 to half it (because the data point is 8 bit unsigned integer -> max 256) so result is always between 0 to 2 inclusive
          // then multiply the result by half of the height to get the y coordinate on the canvas
          const y = (valueAvg / 128.0) * (canvasHeight / 2);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.lineTo(canvasWidth, canvasHeight / 2);
        ctx.stroke();
      }

      return isAudioPlaying;
    },
    [analyserNodeL, analyserNodeR, isAudioPlaying, visualiserType]
  );
  return <Canvas draw={draw} />;
}

export default Visualiser;
