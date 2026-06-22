import { useState, useCallback, useEffect, useRef } from "react"
import { uploadImage } from "../services/api"

export default function UploadDropzone({ onUploaded, resetKey }) {
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    // when resetKey changes, clear uploaded files
    setFiles([])
  }, [resetKey])

  const handleFiles = useCallback(async (fileList) => {
    const arr = Array.from(fileList)
    const items = arr.map(f => ({ file: f, preview: URL.createObjectURL(f), response: null }))
    // add previews immediately
    setFiles(prev => [...prev, ...items])
    // auto upload first file and notify parent
    try {
      const response = await uploadImage(arr[0])
      if (onUploaded) onUploaded(response)
      // reset native input so same file can be chosen again
      try { if (inputRef.current) inputRef.current.value = null } catch (e) {}
    } catch (e) {
      console.error(e)
    }
  }, [onUploaded])

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const dt = e.dataTransfer
    if (dt && dt.files && dt.files.length) {
      handleFiles(dt.files)
    }
  }

  function onDragOver(e) {
    e.preventDefault()
    setDragOver(true)
  }

  function onDragLeave(e) {
    e.preventDefault()
    setDragOver(false)
  }

  return (
    <div>
      <div className={`dropzone card p-4 ${dragOver ? 'dragover' : ''}`} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
          <div className="flex items-center justify-between">
          <div>
            <strong>Upload Question</strong>
            <div style={{color: 'var(--text-secondary)'}}>Drag & drop images here or click to attach</div>
          </div>
          <div>
            <input ref={inputRef} id="upload-input" type="file" accept="image/*" onChange={(e) => handleFiles(e.target.files)} style={{display: 'none'}} />
            <button className="btn-ghost" onClick={() => inputRef.current && inputRef.current.click()}>Choose file</button>
          </div>
        </div>
        {files.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {files.map((item, i) => (
              <div key={i} className="thumb card p-2 relative">
                <button className="absolute right-1 top-1 text-sm" onClick={() => {
                  // remove this file preview
                  setFiles(prev => prev.filter((_, idx) => idx !== i))
                  // reset native input so same file can be chosen again
                  try { if (inputRef.current) inputRef.current.value = null } catch (e) {}
                  // notify parent to clear message if this was uploaded
                  if (item.response && onUploaded) onUploaded({ question: '' })
                }}>Remove</button>
                <img src={item.preview} alt={item.file.name} style={{width: '100%', height: 80, objectFit: 'cover', borderRadius: 8}} />
                <div style={{color: 'var(--text-secondary)', fontSize: 12}} className="mt-1">{item.file.name}</div>
              </div>
            ))}
            <div className="col-span-4 mt-2">
              <button className="btn-ghost" onClick={() => { setFiles([]); try { if (inputRef.current) inputRef.current.value = null } catch (e) {} if (onUploaded) onUploaded({ question: '' }) }}>Clear All</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
