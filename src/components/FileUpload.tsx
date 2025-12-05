interface FileUploadProps {
  onFile: (file: File) => void;
  helperText?: string;
}

export const FileUpload = ({ onFile, helperText }: FileUploadProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFile(file);
    }
  };

  return (
    <div className="card">
      <h2>Upload Data</h2>
      <input type="file" accept=".txt" onChange={handleChange} />
      {helperText ? <p>{helperText}</p> : null}
    </div>
  );
};
