import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial)

  // Get All Note

  // TODO: Api Call

  const getNotes = async () => {

    // Fetch Api Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    });

    const json = await response.json();
    setNotes(json);

  }



  // Add Note

  // TODO: Api Call

  const addNote = async (title, description, tag) => {

    // Fetch Api Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    }); 

    const note = await response.json();
    setNotes(notes.concat(note))

  }



  // Delete Note

  // TODO: Api Call

  const deleteNote = async (id) => {

    // Fetch Api Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    });
    const json = await response.json();

    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)
  }




  // Edit Note

  // TODO: Api Call

  const editNote = async (id, title, description, tag) => {

    // Fetch Api Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const json =response.json();


    let newNotes=JSON.parse(JSON.stringify(notes))

    // logic to edit in client
    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];

      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;

        break;
      }
    }
    setNotes(newNotes)
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}

    </NoteContext.Provider>
  )
}

export default NoteState;