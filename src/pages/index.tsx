/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Note } from '@/components/Notes';

const Notes = dynamic(() => import('@/components/Notes'), { ssr: false });
const YoutubePlayer = dynamic(() => import('@/components/YoutubePlayer'), { ssr: false });

const Home: React.FC = () => {
  const [videoId, setVideoId] = useState('Iz6NzuYSkF4');
  const [notes, setNotes] = useLocalStorage<Note[]>(`notes-${videoId}`, []);
  const playerRef = useRef<any>(null);

  const handleReady = (event: any) => {
    playerRef.current = event.target;
  };

  const getCurrentTimestamp = (): string => {
    if (!playerRef.current) return '00:00';
    const currentTime = playerRef.current.getCurrentTime();
    const hours = Math.floor(currentTime / 3600);
    const minutes = Math.floor((currentTime % 3600) / 60);
    const seconds = Math.floor(currentTime % 60);
    return [hours, minutes, seconds].map((unit) => String(unit).padStart(2, '0')).join(':');
  };

  const addNote = (note: Note) => {
    setNotes([...notes, note]);
  };

  const editNote = (updatedNote: Note) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const jumpToTimestamp = (timestamp: string) => {
    const [hours, minutes, seconds] = timestamp.split(':').map(Number);
    const secondsToJump = hours * 3600 + minutes * 60 + seconds;
    playerRef.current.seekTo(secondsToJump);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNotes(JSON.parse(localStorage.getItem(`notes-${videoId}`) || '[]'));
    }
  }, [videoId]);

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className='flex justify-between items-center'>
        <p className='text-3xl font-semibold text-[#101828]'>Video Player with Notes</p>
        <input
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Enter YouTube Video ID"
          className="border p-2"
        />
      </div>
      <YoutubePlayer videoId={videoId} onReady={handleReady} />
      <Notes
        notes={notes}
        addNote={addNote}
        editNote={editNote}
        deleteNote={deleteNote}
        jumpToTimestamp={jumpToTimestamp}
        getCurrentTimestamp={getCurrentTimestamp}
      />
    </div>
  );
};

export default Home;
