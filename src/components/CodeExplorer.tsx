import React, { useState } from 'react';
import { Folder, FileCode, Copy, Check, Download, ExternalLink, Terminal, ShieldCheck, Sparkles } from 'lucide-react';
import JSZip from 'jszip';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterSourceCode';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[1]); // lib/main.dart default
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add each file with its exact path
      FLUTTER_PROJECT_FILES.forEach((f) => {
        zip.file(f.path, f.content);
      });

      // Add an analysis_options.yaml for standard linting
      zip.file(
        'analysis_options.yaml',
        `include: package:flutter_lints/flutter.yaml\n\nlinter:\n  rules:\n    prefer_const_constructors: true\n    avoid_print: true\n`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'QuizMaster_Flutter_Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to create zip', e);
    } finally {
      setIsZipping(false);
    }
  };

  // Group files by folder
  const groupedFiles = FLUTTER_PROJECT_FILES.reduce((acc, f) => {
    if (!acc[f.folder]) acc[f.folder] = [];
    acc[f.folder].push(f);
    return acc;
  }, {} as Record<string, FlutterFile[]>);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner & Exporter Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Complete Flutter 3.35+ Source Code</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            QuizMaster Project Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Inspect all Dart models, services, Provider state management classes, screens, widgets, test cases, and pubspec configuration.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Generating Zip...' : 'Download Project (.ZIP)'}</span>
        </button>
      </div>

      {/* Main IDE Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Left File Tree (4 cols) */}
        <div className="lg:col-span-4 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/60 overflow-y-auto max-h-[600px]">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Flutter Project Tree
          </div>

          <div className="space-y-4">
            {Object.entries(groupedFiles).map(([folder, files]) => (
              <div key={folder}>
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-300">
                  <Folder className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{folder}</span>
                </div>
                <div className="space-y-0.5 mt-1 pl-3">
                  {files.map((file) => {
                    const isSelected = selectedFile.path === file.path;
                    return (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left ${
                          isSelected
                            ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <FileCode className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{file.filename}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Code Viewer (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-[600px] overflow-hidden bg-slate-950">
          {/* Header of Code Pane */}
          <div className="h-12 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 shrink-0">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <span className="text-slate-500">path:</span>
              <span className="text-indigo-400 font-bold">{selectedFile.path}</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Body */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
            <pre className="whitespace-pre">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* College Project Submission & Build Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <Terminal className="w-4 h-4" />
            <span>1. Install & Test</span>
          </div>
          <p className="text-xs text-slate-400">
            Extract the zip file, open terminal in project directory, and verify tests:
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px]">
            flutter pub get<br />flutter test
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <ExternalLink className="w-4 h-4" />
            <span>2. Run in Android Studio</span>
          </div>
          <p className="text-xs text-slate-400">
            Select an Android emulator or connected device and launch debug session:
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px]">
            flutter run
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>3. Compile Release APK</span>
          </div>
          <p className="text-xs text-slate-400">
            Build the optimized standalone APK suitable for college submission:
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px]">
            flutter build apk --release
          </div>
        </div>
      </div>
    </div>
  );
};
