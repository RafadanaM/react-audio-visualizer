import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./App.module.css";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import Visualiser from "./components/Visualiser/Visualiser";
import { ReactComponent as Upload } from "./assets/upload.svg";

function App() {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedVisualiser, setSelectedVisualiser] = useState<string>("bar");
  const [duration, setDuration] = useState(0);
  const [isAudioEnded, setIsAudioEnded] = useState(false);
  const source = useRef<MediaElementAudioSourceNode | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyserNodeL = useRef<AnalyserNode | null>(null);
  const analyserNodeR = useRef<AnalyserNode | null>(null);
  const stereoNode = useRef<StereoPannerNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const distortionNode = useRef<WaveShaperNode | null>(null);
  const bassNode = useRef<BiquadFilterNode | null>(null);
  const midNode = useRef<BiquadFilterNode | null>(null);
  const trebleNode = useRef<BiquadFilterNode | null>(null);
  const splitterNode = useRef<ChannelSplitterNode | null>(null);
  const mergerNode = useRef<ChannelMergerNode | null>(null);
  const audioEl = useRef<HTMLAudioElement>(null);
  const animationId = useRef<number | null>(null);

  useEffect(() => {
    if (audioContext.current === null) {
      audioContext.current = new AudioContext();
      analyserNodeL.current = new AnalyserNode(audioContext.current, {
        fftSize: 2048,
      });
      analyserNodeR.current = new AnalyserNode(audioContext.current, {
        fftSize: 2048,
      });
      stereoNode.current = new StereoPannerNode(audioContext.current, {
        pan: 0,
      });
      gainNode.current = new GainNode(audioContext.current, {
        gain: 0.25,
      });
      distortionNode.current = new WaveShaperNode(audioContext.current);
      bassNode.current = new BiquadFilterNode(audioContext.current, {
        frequency: 200,
        type: "lowshelf",
      });

      midNode.current = new BiquadFilterNode(audioContext.current, {
        frequency: 2000,
        type: "peaking",
      });

      trebleNode.current = new BiquadFilterNode(audioContext.current, {
        frequency: 4000,
        type: "lowshelf",
      });

      splitterNode.current = new ChannelSplitterNode(audioContext.current, {
        numberOfOutputs: 2,
      });

      mergerNode.current = new ChannelMergerNode(audioContext.current, {
        numberOfInputs: 2,
      });
    }
  }, []);

  useEffect(() => {
    console.log("mantap");

    setIsAudioEnded((prevState) => {
      if (prevState) return !prevState;
      return prevState;
    });
  }, [isAudioEnded]);

  function handleVisualiserChange(e: ChangeEvent<HTMLInputElement>) {
    setSelectedVisualiser(e.target.value);
  }

  function handleLoadedData() {
    if (audioEl.current && audioContext.current) {
      if (source.current === null) {
        source.current = audioContext.current.createMediaElementSource(
          audioEl.current
        );
      }

      if (
        audioContext.current &&
        analyserNodeL.current &&
        analyserNodeR.current &&
        stereoNode.current &&
        gainNode.current &&
        distortionNode.current &&
        bassNode.current &&
        midNode.current &&
        trebleNode.current &&
        splitterNode.current &&
        mergerNode.current
      ) {
        // source.current.connect(stereoNode.current);
        source.current.connect(distortionNode.current);
        source.current.connect(bassNode.current);
        source.current.connect(midNode.current);
        source.current.connect(trebleNode.current);

        // stereoNode.current.connect(gainNode.current);
        distortionNode.current.connect(gainNode.current);
        bassNode.current.connect(gainNode.current);
        midNode.current.connect(gainNode.current);
        trebleNode.current.connect(gainNode.current);
        gainNode.current.connect(stereoNode.current);
        stereoNode.current.connect(splitterNode.current);
        splitterNode.current.connect(analyserNodeL.current, 0);
        splitterNode.current.connect(analyserNodeR.current, 1);

        analyserNodeL.current.connect(mergerNode.current, 0, 0);
        analyserNodeR.current.connect(mergerNode.current, 0, 1);

        mergerNode.current.connect(audioContext.current.destination);
      }
    }
  }

  function handlePlayPause() {
    if (audioContext.current === null) return;
    if (audioContext.current.state === "suspended") {
      audioContext.current.resume();
    }
    if (isAudioPlaying) {
      audioEl.current?.pause();
    } else {
      audioEl.current?.play();
    }
    setIsAudioPlaying(!isAudioPlaying);
  }

  function handleAudioEnded() {
    if (animationId.current) {
      window.cancelAnimationFrame(animationId.current);
    }
    setIsAudioEnded(true);
    setIsAudioPlaying(false);
  }

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    audioEl.current?.pause();
    setIsAudioPlaying(false);

    if (e.target.files === null) return;
    if (audioSrc !== null) {
      URL.revokeObjectURL(audioSrc);
    }
    const file = e.target.files[0];
    if (!/audio\/*/.test(file.type)) return;

    setFileName(file.name.substring(0, file.name.lastIndexOf(".")));
    const url = URL.createObjectURL(file);
    setAudioSrc(url);
  }

  function handleLoadedMetaData() {
    if (audioEl.current === null) return;
    setDuration(audioEl.current.duration);
  }

  return (
    <main className={styles.main}>
      {audioSrc ? (
        <>
          <audio
            onEnded={handleAudioEnded}
            ref={audioEl}
            src={audioSrc}
            onLoadedData={handleLoadedData}
            onLoadedMetadata={handleLoadedMetaData}
          />
          <Visualiser
            visualiserType={selectedVisualiser}
            analyserNodeL={analyserNodeL.current}
            analyserNodeR={analyserNodeR.current}
            isAudioPlaying={isAudioPlaying}
          />

          <AudioPlayer
            fileName={fileName}
            isAudioPlaying={isAudioPlaying}
            handlePlayPause={handlePlayPause}
            audioContext={audioContext.current}
            distortionNode={distortionNode.current}
            stereoNode={stereoNode.current}
            bassNode={bassNode.current}
            midNode={midNode.current}
            trebleNode={trebleNode.current}
            gainNode={gainNode.current}
            selectedVisualiser={selectedVisualiser}
            handleVisualiserChange={handleVisualiserChange}
            animationId={animationId}
            audioEl={audioEl.current}
            duration={duration}
            isAudioEnded={isAudioEnded}
          />
          <label className={`${styles.upload} ${styles.full}`}>
            <input type="file" onChange={handleFileUpload} accept="audio/*" />
            <Upload className="icon icon__base" />
          </label>
        </>
      ) : (
        <label className={`${styles.upload} ${styles.initial}`}>
          <input type="file" onChange={handleFileUpload} accept="audio/*" />
          Upload Your Music File
        </label>
      )}
    </main>
  );
}

export default App;
