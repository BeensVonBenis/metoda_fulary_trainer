import "./App.css";
import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

let intervalid = "";
let progresja = [];
let metrum = 0;
let grany = 0;

const synth = new Tone.Synth().toDestination();
const drum = new Tone.MembraneSynth().toDestination();

function App() {
  const dzwieki = [
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
  ];
  const interwaly = [
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
  const struny = [
    ["e", 2],
    ["a", 2],
    ["d", 3],
    ["g", 3],
    ["b", 3],
    ["e", 4],
  ];
  const modulacje = {
    m7: [0, 2, 3, 7, 10],
    maj7: [0, 2, 4, 7, 11],
    7: [0, 2, 4, 7, 10],
    mb57: [0, 1, 3, 6, 10],
    mol: [0, 3, 5, 7, 10],
    dur: [0, 2, 4, 7, 9],
  };
  const [dzwAkordowy, setDzwAkordowy] = useState("a");
  const [modAkordowy, setModAkordowy] = useState("m7");
  const [ogrywane, setOgrywane] = useState([]);
  const [pokazujGryf, setPokazujGryf] = useState(true);
  const [pokazujGrane, setPokazujGrane] = useState(true);
  const [pokazujPryme, setPokazujPryme] = useState(false);
  const [pokazujInterwaly, setPokazujInterwaly] = useState(false);
  const [grajDzwieki, setGrajDzwieki] = useState(true);
  const [metronom, setMetronom] = useState(metrum);
  const [trafione, setTrafione] = useState(null);
  const [metronomOn, setMetronomOn] = useState(false);
  function dzwiekiEtiudy() {
    const startingSound = dzwieki.indexOf(dzwAkordowy);
    const buffer = [];
    for (let i = 0; i < modulacje[modAkordowy].length; i++) {
      buffer[i] = dzwieki[(startingSound + modulacje[modAkordowy][i]) % 12];
    }
    setOgrywane(buffer);
  }
  useEffect(() => {
    dzwiekiEtiudy();
  }, [dzwAkordowy, modAkordowy]);
  const dzwRef = useRef(null);
  const modRef = useRef(null);
  const progRef = useRef(null);
  const bpmRef = useRef(null);

  function metronomClick() {
    setMetronom(((metrum + 1) % 4) + 1);
    metrum++;
    if (metrum === 4) {
      metrum = 0;
      drum.triggerAttackRelease("D4", "8n");

      if (grany < progresja.length - 1) {
        grany = grany + 1;
      } else {
        grany = 0;
      }
      if (!(progresja.length === 0 || progresja[0] === "")) {
        if (progresja[grany].includes("#")) {
          setDzwAkordowy(progresja[grany][0] + "#");
          setModAkordowy(...progresja[grany].slice(2));
        } else {
          setDzwAkordowy(...progresja[grany][0]);
          setModAkordowy(progresja[grany].slice(1));
        }
      }
    } else {
      drum.triggerAttackRelease("C2", "8n");
    }
  }
  async function grajProg() {
    progresja = progRef.current.value
      .split(" ")
      .map((a) => a.trim())
      .map((a) => a.toLowerCase());
    const delay = (60 * 1000) / bpmRef.current.value;
    clearInterval(intervalid);
    if (delay === Infinity) {
      setMetronomOn(false);
      metronomClick();
    } else {
      setMetronomOn(true);
      setMetronom(1);
      metrum = 0;
      grany = 0;
      intervalid = setInterval(metronomClick, delay);
    }
  }
  function grajSolo(dzwiek, oktawa) {
    console.log(dzwiek);
    if (!metronomOn && oktawa !== "mute") {
      metronomClick();
    }
    if (grajDzwieki) {
      if (oktawa !== "mute") {
        synth.triggerAttackRelease(`${dzwiek}${oktawa}`, `8n`);
      }
    }
    console.log(ogrywane.includes(dzwiek));
    console.log(ogrywane);
    if (ogrywane.includes(dzwiek)) {
      setTrafione(true);
    } else {
      setTrafione(false);
    }
  }
  window.setTimeout(() => {
    getNoteFromTuner();
  }, 10);
  const [noteFromTuner, setNoteFromTuner] = useState("");
  function getNoteFromTuner() {
    const note = document
      .getElementById("tuner")
      .contentWindow.document.body.innerText.split("\n")[0];
    setNoteFromTuner(note);
    if (note !== "Aktywuj" && note) grajSolo(noteFromTuner, "mute");
  }
  const iframe =
    '<iframe id="tuner" src="https://piotr.it-consultingtk.pl/metodafularytrainer/tuner.html" allow="camera; microphone" width="540" height="50"></iframe>';
  useEffect(() => {
    window.setInterval(getNoteFromTuner, 1000);
  }, []);
  return (
    <div
      className="App"
      style={{
        backgroundColor: trafione
          ? "rgba(34, 239, 36, 0.15)"
          : "rgba(240, 34, 34, 0.15)",
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: iframe }} />
      <div>
        Akord:{" "}
        <select
          ref={dzwRef}
          onChange={() => setDzwAkordowy(dzwRef.current.value)}
        >
          {dzwieki.map((a, b) => (
            <option key={b} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          ref={modRef}
          onChange={() => setModAkordowy(modRef.current.value)}
        >
          <option value={"m7"}>m7</option>
          <option value={"maj7"}>maj7</option>
          <option value={"7"}>7</option>
          <option value={"mb57"}>mb57</option>
          <option value={"mol"}>mol</option>
          <option value={"dur"}>dur</option>
        </select>
      </div>
      <div>
        Progresja: <input type="text" ref={progRef}></input>
        BPM w 4/4: <input type="number" ref={bpmRef}></input>
        <button onClick={() => grajProg()}>Zatwierdź</button>
      </div>
      <div className="opcje">
        <label>Graj dźwięki</label>
        <input
          onClick={() => setGrajDzwieki((a) => !a)}
          type="checkbox"
          defaultChecked
        ></input>
        <br></br>
        <label>Pokazuj dźwięki na gryfie</label>
        <input
          defaultChecked
          onClick={() => setPokazujGryf((a) => !a)}
          type="checkbox"
        ></input>
        <br></br>
        <label>Pokazuj dźwięki etiudy</label>
        <input
          defaultChecked
          input
          onClick={() => setPokazujGrane((a) => !a)}
          type="checkbox"
        ></input>
        <br></br>
        <label>Zaznacz prymę</label>
        <input
          onClick={() => setPokazujPryme((a) => !a)}
          type="checkbox"
        ></input>
        <br></br>
        <label>Pokazuj interwały</label>
        <input
          onClick={() => setPokazujInterwaly((a) => !a)}
          type="checkbox"
        ></input>
        <br></br>
      </div>
      <br></br>
      <Progresja metronom={metronom} grany={grany}></Progresja>
      <h1 style={{ marginTop: "0px" }}>
        {" "}
        {dzwAkordowy}
        {modAkordowy}
      </h1>
      <Metronom metronom={metronom}></Metronom>
      <div className="granie">
        <div className="gryf">
          {struny.toReversed().map((a, i) => (
            <Struna
              key={i}
              nuta={a[0]}
              oktawa={a[1]}
              dzwieki={dzwieki}
              interwaly={interwaly}
              ogrywane={ogrywane}
              pokazujGryf={pokazujGryf}
              pokazujPryme={pokazujPryme}
              pokazujGrane={pokazujGrane}
              pokazujInterwaly={pokazujInterwaly}
              metronomClick={metronomClick}
              grajSolo={grajSolo}
            ></Struna>
          ))}
        </div>
      </div>
    </div>
  );
}
function Struna(props) {
  const {
    nuta,
    oktawa,
    dzwieki,
    interwaly,
    ogrywane,
    pokazujGryf,
    pokazujGrane,
    pokazujPryme,
    pokazujInterwaly,
    grajSolo,
  } = props;
  let dzwStruny = dzwieki
    .concat(dzwieki)
    .slice(dzwieki.findIndex((a) => a === nuta));
  dzwStruny = dzwStruny.slice(0, dzwieki.length + 1);
  const nowaOktawa = dzwStruny.findIndex((a) => a === "c");
  const pryma = dzwStruny.findIndex((a) => a === ogrywane[0]);
  return (
    <div className="struna">
      {dzwStruny.map((a, i) => {
        return (
          <span
            key={i}
            onClick={() => grajSolo(a, oktawa + (i >= nowaOktawa))}
            className={
              "dzwiek " + (pokazujPryme && a === ogrywane[0] && "pryma")
            }
            style={{
              backgroundColor:
                ogrywane.includes(a) && pokazujGrane ? "red" : "white",
            }}
          >
            {pokazujInterwaly && (
              <div className="interwal">{interwaly[(i - pryma + 12) % 12]}</div>
            )}
            {pokazujGryf ? a : "⠀"}
          </span>
        );
      })}
    </div>
  );
}

function Metronom(props) {
  const { metronom } = props;
  return (
    <div style={{ width: "100px" }} className="metronom">
      <span style={{ float: metronom % 2 !== 0 ? "left" : "right" }}>|</span>
      <span>{metronom}</span>
    </div>
  );
}

function Progresja(props) {
  const { grany } = props;
  return (
    <div>
      {progresja.map((a, b) => (
        <span key={b} style={{ color: grany === b ? "red" : "black" }}>
          {a}{" "}
        </span>
      ))}
    </div>
  );
}

export default App;
