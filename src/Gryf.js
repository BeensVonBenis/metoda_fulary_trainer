import { Table } from "react-bootstrap";
import "./Gryf.css";

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

export default function Gryf({ notes, grane, strings, range }) {
  return (
    <div className="Gryf">
      <Table>
        {strings.reverse().map((a, i) => (
          <Struna
            key={i}
            notes={notes}
            grane={grane}
            self={a}
            range={range}
          ></Struna>
        ))}
      </Table>
    </div>
  );
}
function Struna({ notes, grane, strings, self, range }) {
  const onString = getOnString(notes, self, range);
  return (
    <tr className="Struna">
      {onString.map((a, i) => (
        <th>{a[0]}</th>
      ))}
    </tr>
  );
}
