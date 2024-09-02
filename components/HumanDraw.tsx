import React, { useRef, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';

const HumanDraw = ({ onSubmit }: { onSubmit: (drawing: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const drawing = canvas.toDataURL();
    onSubmit(drawing);

    // Add necessary OpenAI call for AI guessing
    const response = await fetch('/api/openaiedge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ drawing }),
    });

    const result = await response.json();
    console.log('AI Guess:', result);
  };

  return (
    <Box>
      <canvas
        ref={canvasRef}
        width="500"
        height="500"
        style={{ border: '1px solid black' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <Button onClick={handleSubmit} mt={4}>
        Submit Drawing
      </Button>
    </Box>
  );
};

export default HumanDraw;
