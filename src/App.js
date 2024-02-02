import "./App.css";
import { useState, useEffect, useRef } from "react";

let intervalid = "";
let progresja = [];
let metrum = 0;
let grany = 0;
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
  const struny = ["e", "a", "d", "g", "b", "e"];
  const modulacje = {
    m7: [0, 2, 3, 7, 10],
    maj7: [0, 2, 4, 7, 11],
    7: [0, 2, 4, 7, 10],
    mb57: [0, 1, 3, 6, 10],
  };
  const [dzwAkordowy, setDzwAkordowy] = useState("a");
  const [modAkordowy, setModAkordowy] = useState("m7");
  const [ogrywane, setOgrywane] = useState([]);
  const [pokazujGryf, setPokazujGryf] = useState(true);
  const [pokazujGrane, setPokazujGrane] = useState(true);
  const [pokazujPryme, setPokazujPryme] = useState(false);
  const [metronom, setMetronom] = useState(metrum);
  const [trafione, setTrafione] = useState(null);
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
    console.log(metrum);
    if (metrum === 4) {
      metrum = 0;

      if (grany < progresja.length - 1) {
        grany = grany + 1;
      } else {
        grany = 0;
      }
      if (progresja[grany].includes("#")) {
        setDzwAkordowy(progresja[grany][0] + "#");
        setModAkordowy(...progresja[grany].slice(2));
      } else {
        setDzwAkordowy(...progresja[grany][0]);
        setModAkordowy(progresja[grany].slice(1));
      }
    }
  }
  async function grajProg() {
    progresja = progRef.current.value.split(" ").map((a) => a.trim());
    const delay = (60 * 1000) / bpmRef.current.value;
    clearInterval(intervalid);
    if (delay === Infinity) {
      metronomClick();
    } else {
      intervalid = setInterval(metronomClick, delay);
    }
  }
  function grajSolo(dzwiek) {
    metronomClick();
    if (ogrywane.includes(dzwiek)) {
      setTrafione(true);
    } else {
      setTrafione(false);
    }
  }
  console.log(trafione);
  return (
    <div
      className="App"
      style={{
        backgroundColor: trafione
          ? "rgba(34, 239, 36, 0.15)"
          : "rgba(240, 34, 34, 0.15)",
      }}
    >
      <div>
        Akord:{" "}
        <select
          ref={dzwRef}
          onChange={() => setDzwAkordowy(dzwRef.current.value)}
        >
          {dzwieki.map((a) => (
            <option value={a}>{a}</option>
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
        </select>
      </div>
      <div>
        Progresja: <input type="text" ref={progRef}></input>
        BPM w 4/4: <input type="number" ref={bpmRef}></input>
        <button onClick={() => grajProg()}>Zatwierdź</button>
      </div>
      <div className="opcje">
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
          {struny.toReversed().map((a) => (
            <Struna
              nuta={a}
              dzwieki={dzwieki}
              ogrywane={ogrywane}
              pokazujGryf={pokazujGryf}
              pokazujPryme={pokazujPryme}
              pokazujGrane={pokazujGrane}
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
    dzwieki,
    ogrywane,
    pokazujGryf,
    pokazujGrane,
    pokazujPryme,
    grajSolo,
  } = props;
  let dzwStruny = dzwieki
    .concat(dzwieki)
    .slice(dzwieki.findIndex((a) => a === nuta));
  dzwStruny = dzwStruny.slice(0, dzwieki.length + 1);
  return (
    <div className="struna">
      {dzwStruny.map((a) => (
        <span
          onClick={() => grajSolo(a)}
          className={"dzwiek " + (pokazujPryme && a === ogrywane[0] && "pryma")}
          style={{
            backgroundColor:
              ogrywane.includes(a) && pokazujGrane ? "red" : "white",
          }}
        >
          {pokazujGryf ? a : "⠀"}
        </span>
      ))}
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
  console.log(grany);
  return (
    <div>
      {progresja.map((a, b) => (
        <span style={{ color: grany === b ? "red" : "black" }}>{a} </span>
      ))}
    </div>
  );
}

export default App;
