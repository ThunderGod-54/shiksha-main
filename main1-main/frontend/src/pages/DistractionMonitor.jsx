import { useRef, useState, useEffect } from "react";

const monitorStyles = `
.monitor-root {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top left, rgba(37,99,235,0.08), transparent 55%),
    radial-gradient(circle at bottom right, rgba(139,92,246,0.10), transparent 55%),
    var(--bg-secondary);
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, "Segoe UI", Roboto, sans-serif;
  color: var(--text-primary);
}

.monitor-card {
  width: 100%;
  max-width: 900px;
  background: var(--card-bg);
  border-radius: 1.25rem;
  padding: 1.8rem;
  box-shadow:
    0 10px 30px var(--shadow-color),
    0 0 0 1px var(--border-color);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: 1.8rem;
  position: relative;
  overflow: hidden;
}

/* soft gradient stripe */
.monitor-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(79,172,254,0.16), transparent 60%);
  pointer-events: none;
  opacity: 0.85;
}

/* ensure content above stripe */
.monitor-card > * {
  position: relative;
  z-index: 1;
}

/* LEFT: video + status */
.monitor-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.monitor-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: .75rem;
}

.monitor-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(130deg, var(--accent), var(--accent-strong));
  -webkit-background-clip: text;
  color: transparent;
}

.status {
  padding: .4rem .85rem;
  border-radius: 999px;
  font-size: .8rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  border: 1px solid var(--border-color);
  background: rgba(148,163,184,0.09);
  color: var(--text-secondary);
}

.status::before {
  content: "";
  width: .5rem;
  height: .5rem;
  border-radius: 999px;
  background: #9ca3af;
}

/* status variants */
.status.idle {
  background: rgba(148,163,184,0.08);
  color: var(--text-secondary);
}
.status.ok {
  background: rgba(16,185,129,0.11);
  border-color: rgba(16,185,129,0.5);
  color: #047857;
}
.status.ok::before {
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.25);
}
.status.warn {
  background: rgba(248,113,113,0.1);
  border-color: rgba(248,113,113,0.55);
  color: #b91c1c;
}
.status.warn::before {
  background: #f97373;
  box-shadow: 0 0 0 3px rgba(248,113,113,0.25);
}

.monitor-subtext {
  font-size: .82rem;
  color: var(--text-secondary);
}

.monitor-video-wrapper {
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: radial-gradient(circle at center, rgba(15,23,42,0.15), rgba(15,23,42,0.85));
  position: relative;
  box-shadow: 0 10px 26px rgba(15,23,42,0.45);
}

.monitor-video {
  width: 100%;
  height: 260px;
  object-fit: cover;
  background: #020617;
}

/* subtle top-left label */
.monitor-video-label {
  position: absolute;
  top: .6rem;
  left: .8rem;
  padding: .25rem .6rem;
  border-radius: .8rem;
  font-size: .75rem;
  background: rgba(15,23,42,0.7);
  color: #e5e7eb;
}

/* RIGHT: controls & timer */
.monitor-right {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.focus-row, .session-controls {
  display: flex;
  flex-direction: column;
  gap: .8rem;
}

.preset-row {
  display: flex;
  flex-wrap: wrap;
  gap: .65rem;
}

.btn-base {
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  padding: .55rem 1.1rem;
  font-size: .85rem;
  cursor: pointer;
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .35rem;
  transition: all .18s ease;
}

.btn-base:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px var(--shadow-color);
}

.preset-btn {
  composes: btn-base;
}

.preset-btn {
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: rgba(148,163,184,0.08);
}
.preset-btn.active {
  border-color: var(--accent);
  background: radial-gradient(circle at top left, rgba(79,172,254,0.16), rgba(59,130,246,0.25));
  color: white;
}

/* Primary CTA */
.focus-btn {
  composes: btn-base;
}

.focus-btn {
  width: 100%;
  padding: .8rem 1.1rem;
  border-radius: .9rem;
  border: none;
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: #fff;
  font-weight: 600;
  font-size: .95rem;
  box-shadow: 0 12px 30px rgba(37,99,235,0.45);
}

.focus-btn:disabled {
  cursor: progress;
  opacity: .7;
  box-shadow: none;
  transform: none;
}

/* Session controls */
.session-controls-row {
  display: flex;
  flex-wrap: wrap;
  gap: .6rem;
}

.pause-btn, .end-btn {
  composes: btn-base;
}

.pause-btn {
  flex: 1;
  background: rgba(148,163,184,0.1);
}

.end-btn {
  flex: 1;
  background: rgba(248,113,113,0.12);
  border-color: rgba(248,113,113,0.4);
  color: #b91c1c;
}

/* Timer */
.timer-box {
  margin-top: .4rem;
  border-radius: 1rem;
  padding: .85rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: radial-gradient(circle at top left, rgba(79,172,254,0.09), transparent 55%), var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 24px var(--shadow-color);
}

.timer-label {
  font-size: .8rem;
  color: var(--text-secondary);
}

.timer-value {
  font-size: 1.7rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: .04em;
}

/* Responsive */
@media (max-width: 900px) {
  .monitor-card {
    grid-template-columns: 1fr;
  }
  .monitor-video {
    height: 220px;
  }
}
`;

export default function DistractionMonitor() {
  const videoRef = useRef(null);
  const statusRef = useRef(null);

  const faceLandmarkerRef = useRef(null);
  const audioContextRef = useRef(null);
  const earHistoryRef = useRef([]);

  const lastVideoTimeRef = useRef(-1);
  const closedFramesRef = useRef(0);
  const noFaceFramesRef = useRef(0);

  const [sessionStarted, setSessionStarted] = useState(false);

  const [focusMode, setFocusMode] = useState(false);
  const [running, setRunning] = useState(false);
  const [userMinutes, setUserMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const timerRef = useRef(null);

  const EAR_THRESHOLD = 0.32;
  const EAR_SMOOTHING = 5;

  // auto-start timer when focus mode toggles on
  useEffect(() => {
    if (focusMode) {
      setRemaining(userMinutes * 60);
      setRunning(true);
    } else {
      setRunning(false);
    }
  }, [focusMode, userMinutes]);

  // countdown logic
  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setRunning(false);
          setFocusMode(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  async function startCameraAndFocus() {
    setSessionStarted(true);
    setFocusMode(true);

    const btn = document.getElementById("start-focus-btn");
    if (btn) {
      btn.innerText = "Loading…";
      btn.disabled = true;
    }

    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    const vision = await window.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    faceLandmarkerRef.current = await window.FaceLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      }
    );

    enableCamera();

    if (btn) btn.style.display = "none";
  }

  function enableCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;

        videoRef.current.onloadeddata = () => {
          predictWebcam();
        };
      })
      .catch((err) => {
        console.error("getUserMedia error:", err);
        if (statusRef.current) {
          statusRef.current.innerText = "Camera permission required";
          statusRef.current.className = "status warn";
        }
      });
  }

  function endFocusSession() {
    const cam = videoRef.current?.srcObject;
    if (cam) cam.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;

    setSessionStarted(false);
    setFocusMode(false);
    setRunning(false);
    setRemaining(25 * 60);
    setUserMinutes(25);

    lastVideoTimeRef.current = -1;
    closedFramesRef.current = 0;
    noFaceFramesRef.current = 0;
    earHistoryRef.current = [];

    if (statusRef.current) {
      statusRef.current.innerText = "Start focusing!";
      statusRef.current.className = "status idle";
    }
  }

  function playBeep() {
    const ctx = audioContextRef.current;
    if (!ctx || ctx.state !== "running") {
      console.warn("AudioContext not running, cannot play beep.");
      return;
    }
    const osc = ctx.createOscillator();
    osc.frequency.value = 600;
    osc.connect(ctx.destination);
    osc.start();
    setTimeout(() => osc.stop(), 160);
  }

  function getDistance(a, b) {
    return Math.sqrt(
      (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2
    );
  }

  function getEAR(eye) {
    if (!eye || eye.length < 6) return NaN;
    return (
      (getDistance(eye[1], eye[5]) + getDistance(eye[2], eye[4])) /
      (2.0 * getDistance(eye[0], eye[3]))
    );
  }

  async function predictWebcam() {
    const video = videoRef.current;
    const faceLandmarker = faceLandmarkerRef.current;

    if (!video || !faceLandmarker) {
      requestAnimationFrame(predictWebcam);
      return;
    }

    if (!videoRef.current.srcObject) return;

    if (
      typeof video.currentTime === "number" &&
      video.currentTime === lastVideoTimeRef.current
    ) {
      requestAnimationFrame(predictWebcam);
      return;
    }
    lastVideoTimeRef.current = video.currentTime;

    let result;
    try {
      result = await faceLandmarker.detectForVideo(video, performance.now());
    } catch (err) {
      console.error("detectForVideo error:", err);
      requestAnimationFrame(predictWebcam);
      return;
    }

    const hasLandmarks = result && result.faceLandmarks?.length > 0;

    // no face
    if (!hasLandmarks) {
      noFaceFramesRef.current++;

      // beep once when face first disappears
      if (noFaceFramesRef.current === 1) {
        playBeep();
      }

      if (statusRef.current) {
        statusRef.current.innerText = "No Face Detected";
        statusRef.current.className = "status warn";
      }

      requestAnimationFrame(predictWebcam);
      return;
    }

    // reset no-face count
    noFaceFramesRef.current = 0;

    const lm = result.faceLandmarks[0];
    const leftEye = [lm[33], lm[160], lm[158], lm[133], lm[153], lm[144]];
    const rightEye = [lm[263], lm[387], lm[385], lm[362], lm[380], lm[373]];

    const leftEAR = getEAR(leftEye);
    const rightEAR = getEAR(rightEye);
    let avgEAR = (leftEAR + rightEAR) / 2;

    // smoothing
    const earHistory = earHistoryRef.current;
    earHistory.push(avgEAR);
    if (earHistory.length > EAR_SMOOTHING) {
      earHistory.shift();
    }
    avgEAR = earHistory.reduce((a, b) => a + b, 0) / earHistory.length;

    if (avgEAR < EAR_THRESHOLD) {
      closedFramesRef.current++;

      // beep once when eyes first close
      if (closedFramesRef.current === 1) {
        playBeep();
      }

      if (statusRef.current) {
        statusRef.current.innerText = "Eyes Closed";
        statusRef.current.className = "status warn";
      }
    } else {
      closedFramesRef.current = 0;
      if (statusRef.current) {
        statusRef.current.innerText = "Focused";
        statusRef.current.className = "status ok";
      }
    }

    requestAnimationFrame(predictWebcam);
  }

  const handlePresetClick = (mins) => {
    setUserMinutes(mins);
    if (!sessionStarted) {
      setRemaining(mins * 60);
    }
  };

  return (
    <>
      <style>{monitorStyles}</style>
      <div className="monitor-root">
        <div className="monitor-card">
          {/* LEFT SIDE: status + video */}
          <div className="monitor-left">
            <div className="monitor-header-row">
              <div>
                <div className="monitor-title">Focus & Distraction Monitor</div>
                <div className="monitor-subtext">
                  Real-time eye & presence tracking to keep you on task.
                </div>
              </div>
              <div ref={statusRef} className="status idle">
                Start focusing!
              </div>
            </div>

            <div className="monitor-video-wrapper">
              <span className="monitor-video-label">Live camera</span>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="monitor-video"
              />
            </div>
          </div>

          {/* RIGHT SIDE: controls + timer */}
          <div className="monitor-right">
            {!sessionStarted && (
              <div className="focus-row">
                <div className="preset-row">
                  {[25, 50, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      className={
                        "preset-btn" +
                        (userMinutes === mins ? " active" : "")
                      }
                      onClick={() => handlePresetClick(mins)}
                    >
                      ⏳ {mins} min
                    </button>
                  ))}
                </div>

                <button
                  id="start-focus-btn"
                  type="button"
                  className="focus-btn"
                  onClick={startCameraAndFocus}
                >
                  Start Focus Session
                </button>
              </div>
            )}

            {sessionStarted && (
              <div className="session-controls">
                <div className="session-controls-row">
                  <button
                    type="button"
                    className="pause-btn"
                    onClick={() => setRunning((prev) => !prev)}
                  >
                    {running ? "Pause Timer" : "Resume Timer"}
                  </button>

                  <button
                    type="button"
                    className="end-btn"
                    onClick={endFocusSession}
                  >
                    End Focus Session
                  </button>
                </div>
              </div>
            )}

            <div className="timer-box">
              <div className="timer-label">
                Focus Session
                <br />
                <span style={{ fontSize: ".75rem" }}>
                  {focusMode ? "In progress" : "Not started"}
                </span>
              </div>
              <div className="timer-value">⏱ {formatTime(remaining)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
