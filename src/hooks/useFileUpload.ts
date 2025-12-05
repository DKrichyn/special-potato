import { useState } from 'react';
import { FileParseResult } from '../core/types';
import { parseProblemFromText } from '../core/parsers/fileParser';

export const useFileUpload = () => {
  const [parseResult, setParseResult] = useState<FileParseResult | undefined>();

  const handleFile = async (file: File): Promise<void> => {
    const content = await file.text();
    const result = parseProblemFromText(content);
    setParseResult(result);
  };

  return { parseResult, handleFile };
};
