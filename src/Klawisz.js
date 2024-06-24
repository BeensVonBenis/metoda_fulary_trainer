import { Table } from "react-bootstrap";
import "./Klawisz.scss";
import { useEffect, useState } from "react";
import * as Soundfont from "soundfont-player";

function getNotesOfHarmony(base, harmony, notes) {
  const displacement = notes.findIndex((a) => a === base);
  return [
    Object.values(harmony).map((a) => notes[(a + displacement) % notes.length]),
  ];
}

export default function Klawisz({
  notes,
  played,
  strings,
  range,
  markers,
  intervals,
  harmonies,
}) {
  const [correctNotes, setCorrectNotes] = getNotesOfHarmony(
    played[0],
    harmonies[played[1]],
    notes
  );
  const [synth, setSynth] = useState(null);
  useEffect(() => {
    Soundfont.instrument(new AudioContext(), "acoustic_grand_piano").then(
      (res) => {
        setSynth(res);
      }
    );
  }, []);
  return (
    <div className="Klawisz">
      <div className="key-container">
        {notes
          .map((a) => [a, 2])
          .concat(notes.map((a) => [a, 3]))
          .concat(notes.map((a) => [a, 4]))
          .concat(notes.map((a) => [a, 5]))
          .concat(notes.map((a) => [a, 6]))
          .map((a, index) => (
            <Przycisk
              key={index}
              a={a}
              synth={synth}
              correct={correctNotes.includes(a[0])}
            ></Przycisk>
          ))}
      </div>
    </div>
  );
}

function Przycisk({ a, correct, synth }) {
  const [keyClass, setFKeyClass] = useState(
    `key ${a[0].includes("#") ? "sharp" : ""}`
  );
  return (
    <div
      className={keyClass}
      onClick={() => {
        setFKeyClass(
          `key ${a[0].includes("#") ? "sharp" : ""} ${
            correct ? "correct" : "wrong"
          }`
        );
        synth.play(a[0] + a[1]);
        window.setTimeout(() => {
          setFKeyClass(`key ${a[0].includes("#") ? "sharp" : ""}`);
        }, 500);
      }}
    >
      {a[0]}
    </div>
  );
}
