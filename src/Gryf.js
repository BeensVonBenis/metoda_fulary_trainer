import { FormSelect, Table } from "react-bootstrap";
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

function getInterval(note, base, notes, intevals) {
  const posB = notes.findIndex((a) => a === base);
  const posN = notes.findIndex((a) => a === note);
  const dist = (posB + 12 - posN) % 12;
  return [dist, intevals[dist]];
}

export default function Gryf({
  notes,
  played,
  strings,
  range,
  markers,
  intervals,
  harmonies,
  showCorrect,
  showIntervals,
  showNotes,
  showFirst,
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
    <>
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
                showCorrect={showCorrect}
                showIntervals={showIntervals}
                played={played}
                intervals={intervals}
                showNotes={showNotes}
                showFirst={showFirst}
              ></Struna>
            ))}
          </tbody>
        </Table>
      </div>
      <FormSelect
        onChange={(event) =>
          Soundfont.instrument(new AudioContext(), event.target.value).then(
            (res) => {
              setSynth(res);
            }
          )
        }
      >
        <option value="acoustic_guitar_steel">Akustyk stalowy</option>
        <option value="acoustic_guitar_nylon">Akustyk nylonowy</option>
        <option value="distortion_guitar">Guitara z distortem</option>
        <option value="electric_guitar_clean">Elektryk clean</option>
        <option value="electric_guitar_jazz">Elektryk jazz</option>
        <option value="electric_guitar_muted">Elektryk stłumiony</option>
        <option value="guitar_harmonics">Gitara harmonics</option>
        <option value="overdriven_guitar">Gitara overdrive</option>
        <option value="banjo">Banjo</option>
      </FormSelect>
    </>
  );
}
function Struna({
  notes,
  correctNotes,
  self,
  range,
  markers,
  synth,
  showCorrect,
  showIntervals,
  played,
  intervals,
  showNotes,
  showFirst,
}) {
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
          showCorrect={showCorrect}
          showIntervals={showIntervals}
          played={played}
          notes={notes}
          intervals={intervals}
          showNotes={showNotes}
          showFirst={showFirst}
        ></Fret>
      ))}
    </tr>
  );
}
function Fret({
  a,
  markers,
  i,
  correct,
  synth,
  showCorrect,
  showIntervals,
  played,
  intervals,
  notes,
  showNotes,
  showFirst,
}) {
  const [fretClass, setFretClass] = useState(
    `fret ${showCorrect && correct ? " marked" : ""}`
  );
  return (
    <th className={fretClass}>
      <div
        onClick={() => {
          setFretClass(
            `fret ${correct ? "correct" : "wrong"} ${
              showCorrect && correct ? " marked" : ""
            }`
          );
          synth.play(a[0] + a[1]);
          window.setTimeout(() => {
            setFretClass(`fret ${showCorrect && correct ? " marked" : ""}`);
          }, 500);
        }}
        className={markers.includes(i) ? "marker" : ""}
      >
        <span
          style={{
            color:
              showFirst &&
              getInterval(played[0], a[0], notes, intervals)[0] === 0
                ? "red"
                : "white",
          }}
        >
          {showNotes ? (
            <div>{a[0]}</div>
          ) : showFirst &&
            getInterval(played[0], a[0], notes, intervals)[0] === 0 &&
            !showIntervals ? (
            "@"
          ) : (
            ""
          )}
          <span className={!showNotes ? "" : "intervalMarker"}>
            {showIntervals && getInterval(played[0], a[0], notes, intervals)[1]}
          </span>
        </span>
      </div>
    </th>
  );
}
