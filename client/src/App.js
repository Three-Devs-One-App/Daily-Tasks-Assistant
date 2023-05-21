import { useEffect, useState } from "react";

function App() {
  const [obj, setObj] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then((res) => res.json())
      .then((data) => setObj(data));
  }, []);

  if (obj === {}) {
    return <div>Loading</div>;
  }
  return (
    <div>
      <h1>{obj.channel}</h1>
      <h1>{obj.tutorial}</h1>
    </div>
  );
}

export default App;
