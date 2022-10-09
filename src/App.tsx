import React, { Suspense } from "react";
import "./App.css";
import Dream from "./dream";

function App() {
  return (
    <Suspense fallback={<p></p>}>
      <Dream />
    </Suspense>
  );
}

export default App;
