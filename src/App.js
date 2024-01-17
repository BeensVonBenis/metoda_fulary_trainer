import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, useRef } from "react";

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
  function dzwiekiEtiudy() {
    const startingSound = dzwieki.indexOf(dzwAkordowy);
    const buffer = [];
    for (let i = 0; i < modulacje[modAkordowy].length; i++) {
      // buffer[i] = dzwieki[modulacje[modAkordowy][i] + (startingSound % 12)];
      buffer[i] = dzwieki[(startingSound + modulacje[modAkordowy][i]) % 12];
    }
    setOgrywane(buffer);
  }
  useEffect(() => {
    dzwiekiEtiudy();
  }, [dzwAkordowy, modAkordowy]);
  const dzwRef = useRef(null);
  const modRef = useRef(null);
  return (
    <div className="App">
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
      <div className="gryf">
        {struny.toReversed().map((a) => (
          <Struna nuta={a} dzwieki={dzwieki} ogrywane={ogrywane}></Struna>
        ))}
      </div>
    </div>
  );
}
function Struna(props) {
  const { nuta, dzwieki, ogrywane } = props;
  let dzwStruny = dzwieki
    .concat(dzwieki)
    .slice(dzwieki.findIndex((a) => a === nuta));
  dzwStruny = dzwStruny.slice(0, dzwieki.length + 1);
  return (
    <div className="struna">
      {dzwStruny.map((a) => (
        <span
          className="dzwiek"
          style={{ backgroundColor: ogrywane.includes(a) ? "red" : "white" }}
        >
          {a}
        </span>
      ))}
    </div>
  );
}
export default App;
