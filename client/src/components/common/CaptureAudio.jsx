import { useStateProvider } from "@/context/StateContext";
import React, { useRef, useState } from "react";
import {
  FaMicrophone,
  FaPause,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";

function CaptureAudio({ hide }) {
  const [{ userInfo, currentChatUSer, socket }, dispatch] = useStateProvider();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef();
  const audioRecorderRef = useRef();
  const waveFormRef = useRef();

  const handlePlayRecording = () => {};

  const handleStopRecording = () => {};

  return (
    <div className="flex text-2xl w-full justify-end items-center ">
      <div className="pt-1">
        <FaTrash className="text-panel-header-icon" onClick={() => hide()} />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-pulse z-60 text-center ">
            Recording
            <span className="">{recordingDuration}</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handleStopRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording}>
          {recordedAudio && isPlaying && (
            <span>{formateTime(currentPlaybackTime)}</span>
          )}
          {recordedAudio && !isPlaying && (
            <span>{formatTime(totalDuration)}</span>
          )}
          <audio ref={audioRef} hidden />

          <div className="mr-4">
            {!isRecording ? (
              <FaMicrophone className="text-red-500" />
            ) : (
              <FaPauseCircle
                className="text-red-500"
                onClick={handleStartRecording}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaptureAudio;
