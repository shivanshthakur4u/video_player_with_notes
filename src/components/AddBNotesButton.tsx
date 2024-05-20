import Image from 'next/image'
import React from 'react'
import PlusIcon from "../../public/svg/AddIcon.svg"
const AddBNotesButton = ({onClick}:{onClick:()=>void}) => {
  return (
    <button className='border border-[#D0D5DD] px-4 py-2 flex gap-2 rounded-lg items-center'
    onClick={onClick}>
      <Image src={PlusIcon} alt="plus con" /> <span className='text-[#344054] font-semibold text-sm'>
        Add new note
      </span>
    </button>
  )
}

export default AddBNotesButton