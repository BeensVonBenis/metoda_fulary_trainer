import { FormSelect, Table } from "react-bootstrap";
import "./Klawisz.scss";
import { useEffect, useState } from "react";
import * as Soundfont from "soundfont-player";

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

export default function Klawisz({
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
    console.log("tworzenie nowego syntezatora");
    Soundfont.instrument(new AudioContext(), "acoustic_grand_piano").then(
      (res) => {
        setSynth(res);
      }
    );
  }, []);
  return (
    <>
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
                showCorrect={showCorrect}
                showIntervals={showIntervals}
                notes={notes}
                intervals={intervals}
                played={played}
                showNotes={showNotes}
                showFirst={showFirst}
              ></Przycisk>
            ))}
        </div>
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
        <option value="acoustic_grand_piano">Fortepian akustyczny</option>
        <option value="bright_acoustic_piano">Pianino akustyczne</option>
        <option value="electric_grand_piano">Fortepian elektryczny</option>
        <option value="electric_piano_1">Pianino elektryczne 1</option>
        <option value="electric_piano_2">Pianino elektryczne 2</option>
        <option value="honkytonk_piano">Pianino country</option>
        <option value="church_organ">Organy kościelne</option>
        <option value="rock_organ">Organy rockowe</option>
        <option value="accordion">Akordeon</option>
        <option value="alto_sax">Saksofon syntezator</option>
        <option value="clarinet">Klarnet syntezator</option>
        <option value="trumpet">Trąbka syntezator</option>
        <option value="whistle">Gwizdanie</option>
        <option value="gunshot">Broń palna</option>
      </FormSelect>
    </>
  );
}

function Przycisk({
  a,
  correct,
  synth,
  showCorrect,
  intervals,
  showIntervals,
  notes,
  played,
  showNotes,
  showFirst,
}) {
  const [keyClass, setFKeyClass] = useState(
    `key ${a[0].includes("#") ? "sharp" : ""} ${
      showCorrect && correct ? " marked" : ""
    } ${
      getInterval(played[0], a[0], notes, intervals)[0] === 0 &&
      showFirst &&
      !showIntervals &&
      !showNotes
        ? "first"
        : ""
    }`
  );
  useEffect(() => {
    setFKeyClass(
      `key ${a[0].includes("#") ? "sharp" : ""} ${
        showCorrect && correct ? " marked" : ""
      } ${
        getInterval(played[0], a[0], notes, intervals)[0] === 0 &&
        showFirst &&
        !showIntervals &&
        !showNotes
          ? "first"
          : ""
      }`
    );
  }, [
    showCorrect,
    showFirst,
    showNotes,
    showIntervals,
    a,
    correct,
    played,
    intervals,
    notes,
  ]);
  return (
    <div
      className={keyClass}
      onClick={() => {
        setFKeyClass(
          `key ${a[0].includes("#") ? "sharp" : ""} ${
            correct ? "correct" : "wrong"
          } ${showCorrect && correct ? "marked" : ""} ${
            getInterval(played[0], a[0], notes, intervals)[0] === 0 &&
            showFirst &&
            !showIntervals &&
            !showNotes
              ? "first"
              : ""
          }}`
        );
        synth.play(a[0] + a[1]);
        window.setTimeout(() => {
          setFKeyClass(
            `key ${a[0].includes("#") ? "sharp" : ""} ${
              showCorrect && correct ? " marked" : ""
            } ${
              getInterval(played[0], a[0], notes, intervals)[0] === 0 &&
              showFirst &&
              !showIntervals &&
              !showNotes
                ? "first"
                : ""
            }`
          );
        }, 500);
      }}
    >
      <span
        style={{
          color:
            showFirst && getInterval(played[0], a[0], notes, intervals)[0] === 0
              ? "red"
              : "white",
        }}
      >
        {showNotes ? (
          <span>
            {a[0]}
            {a[1]}
          </span>
        ) : showFirst &&
          getInterval(played[0], a[0], notes, intervals)[0] === 0 &&
          !showIntervals &&
          !showCorrect ? (
          <span style={{ fontWeight: "100", fontSize: "larger" }}>◉</span>
        ) : (
          ""
        )}
        <span className={!showNotes ? "" : "intervalMarker"}>
          {showIntervals && getInterval(played[0], a[0], notes, intervals)[1]}
        </span>
      </span>
    </div>
  );
}
