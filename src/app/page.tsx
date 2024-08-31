'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Upload, FileAudio, CheckCircle, XCircle } from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [output, setOutput] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      setSelectedFile(fileInput.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an AAC file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', selectedFile);

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const response = await fetch('http://localhost:5001/convert', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('An error occurred during the conversion process.');
      }

      const data = await response.json();
      setOutput(data.output);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Audio Converter</div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">AAC File Converter</h1>
            <p className="mt-2 text-gray-500">Upload your AAC file and convert it to text.</p>
            
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">AAC files only</p>
                  </div>
                  <input id="dropzone-file" type="file" accept=".aac" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              {selectedFile && (
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <FileAudio className="w-5 h-5 mr-2" />
                  <span>{selectedFile.name}</span>
                </div>
              )}
              <button type="submit" className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Upload and Convert
              </button>
            </form>

            {loading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="mt-2 text-indigo-600">Converting...</p>
              </div>
            )}

            {error && (
              <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 flex items-center" role="alert">
                <XCircle className="w-6 h-6 mr-2" />
                <p>{error}</p>
              </div>
            )}

            {output && (
              <div className="mt-6">
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 flex items-center" role="alert">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <p>Conversion successful!</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-64">
                  <pre className="text-sm text-gray-700">{JSON.stringify(output, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
