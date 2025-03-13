// FileViewer.jsx
import React from 'react';

const FileViewer = ({ content, onClose }) => {
  return (
    <div className="file-viewer">
      <pre>{content}</pre>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default FileViewer;
