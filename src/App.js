import { createTuner } from "@chordbook/tuner";
import { Button } from "react-bootstrap";
import { useState } from "react";
import * as Tone from "tone";
import "./App.css";
import Gryf from "./Gryf";

export default function App() {
  const range = 15;
  const markers = [1, 3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
  const tuner = createTuner({
    onNote: (note) => {
      console.log("Note:", note);
    },
    updateInterval: 50,
    a4: 440,
    clarityThreshold: 0.9,
    minVolumeDecibels: -1000,
    minFrequency: 27.5,
    maxFrequency: 4186.01,
    sampleRate: 44100,
    bufferSize: 8192,
    smoothingTimeConstant: 0.8,
  });
  const [notes, setNotes] = useState([
    "a",
    "a#",
    "b",
    "c",
    "c#",
    "d",
    "d#",
    "e",
    "f",
    "f#",
    "g",
    "g#",
  ]);
  const [strings, setStrings] = useState([
    ["e", 2],
    ["a", 2],
    ["d", 3],
    ["g", 3],
    ["b", 3],
    ["e", 4],
  ]);
  const [grane, setGrane] = useState([]);
  return (
    <div className="App" data-bs-theme="dark">
      <Gryf
        notes={notes}
        strings={strings}
        grane={grane}
        range={range}
        markers={markers}
      ></Gryf>
    </div>
  );
}
