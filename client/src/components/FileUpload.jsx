import { useState, useRef } from 'react';
import { UploadCloud, X, File, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FileUpload = ({
  accept = 'image/*',
  multiple = false,
  maxSizeMB = 10,
  onUploadSelect,
  placeholder = 'Click or drag to upload',
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is ${maxSizeMB}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (!multiple) {
      setFiles([validFiles[0]]);
      if (validFiles[0].type.startsWith('image/')) {
        setPreviews([URL.createObjectURL(validFiles[0])]);
      } else {
        setPreviews([]);
      }
      onUploadSelect(validFiles[0]);
    } else {
      setFiles((prev) => [...prev, ...validFiles]);
      const newPreviews = validFiles.map((file) =>
        file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      );
      setPreviews((prev) => [...prev, ...newPreviews]);
      onUploadSelect([...files, ...validFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    
    // Revoke object URL to prevent memory leaks
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
    onUploadSelect(multiple ? newFiles : null);
  };

  return (
    <div className={className}>
      {(!files.length || multiple) && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer
            transition-all duration-200
            ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:bg-bg-card hover:border-border-light'}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <UploadCloud className={`w-10 h-10 mb-3 ${dragActive ? 'text-primary' : 'text-text-muted'}`} />
          <p className="text-sm font-medium text-text-primary text-center">
            {placeholder}
          </p>
          <p className="text-xs text-text-muted mt-2 text-center">
            Max size: {maxSizeMB}MB
          </p>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group bg-bg-card rounded-lg overflow-hidden border border-border">
              {previews[index] ? (
                <div className="aspect-video relative">
                  <img src={previews[index]} alt="preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-bg-secondary p-3 text-center">
                  <div className="flex flex-col items-center">
                    <File className="text-text-secondary mb-1" size={24} />
                    <span className="text-xs text-text-secondary truncate w-full px-2" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                  className="p-2 bg-error/90 text-white rounded-full hover:bg-error transition-colors transform shadow-lg"
                  title="Remove"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
