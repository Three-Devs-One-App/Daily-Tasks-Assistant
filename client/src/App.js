import { useEffect, useState } from "react";

function App() {
  const [obj, setObj] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/api") // Take the redirected port from docker composed
      .then((res) => res.json())
      .then((data) => setObj(data));
  }, []);

  if (obj === {}) {
    return <div>Loading</div>;
  }
  return (
    <div>
      <h2>{obj.channel}</h2>
      <h1>{obj.tutorial}</h1>
    </div>
  );
}

export default App;
