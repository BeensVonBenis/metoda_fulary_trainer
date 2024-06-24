import { Table } from "react-bootstrap";
import "./Gryf.scss";
import { useEffect, useState } from "react";
import * as Soundfont from "soundfont-player";

function getOnString(notes, start, range) {
  let oktawa = start[1];
  let buffer = notes;
  for (let i = 0; i < Math.ceil(range / notes.length); i++) {
    buffer = buffer.concat(notes);
  }
  start = notes.findIndex((a) => a === start[0]);
  let strNotes = buffer.slice(start, range + start);
  return strNotes.map((a) => {
    if (a === "c") {
      oktawa++;
    }
    return [a, oktawa];
  });
}

function getNotesOfHarmony(base, harmony, notes) {
  const displacement = notes.findIndex((a) => a === base);
  return [
    Object.values(harmony).map((a) => notes[(a + displacement) % notes.length]),
  ];
}

export default function Gryf({
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
    Soundfont.instrument(new AudioContext(), "acoustic_guitar_steel").then(
      (res) => {
        setSynth(res);
      }
    );
  }, []);
  return (
    <div className="Gryf">
      <Table
        striped
        bordered
        style={{ tableLayout: "fixed" }}
        className="table"
      >
        <thead>
          <tr>
            {[...new Array(range)].map((a, i) => (
              <th key={i}>{i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...strings].reverse().map((a, i) => (
            <Struna
              key={i}
              notes={notes}
              correctNotes={correctNotes}
              self={a}
              range={range}
              markers={markers}
              synth={synth}
            ></Struna>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
function Struna({ notes, correctNotes, self, range, markers, synth }) {
  const onString = getOnString(notes, self, range);
  return (
    <tr className="Struna">
      {onString.map((a, i) => (
        <Fret
          key={i}
          markers={markers}
          a={a}
          i={i}
          correct={correctNotes.includes(a[0])}
          synth={synth}
        ></Fret>
      ))}
    </tr>
  );
}
function Fret({ a, markers, i, correct, synth }) {
  const [fretClass, setFretClass] = useState("fret");
  return (
    <th className={fretClass}>
      <div
        onClick={() => {
          setFretClass(`fret ${correct ? "correct" : "wrong"}`);
          synth.play(a[0] + a[1]);
          window.setTimeout(() => {
            setFretClass("fret");
          }, 500);
        }}
        className={markers.includes(i) ? "marker" : ""}
      >
        {a[0]}
      </div>
    </th>
  );
}
