import React, { Suspense } from "react";
import "./App.css";
import DreamWorld from "./DreamWorld";
import Loading from "./Loading";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <DreamWorld />
    </Suspense>
  );
}

export default App;
