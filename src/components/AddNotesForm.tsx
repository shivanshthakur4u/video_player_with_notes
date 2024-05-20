import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import Image from 'next/image';

interface AddNotesFormProps {
    noteContent: string;
    setNoteContent: (content: string) => void;
    noteImage: string | undefined;
    setNoteImage: (image: string | undefined) => void;
    handleSaveNote: () => void;
    editMode: boolean;
    setShowForm: (show: boolean) => void;
}

const AddNotesForm: React.FC<AddNotesFormProps> = ({ 
    noteContent, 
    setNoteContent, 
    noteImage, 
    setNoteImage, 
    handleSaveNote, 
    editMode, 
    setShowForm 
}) => {
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
        <div className='flex flex-col gap-4 p-4 border border-[#EAECF0] rounded-xl'>
            <ReactQuill
                value={noteContent}
                onChange={setNoteContent}
                className="mb-4"
            />
            <input type='image' onChange={handleImageUpload} className="mb-4" />
            {noteImage && (
                <Image
                    src={noteImage}
                    alt="Note"
                    width={100}
                    height={100}
                    className="w-24 h-24 mb-4"
                />
            )}
            <div className='flex gap-2'>
                <button onClick={handleSaveNote} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    {editMode ? 'Update' : 'Save'}
                </button>
                <button onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default AddNotesForm;
