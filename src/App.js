import { createTuner } from "@chordbook/tuner";
import { Button, Tab, Tabs } from "react-bootstrap";
import { useState } from "react";
import * as Tone from "tone";
import "./App.css";
import Gryf from "./Gryf";
import Klawisz from "./Klawisz";

export default function App() {
  const range = 16;
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
    "c",
    "c#",
    "d",
    "d#",
    "e",
    "f",
    "f#",
    "g",
    "g#",
    "a",
    "a#",
    "b",
  ]);
  const [strings, setStrings] = useState([
    ["e", 2],
    ["a", 2],
    ["d", 3],
    ["g", 3],
    ["b", 3],
    ["e", 4],
  ]);
  const intervals = [
    "1cz",
    "2m",
    "2w",
    "3m",
    "3w",
    "4cz",
    "5zm",
    "5cz",
    "6m",
    "6w",
    "7m",
    "7w",
  ];
  const harmonies = {
    m7: [0, 2, 3, 7, 10],
    maj7: [0, 2, 4, 7, 11],
    7: [0, 2, 4, 7, 10],
    mb57: [0, 1, 3, 6, 10],
    mol: [0, 3, 5, 7, 10],
    dur: [0, 2, 4, 7, 9],
  };
  const [played, setPlayed] = useState(["a", "m7"]);
  return (
    <div className="App" data-bs-theme="dark">
      <div className="Instrumenty">
        <Tabs justify fill style={{ width: "100%" }}>
          <Tab eventKey={"gitara"} title="gitara">
            <Gryf
              notes={notes}
              strings={strings}
              played={played}
              range={range}
              markers={markers}
              intervals={intervals}
              harmonies={harmonies}
            ></Gryf>
          </Tab>
          <Tab eventKey={"klawisz"} title="kalwisz">
            <Klawisz
              notes={notes}
              played={played}
              range={range}
              markers={markers}
              intervals={intervals}
              harmonies={harmonies}
            ></Klawisz>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
