'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image';
import AddBNotesButton from './AddBNotesButton';
import Divider from './common/divider';
import AddNotesForm from './AddNotesForm';

export interface Note {
    id: string;
    timestamp: string;
    content: string;
    date: string;
    image?: string;
}

interface NotesProps {
    notes: Note[];
    addNote: (note: Note) => void;
    editNote: (note: Note) => void;
    deleteNote: (id: string) => void;
    jumpToTimestamp: (timestamp: string) => void;
    getCurrentTimestamp: () => string;
}

const Notes: React.FC<NotesProps> = ({ notes, addNote, editNote, deleteNote, jumpToTimestamp, getCurrentTimestamp }) => {
    const [noteContent, setNoteContent] = useState('');
    const [noteImage, setNoteImage] = useState<string | undefined>(undefined);
    const [editMode, setEditMode] = useState(false);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleSaveNote = () => {
        const currentTimestamp = getCurrentTimestamp();
        const currentYear = new Date().getFullYear().toString().slice(-2);
        const newNote: Note = {
            id: uuidv4(),
            timestamp: currentTimestamp,
            content: noteContent,
            date: new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: '2-digit',
            }).replace(/ /g, ' ').replace(currentYear, `'${currentYear}`),
            image: noteImage,
        };

        if (editMode) {
            editNote({
                ...currentNote!,
                content: noteContent,
                date: new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: '2-digit',
                }).replace(/ /g, ' ').replace('24', "'24"),
                image: noteImage,
            });
            setEditMode(false);
            setCurrentNote(null);
        } else {
            addNote(newNote);
        }
        setNoteContent('');
        setNoteImage(undefined);
        setShowForm(false);
    };

    const handleEdit = (note: Note) => {
        setNoteContent(note.content);
        setNoteImage(note.image || undefined);
        setEditMode(true);
        setCurrentNote(note);
        setShowForm(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNoteImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='flex flex-col gap-6 p-6 rounded-2xl border border-[#EAECF0]'>
            <div className='flex flex-col gap-5'>
                <div className='flex justify-between items-start'>
                    <div className='flex flex-col'>
                        <p className='text-[#101828] font-semibold text-lg'>
                            My notes
                        </p>
                        <p className='text-sm font-normal text-[#475467]'>
                            All your notes at a single place. Click on any note to go to specific timestamp in the video.
                        </p>
                    </div>
                    <AddBNotesButton onClick={() => setShowForm(true)} />
                </div>
                <Divider />
            </div>

            {showForm && (
                <AddNotesForm
                    noteContent={noteContent}
                    setNoteContent={setNoteContent}
                    noteImage={noteImage}
                    setNoteImage={setNoteImage}
                    handleSaveNote={handleSaveNote}
                    editMode={editMode}
                    setShowForm={setShowForm}
                />
            )}

            <div className='flex gap-3 flex-col'>
                {notes.map((note) => (
                    <div key={note.id} className='flex flex-col gap-3'>
                        <div className='flex flex-col'>
                            <h5 className='text-[#344054] text-sm font-medium'>
                                {note.date}
                            </h5>
                            <p className='text-sm font-normal text-[#475467]'>
                                Timestamp:
                                <span className='font-medium text-[#6941C6] cursor-pointer' onClick={() => jumpToTimestamp(note.timestamp)}>
                                    {note.timestamp}
                                </span>
                            </p>
                        </div>
                        <div className='p-3 border border-[#EAECF0] rounded-b-lg rounded-tr-lg'>
                            <p className='text-sm font-normal text-[#344054]' dangerouslySetInnerHTML={{ __html: note.content.length > 100 ? `${note.content.slice(0, 100)}...` : note.content }} />
                            {note.content.length > 100 && (
                                <button onClick={() => setEditMode(!editMode)} className='text-blue-500'>
                                    {editMode ? ' Show less' : ' Show more'}
                                </button>
                            )}
                        </div>

                        {note.image && (
                            <Image
                                src={note.image}
                                alt="Note Image"
                                width={100}
                                height={100}
                                className="w-24 h-24 mb-4"
                            />
                        )}
                        <div className='flex gap-1 justify-end'>
                            <button className='py-1 px-2.5 border border-[#D0D5DD] rounded-lg text-sm font-medium text-[#344054]' onClick={() => deleteNote(note.id)}>
                                Delete note
                            </button>
                            <button className='py-1 px-2.5 border border-[#D0D5DD] rounded-lg text-sm font-medium text-[#344054]' onClick={() => handleEdit(note)}>
                                Edit note
                            </button>
                        </div>
                        <Divider />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notes;
