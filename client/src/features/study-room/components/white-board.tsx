import { useEffect, useRef, useState } from "react";
import { Paintbrush, Eraser, RotateCcw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { IoCloseOutline } from "react-icons/io5";

interface CollaborativeWhiteboardProps {
  roomId: string;
  handleClose: () => void;
}

type Tool = "brush" | "eraser";

export const CollaborativeWhiteboard = ({
  handleClose,
}: CollaborativeWhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const drawLine = (x0: number, y0: number, x1: number, y1: number) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
      context.lineWidth = brushSize;
      context.lineCap = "round";
      context.stroke();
      context.closePath();
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsDrawing(true);
      setStartPos({ x: e.offsetX, y: e.offsetY });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawing || !startPos) return;

      const { offsetX, offsetY } = e;
      drawLine(startPos.x, startPos.y, offsetX, offsetY);
      setStartPos({ x: offsetX, y: offsetY });

      // Uncomment for socket transactions
      // socketState.socket?.emit("draw", { x0: startPos.x, y0: startPos.y, x1: offsetX, y1: offsetY, color, brushSize, tool, roomId });
    };

    const onMouseUp = () => {
      setIsDrawing(false);
      setStartPos(null);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseout", onMouseUp);

    // Uncomment for socket transactions
    // socketState.socket.on("draw", ({ x0, y0, x1, y1, color, brushSize, tool }) => {
    //   context.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    //   context.lineWidth = brushSize;
    //   drawLine(x0, y0, x1, y1);
    // });

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseout", onMouseUp);

      // Uncomment for socket transactions
      // socketState.socket?.off("draw");
    };
  }, [isDrawing, startPos, color, brushSize, tool]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="bg-white pt-2 pb-6 px-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center w-[30px] group h-[30px] rounded-md  hover:bg-accent">
          <IoCloseOutline
            className="text-2xl font-medium group-hover:text-white"
            onClick={handleClose}
          />
        </div>
      </div>
      {/* <h3 className="text-2xl font-semibold mb-4">Collaborative Whiteboard</h3> */}
      <div className="flex flex-wrap gap-4 mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="">
              <Button
                variant={tool === "brush" ? "default" : "outline"}
                size="icon"
                onClick={() => setTool("brush")}
              >
                <Paintbrush className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Brush</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={tool === "eraser" ? "default" : "outline"}
                size="icon"
                onClick={() => setTool("eraser")}
                className="bg-white "
              >
                <Eraser className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Eraser</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={clearCanvas}
                className="bg-white "
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Canvas</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={downloadCanvas}
                className="bg-white "
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Canvas</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded-md border-none"
        />
      </div>
      <div className="flex items-center gap-4 mb-4 border-none">
        <span className="text-sm font-medium ">Brush Size:</span>
        <Slider
          value={[brushSize]}
          onValueChange={(value) => setBrushSize(value[0])}
          max={20}
          step={1}
          className="w-[200px]"
        />
        <span className="text-sm font-medium">{brushSize}px</span>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-input rounded-md w-full h-auto"
      />
    </div>
  );
};
