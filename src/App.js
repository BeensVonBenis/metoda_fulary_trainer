import { createTuner } from "@chordbook/tuner";
import {
  Button,
  Col,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  OverlayTrigger,
  Row,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import * as Tone from "tone";
import "./App.scss";
import Gryf from "./Gryf";
import Klawisz from "./Klawisz";

function textToProgression(input, notes, harmonies) {
  try {
    const arr = input.split(/\s*[,\s;/]\s*/);
    const result = arr.map((a) => {
      let note = "";
      let mode = "";
      if (notes.includes(a[0].toLocaleLowerCase())) {
        if (a[1].toLocaleLowerCase() === "#") {
          const pos =
            (notes.findIndex((b) => b === a[0].toLocaleLowerCase()) + 1) % 12;
          note = notes[pos];
          a = a.slice(2);
        } else if (
          a[1].toLocaleLowerCase() === "b" &&
          a[2].toLocaleLowerCase() !== "l" &&
          a[2].toLocaleLowerCase() !== "o"
        ) {
          const pos = (notes.findIndex((b) => b === a[0]) - 1) % 12;
          note = notes[pos];
          a = a.slice(2);
        } else {
          note = a[0].toLocaleLowerCase();
          a = a.slice(1);
        }
        if (a[0] === "-") {
          mode = a.slice(1);
        } else {
          mode = a;
        }
        if (
          notes.includes(note.toLocaleLowerCase()) &&
          Object.keys(harmonies).includes(mode)
        ) {
          return [note.toLocaleLowerCase(), mode];
        } else {
          throw new Error("Niepoprawnie dane wejściowe!");
        }
      }
    });
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
}

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
    // Chords
    m7: [0, 2, 3, 7, 10],
    maj7: [0, 2, 4, 7, 11],
    7: [0, 2, 4, 7, 10],
    mb57: [0, 1, 3, 6, 10],
    mol5: [0, 3, 5, 7, 10],
    dur5: [0, 2, 4, 7, 9],
    m: [0, 3, 7], // Minor triad
    M: [0, 4, 7], // Major triad
    dim: [0, 3, 6], // Diminished triad
    aug: [0, 4, 8], // Augmented triad
    sus2: [0, 2, 7], // Suspended 2nd
    sus4: [0, 5, 7], // Suspended 4th
    m6: [0, 3, 7, 9], // Minor 6th
    M6: [0, 4, 7, 9], // Major 6th
    add9: [0, 4, 7, 14], // Major triad with added 9th
    madd9: [0, 3, 7, 14], // Minor triad with added 9th
    m9: [0, 3, 7, 10, 14], // Minor 9th
    M9: [0, 4, 7, 11, 14], // Major 9th
    9: [0, 4, 7, 10, 14], // Dominant 9th
    m11: [0, 3, 7, 10, 14, 17], // Minor 11th
    M11: [0, 4, 7, 11, 14, 17], // Major 11th
    11: [0, 4, 7, 10, 14, 17], // Dominant 11th
    m13: [0, 3, 7, 10, 14, 17, 21], // Minor 13th
    M13: [0, 4, 7, 11, 14, 17, 21], // Major 13th
    13: [0, 4, 7, 10, 14, 17, 21], // Dominant 13th

    // Scales
    majorScale: [0, 2, 4, 5, 7, 9, 11], // Major Scale
    minorScale: [0, 2, 3, 5, 7, 8, 10], // Natural Minor Scale
    harmonicMinor: [0, 2, 3, 5, 7, 8, 11], // Harmonic Minor Scale
    melodicMinor: [0, 2, 3, 5, 7, 9, 11], // Melodic Minor Scale
    majorPentatonic: [0, 2, 4, 7, 9], // Major Pentatonic Scale
    minorPentatonic: [0, 3, 5, 7, 10], // Minor Pentatonic Scale
    bluesScale: [0, 3, 5, 6, 7, 10], // Blues Scale
    dorian: [0, 2, 3, 5, 7, 9, 10], // Dorian Mode
    phrygian: [0, 1, 3, 5, 7, 8, 10], // Phrygian Mode
    lydian: [0, 2, 4, 6, 7, 9, 11], // Lydian Mode
    mixolydian: [0, 2, 4, 5, 7, 9, 10], // Mixolydian Mode
    aeolian: [0, 2, 3, 5, 7, 8, 10], // Aeolian Mode
    locrian: [0, 1, 3, 5, 6, 8, 10], // Locrian Mode
  };

  const [played, setPlayed] = useState(["a", "m7"]);
  const [showCorrect, setShowCorrect] = useState(true);
  const [showIntervals, setShowIntervals] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [showFirst, setShowFirst] = useState(true);
  const [mode, setMode] = useState(true);
  const [progError, setProgError] = useState(false);
  const [prog, setProg] = useState([]);
  const [meter, setMeter] = useState("4/4");
  const [bpm, setBpm] = useState(100);
  const [beat, setBeat] = useState(0);
  const [bar, setBar] = useState(0);
  const [meterError, setMeterError] = useState(false);
  const [metronom, setMetronom] = useState();
  let beatVar = 0;
  let barVar = 0;
  function click() {
    if (beatVar === 0) {
      if (mode === false) {
        barVar = (barVar + 1) % prog.length;
        setBar(barVar);
        setPlayed(prog[barVar]);
      }
    }
    setBeat(beatVar);
    beatVar = (beatVar + 1) % meter.split("/")[0];
  }
  return (
    <div className="App" data-bs-theme="dark">
      <div>
        <Table style={{ tableLayout: "fixed" }} className="opcjeTable">
          <thead>
            <tr>
              <th colSpan={2} style={{ width: "33%" }}>
                Opcje
              </th>
              <th colSpan={2} style={{ width: "33%" }}>
                Metronom
              </th>
              <th colSpan={2} style={{ width: "33%" }}>
                Ogrywane
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Button
                  variant={showNotes ? "success" : "secondary"}
                  onClick={() => setShowNotes((a) => !a)}
                >
                  {!showNotes ? "Pokazuj" : "Ukryj"} dźwięki
                </Button>
              </td>
              <td>
                <Button
                  variant={showIntervals ? "success" : "secondary"}
                  onClick={() => setShowIntervals((a) => !a)}
                >
                  {!showIntervals ? "Pokazuj" : "Ukryj"} interwały
                </Button>
              </td>
              <td colSpan={2} rowSpan={2}>
                <Row>
                  <Col>
                    <FormControl
                      name="metrum"
                      placeholder="metrum przykładowo 4/4 15/16"
                      type="text"
                      defaultValue={meter}
                      onChange={(event) => {
                        console.log(event.target.value.split("/"));
                        if (/^\d+\/\d+$/.test(event.target.value)) {
                          setMeterError(false);
                          setMeter(event.target.value);
                        } else {
                          setMeterError(true);
                        }
                      }}
                      style={{ borderColor: meterError ? "red" : "green" }}
                    ></FormControl>
                  </Col>
                  <Col>
                    <FormControl
                      name="tempo"
                      placeholder="tempo"
                      type="number"
                      defaultValue={bpm}
                      onChange={(event) => setBpm(event.target.value)}
                    ></FormControl>
                  </Col>
                </Row>
                <Table style={{ tableLayout: "fixed" }}>
                  <tr>
                    {[...new Array(parseInt(meter.split("/")[0]))].map(
                      (a, i) => (
                        <td style={{ color: beat === i ? "red" : "white" }}>
                          {i + 1}
                        </td>
                      )
                    )}
                  </tr>
                </Table>
                <Table style={{ tableLayout: "fixed" }}>
                  <tr>
                    <td>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!metronom) {
                            setBeat(0);
                            setBar(0);
                            beatVar = 0;
                            barVar = 0;
                            setMetronom(
                              setInterval(() => {
                                click();
                              }, (60 * 1000) / bpm)
                            );
                          } else {
                            setBeat(0);
                            setBar(0);
                            beatVar = 0;
                            barVar = 0;
                            clearInterval(metronom);
                            setMetronom(
                              setInterval(() => {
                                click();
                              }, (60 * 1000) / bpm)
                            );
                          }
                        }}
                      >
                        Startuj
                      </Button>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setBeat(0);
                          setBar(0);
                          beatVar = 0;
                          barVar = 0;
                          clearInterval(metronom);
                        }}
                      >
                        Zatrzymaj
                      </Button>
                    </td>
                  </tr>
                </Table>
              </td>
              <td colSpan={2}>
                <Button
                  variant={mode ? "primary" : "info"}
                  onClick={() => setMode((a) => !a)}
                  style={{ color: "white" }}
                >
                  {!mode ? "Progresja" : "Ciągły"}
                </Button>
              </td>
            </tr>
            <tr>
              <td>
                <Button
                  variant={showCorrect ? "success" : "secondary"}
                  onClick={() => setShowCorrect((a) => !a)}
                >
                  {!showCorrect ? "Zaznacz" : "Ukryj"} ogrywane
                </Button>
              </td>
              <td>
                <Button
                  variant={showFirst ? "success" : "secondary"}
                  onClick={() => setShowFirst((a) => !a)}
                >
                  {!showFirst ? "Zaznacz" : "Ukryj"} prymę
                </Button>
              </td>
              <td colSpan={2}>
                {mode ? (
                  <div>
                    <Row>
                      <Col>
                        <FormSelect
                          defaultValue={played[0]}
                          onChange={(event) =>
                            setPlayed((a) => [event.target.value, a[1]])
                          }
                        >
                          {notes.map((a, i) => (
                            <option value={a}>{a}</option>
                          ))}
                        </FormSelect>
                      </Col>
                      <Col>
                        <FormSelect
                          defaultValue={played[1]}
                          onChange={(event) =>
                            setPlayed((a) => [a[0], event.target.value])
                          }
                        >
                          <optgroup label="Najważniejsze">
                            <option value="m7">m7 - Molowa septyma</option>
                            <option value="maj7">
                              maj7 - Durowa septyma wielka
                            </option>
                            <option value="7">7 - Dominanta septymowa</option>
                            <option value="mb57">
                              mb57 - Półzmniejszony septymowy
                            </option>
                            <option value="majorScale">
                              majorScale - Skala durowa
                            </option>
                            <option value="minorScale">
                              minorScale - Skala molowa naturalna
                            </option>
                            <option value="bluesScale">
                              bluesScale - Skala bluesowa
                            </option>
                            <option value="majorPentatonic">
                              majorPentatonic - Skala pentatoniczna durowa
                            </option>
                            <option value="minorPentatonic">
                              minorPentatonic - Skala pentatoniczna molowa
                            </option>
                          </optgroup>
                          <optgroup label="Trójdźwięki">
                            <option value="m">m - Molowy akord</option>
                            <option value="M">M - Durowy akord</option>
                            <option value="dim">dim - Zmniejszony akord</option>
                            <option value="aug">aug - Zwiększony akord</option>
                            <option value="sus2">
                              sus2 - Zawieszony akord z sekundą
                            </option>
                            <option value="sus4">
                              sus4 - Zawieszony akord z kwartą
                            </option>
                          </optgroup>
                          <optgroup label="Czterodźwięki">
                            <option value="m7">m7 - Molowa septyma</option>
                            <option value="maj7">
                              maj7 - Durowa septyma wielka
                            </option>
                            <option value="7">7 - Dominanta septymowa</option>
                            <option value="mb57">
                              mb57 - Półzmniejszony septymowy
                            </option>
                            <option value="m6">m6 - Molowa seksta</option>
                            <option value="M6">M6 - Durowa seksta</option>
                            <option value="m9">m9 - Molowa nona</option>
                            <option value="M9">M9 - Durowa nona</option>
                            <option value="9">9 - Dominanta nona</option>
                          </optgroup>
                          <optgroup label="Pięciodźwięki i więcej">
                            <option value="add9">
                              add9 - Durowy akord z dodaną noną
                            </option>
                            <option value="madd9">
                              madd9 - Molowy akord z dodaną noną
                            </option>
                            <option value="m11">m11 - Molowa undecyma</option>
                            <option value="M11">M11 - Durowa undecyma</option>
                            <option value="11">11 - Dominanta undecyma</option>
                            <option value="m13">m13 - Molowa tercdecyma</option>
                            <option value="M13">M13 - Durowa tercdecyma</option>
                            <option value="13">
                              13 - Dominanta tercdecyma
                            </option>
                          </optgroup>
                          <optgroup label="Skale">
                            <option value="majorScale">
                              majorScale - Skala durowa
                            </option>
                            <option value="minorScale">
                              minorScale - Skala molowa naturalna
                            </option>
                            <option value="harmonicMinor">
                              harmonicMinor - Skala molowa harmoniczna
                            </option>
                            <option value="melodicMinor">
                              melodicMinor - Skala molowa melodyczna
                            </option>
                            <option value="majorPentatonic">
                              majorPentatonic - Skala pentatoniczna durowa
                            </option>
                            <option value="minorPentatonic">
                              minorPentatonic - Skala pentatoniczna molowa
                            </option>
                            <option value="bluesScale">
                              bluesScale - Skala bluesowa
                            </option>
                            <option value="dorian">
                              dorian - Skala dorycka
                            </option>
                            <option value="phrygian">
                              phrygian - Skala frygijska
                            </option>
                            <option value="lydian">
                              lydian - Skala lidyjska
                            </option>
                            <option value="mixolydian">
                              mixolydian - Skala miksolidyjska
                            </option>
                            <option value="aeolian">
                              aeolian - Skala eolska
                            </option>
                            <option value="locrian">
                              locrian - Skala lokrycka
                            </option>
                          </optgroup>
                        </FormSelect>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div>
                    <FormControl
                      style={{ borderColor: progError ? "red" : "green" }}
                      placeholder="Przykładowo A#m7 bbM c-bluesScale, akordy/scale oddzielaj od siebie spacjami, średnikami, myślnikami lub przecinkami a od dźwięków opcjonalnie myślnikiem"
                      as={"textarea"}
                      onChange={(event) => {
                        const asProg = textToProgression(
                          event.target.value,
                          notes,
                          harmonies
                        );

                        if (asProg && asProg[0] !== undefined) {
                          setProgError(false);
                          setProg(asProg);
                        } else {
                          setProgError(true);
                        }
                      }}
                    ></FormControl>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
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
              showCorrect={showCorrect}
              showIntervals={showIntervals}
              showNotes={showNotes}
              showFirst={showFirst}
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
              showCorrect={showCorrect}
              showIntervals={showIntervals}
              showNotes={showNotes}
              showFirst={showFirst}
            ></Klawisz>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
