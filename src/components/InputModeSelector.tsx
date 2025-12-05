interface InputModeSelectorProps {
  mode: 'keyboard' | 'file';
  onChange: (mode: 'keyboard' | 'file') => void;
}

export const InputModeSelector = ({ mode, onChange }: InputModeSelectorProps) => (
  <div className="card">
    <h2>Input Mode</h2>
    <label>
      <input
        type="radio"
        name="inputMode"
        value="keyboard"
        checked={mode === 'keyboard'}
        onChange={() => onChange('keyboard')}
      />
      Keyboard
    </label>
    <label>
      <input
        type="radio"
        name="inputMode"
        value="file"
        checked={mode === 'file'}
        onChange={() => onChange('file')}
      />
      File Upload
    </label>
  </div>
);
