import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/rubyblue.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const modeOptions = {
    javascript: { name: 'javascript', json: true },
    python: { name: 'python' },
    cplusplus: { name: 'text/x-c++src' },
    java: { name: 'text/x-java' },
    xml: { name: 'xml' },
  };
  const themeOptions = [
    'dracula',
    '3024-day',
    '3024-night',
    'eclipse',
    'material',
    'rubyblue',
  ];

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtimeEditor'),
        {
          mode: modeOptions.javascript,
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on('change', (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  const handleModeChange = (e) => {
    const mode = e.target.value;
    editorRef.current.setOption('mode', modeOptions[mode]);
  };

  const handleThemeChange = (e) => {
    const theme = e.target.value;
    editorRef.current.setOption('theme', theme);
  };

  const handleRunCode = () => {
    // Execute the code here
    const code = editorRef.current.getValue();
    // You can execute the code using eval() or any other appropriate method
    // For demonstration purposes, just log the code
    console.log('Running code:', code);
  };

  return (
    <>
      <div className='menu' style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <label htmlFor="mode-select">Language:</label>
          <select id="mode-select" onChange={handleModeChange}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cplusplus">C++</option>
            <option value="java">Java</option>
            <option value="xml">XML</option>
          </select>
        </div>
        <div>
          <label htmlFor="theme-select">Theme:</label>
          <select id="theme-select" onChange={handleThemeChange}>
            {themeOptions.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '5px', cursor: 'pointer', marginLeft: '1rem', fontSize: '1.1rem' }} onClick={handleRunCode}>Run</button>
        </div>
      </div>
      <textarea id="realtimeEditor"></textarea>
      <div className='down'>
        <div class="h-50">
          <label for="Input" class="text-light mt-4 mb-2">Input</label>
          <textarea type="text" id="input" class="form-control h-75" aria-label="Last name"></textarea>
        </div>
        <div class="h-50">
          <label for="Output" class="text-light mb-2">Output</label>
          <textarea type="text" id="output" class="form-control h-75" aria-label="Last name"></textarea>
        </div>
      </div>
    </>
  );
};

export default Editor;
