'use client';

import React, { useState } from 'react';

interface MapControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onLocalOptimize: () => void;
  onReset: () => void;
  hasData: boolean;
  sidebarOpen?: boolean;
  isOptimizing?: boolean;
}

export default function MapControls({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onLocalOptimize,
  onReset,
  hasData,
  sidebarOpen = false,
  isOptimizing = false,
}: MapControlsProps) {
  const [showControls, setShowControls] = useState(true);

  return (
    <>
      {/* Main Controls Panel */}
      <div
        className={`fixed bottom-4 inset-x-0 z-50 flex justify-center transition-all duration-300 ${
          showControls ? 'block' : 'hidden'
        }`}
      >
        <div
          className={`grid grid-cols-3 gap-2 transition-all duration-300 mx-auto md:w-[min(42rem,calc(100vw-3rem))] md:grid-cols-none md:flex md:flex-row md:items-center ${
            sidebarOpen ? 'hidden md:flex' : 'grid md:flex'
          }`}
        >
          {/* Local Optimize Button - Blue */}
          <button
            onClick={onLocalOptimize}
            disabled={!hasData || isOptimizing}
            className='flex w-full items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-3 py-2 text-[11px] font-medium text-white shadow-2xl transition-all hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-3 md:text-sm md:gap-2 md:w-auto'
            title='Run local optimization to fine-tune pole positions'
          >
            {isOptimizing ? (
              <>
                <svg
                  className='h-4 w-4 animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                  ></path>
                </svg>
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 4.01V8'
                  />
                </svg>
                <span>Local Optimization</span>
              </>
            )}
          </button>

          {/* Redo Button */}
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className='flex w-full items-center justify-center gap-1.5 rounded-2xl bg-amber-600 px-3 py-2 text-[11px] font-medium text-white shadow-2xl transition-all hover:bg-amber-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:py-3 md:text-sm md:gap-2 md:w-auto'
            title='Redo (Ctrl/Cmd + Shift + Z)'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6-6-6'
              />
            </svg>
            <span>Redo</span>
          </button>

          {/* Hide Controls Button */}
          <button
            onClick={() => setShowControls(false)}
            className='flex w-1/2 col-start-3 row-span-2 items-center justify-center gap-1.5 rounded-2xl bg-slate-700 px-3 py-2 text-[11px] font-medium text-white shadow-2xl transition-all hover:bg-slate-600 active:scale-95 md:col-start-auto md:row-span-1 md:order-last md:w-auto md:px-6 md:py-3 md:text-sm md:gap-2'
            title='Hide controls'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M13.875 18.825A10.05 10.05 0 0112 19.5c-6 0-10-4.5-10-7.5S6 4.5 12 4.5c2.2 0 4.17.78 5.725 2.07M4.5 4.5l15 15'
              />
            </svg>
            <span>Hide</span>
          </button>

          {/* Undo Button */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className='flex w-full items-center justify-center gap-1.5 rounded-2xl bg-amber-600 px-3 py-2 text-[11px] font-medium text-white shadow-2xl transition-all hover:bg-amber-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:py-3 md:text-sm md:gap-2 md:w-auto'
            title='Undo (Ctrl/Cmd + Z)'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3 10h10a8 8 0 018 8v2M3 10l6 6 6-6'
              />
            </svg>
            <span>Undo</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            disabled={!hasData}
            className='flex w-full items-center justify-center gap-1.5 rounded-2xl bg-red-600 px-3 py-2 text-[11px] font-medium text-white shadow-2xl transition-all hover:bg-red-500 active:scale-95 disabled:opacity-50 md:px-6 md:py-3 md:text-sm md:gap-2 md:w-auto dark:text-white'
            title='Reset everything'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              strokeWidth={2.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className='fixed bottom-4 inset-x-0 mx-auto z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-white shadow-2xl transition-all hover:bg-slate-600 active:scale-95'
          title='Show controls'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2.5}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
      )}
    </>
  );
}

