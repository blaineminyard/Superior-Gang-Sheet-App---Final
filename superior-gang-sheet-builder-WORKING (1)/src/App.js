import React, { useRef, useState, useEffect } from 'react';
import { fabric } from 'fabric';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [background, setBackground] = useState('#ffffff');
  const [canvasSize, setCanvasSize] = useState({ width: 1600, height: 2400 });

  useEffect(() => {
    fabricRef.current = new fabric.Canvas('canvas', {
      backgroundColor: background,
      preserveObjectStacking: true,
    });

    fabricRef.current.setWidth(canvasSize.width);
    fabricRef.current.setHeight(canvasSize.height);
    fabricRef.current.renderAll();

    return () => fabricRef.current.dispose();
  }, [background, canvasSize]);

  const handleImageUpload = (e) => {
    Array.from(e.target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        fabric.Image.fromURL(reader.result, (img) => {
          img.set({ left: 100, top: 100, scaleX: 0.25, scaleY: 0.25 });
          fabricRef.current.add(img);
          fabricRef.current.setActiveObject(img);
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const clearCanvas = () => {
    fabricRef.current.clear();
    fabricRef.current.setBackgroundColor(background, fabricRef.current.renderAll.bind(fabricRef.current));
  };

  const undo = () => {
    const objs = fabricRef.current.getObjects();
    if (objs.length > 0) {
      fabricRef.current.remove(objs[objs.length - 1]);
    }
  };

  const handleSizeChange = (e) => {
    const [width, height] = e.target.value.split('x').map(Number);
    setCanvasSize({ width: Math.round(width * 72), height: Math.round(height * 72) });
  };

  const handleBgChange = (e) => {
    setBackground(e.target.value);
    fabricRef.current.setBackgroundColor(e.target.value, fabricRef.current.renderAll.bind(fabricRef.current));
  };

  return (
    <div className="App">
      <h1>Superior Gang Sheet Builder</h1>
      <div className="controls">
        <label>Sheet Size:</label>
        <select onChange={handleSizeChange}>
          <option value="22.3x24">22.3 x 24</option>
          <option value="22.3x36">22.3 x 36</option>
          <option value="22.3x48">22.3 x 48</option>
          <option value="22.3x60">22.3 x 60</option>
          <option value="22.3x72">22.3 x 72</option>
          <option value="22.3x84">22.3 x 84</option>
          <option value="22.3x96">22.3 x 96</option>
          <option value="22.3x120">22.3 x 120</option>
          <option value="22.3x144">22.3 x 144</option>
          <option value="22.3x240">22.3 x 240</option>
        </select>
        <label>Background Color:</label>
        <input type="color" value={background} onChange={handleBgChange} />
        <input type="file" onChange={handleImageUpload} multiple />
        <button onClick={clearCanvas}>Clear Canvas</button>
        <button onClick={undo}>Undo</button>
      </div>
      <canvas id="canvas" ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
