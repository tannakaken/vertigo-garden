import React, { Suspense } from "react";
import "./App.css";
import Dream from "./dream";
import Loading from "./Loading";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dream />
    </Suspense>
  );
}

export default App;
