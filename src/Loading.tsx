import React from "react";

/**
 * テクスチャをロード中に表示されるテキスト
 */
const Loading = () => {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <p
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        現実から醒めると、不思議な花園にいた……
      </p>
    </div>
  );
};

export default Loading;
