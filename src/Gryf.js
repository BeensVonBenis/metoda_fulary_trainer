import { Table } from "react-bootstrap";
import "./Gryf.scss";
import { useState } from "react";

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

export default function Gryf({ notes, grane, strings, range, markers }) {
  return (
    <div className="Gryf">
      <Table
        striped
        bordered
        style={{ tableLayout: "fixed" }}
        className="table"
      >
        <tbody>
          {[...strings].reverse().map((a, i) => (
            <Struna
              key={i}
              notes={notes}
              grane={grane}
              self={a}
              range={range}
              markers={markers}
            ></Struna>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
function Struna({ notes, grane, strings, self, range, markers }) {
  const onString = getOnString(notes, self, range);

  return (
    <tr className="Struna">
      {onString.map((a, i) => (
        <Fret key={i} markers={markers} a={a} i={i}></Fret>
      ))}
    </tr>
  );
}
function Fret({ a, markers, i }) {
  const [fretClass, setFretClass] = useState("fret");
  return (
    <th className={fretClass}>
      <div
        onClick={() => {
          setFretClass("fret correct");
          console.log("sex");
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
