"use client";

import React, { FC, useMemo } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useToast } from "@/components/ui/use-toast";
import { CanvasOnChange } from "../../../../../../../hooks/useCanvas";

interface ExcalidrawCanvasProps {
  onChange: CanvasOnChange;
  excRef: React.RefObject<ExcalidrawImperativeAPI>;
}

const ExcalidrawCanvas: FC<ExcalidrawCanvasProps> = ({ onChange, excRef }) => {
  const { toast } = useToast();

  const Exc = useMemo(
    () => (
      <Excalidraw
        UIOptions={{
          canvasActions: {
            toggleTheme: false,
          },
        }}
        onChange={(elements, state, files) => {
          if (Object.keys(files).length !== 0) {
            toast({
              title: "Could not save image",
              description:
                "We currently don't support saving images/files in the canvas",
              variant: "destructive",
            });
          }
          onChange(elements, state, files);
        }}
        ref={excRef}
      />
    ),
    [],
  );

  return Exc;
};

export default ExcalidrawCanvas;
