"use client";

import React, { createContext, useContext, useState } from "react";

const CursorContext = createContext();

export const CursorProvider = ({ children }) => {
  const [variant, setVariant] = useState("default");
  const [cursorText, setCursorText] = useState("");
  const [maskSize, setMaskSize] = useState(16); // Varsayılan cursor çapı (8px radius * 2)

  return (
    <CursorContext.Provider value={{ 
      variant, 
      setVariant, 
      cursorText, 
      setCursorText,
      maskSize,
      setMaskSize 
    }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) throw new Error("useCursor must be used within a CursorProvider");
  return context;
};