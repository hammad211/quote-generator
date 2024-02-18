import React, { useEffect, useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import './App.css';

function App() {
  const [advice, setAdvice] = useState('');
  const blockquoteRef = useRef(null);
  const divRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Fetch advice when the component mounts
    fetchAdvice();
  }, []);

  const fetchAdvice = () => {
    fetch('https://api.adviceslip.com/advice')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAdvice(data.slip.advice);
      })
      .catch((error) => {
        console.error('Error fetching advice:', error);
      });
  };

  const convertToImage = () => {
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const blockquote = blockquoteRef.current;
      const div = divRef.current;

      canvas.style.display = " ";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const divStyle = {
        font: '2rem "Arial", sans-serif',
        fontWeight: 60,
        fontSize: '2rem',
        maxWidth: '600px',
        lineHeight: 1,
        position: 'relative',
        margin: '0',
        padding: '.5rem',
        backgroundColor: 'wheat',
        display: "flex",
	      alignItems: "center",
	       justifyContent: "center"
      };

      Object.assign(div.style, divStyle);
      const quoteImage = new Image();
      quoteImage.src = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${div.outerHTML}</div></foreignObject></svg>`);

      quoteImage.onload = () => {
        ctx.drawImage(quoteImage, 0, 0);
        canvas.toBlob((blob) => {
          saveAs(blob, 'quote.png');
        });
      };
    } catch (error) {
      console.error('Error converting to image:', error);
    }
  };


  return (
    <div className="body1 border" >
      <div ref={divRef}>
        <blockquote ref={blockquoteRef}>{advice}</blockquote>
      </div>
      <div className='buttonss'>
      <button className="button-33" role="button" onClick={fetchAdvice}>
        New
      </button>
      &nbsp; &nbsp;&nbsp;      &nbsp; &nbsp;&nbsp;
      <button className="button-33" role="button" onClick={convertToImage}>
        Download
      </button>
      </div>
      <div style={{display:"none"}}>
      <canvas style={{ visibility: 'hidden' }} ref={canvasRef} width="600px" height="200px" />
      </div>
    </div>
  );
}

export default App;
