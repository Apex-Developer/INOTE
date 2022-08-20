const express = require("express");
const router = express("Router");
const { body, validationResult } = require('express-validator');

const fetchuser = require('../middleware/fetchuser');
const { findByIdAndUpdate } = require("../models/Note");
const Notes = require('../models/Note');

// Routes 1 : Get All the notes using:Get "/api/notes/fetchallnotes"

router.get("/fetchallnotes", fetchuser, async (req, res) => {

    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error ")
    }

})
// Routes 2 : Add a note using:Post "/api/notes/addnote"

router.post("/addnote", fetchuser, [
    body('title', 'Enter a valid Title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 character').isLength({ min: 5 }),
], async (req, res) => {

    try {

        // Getting Title,description,tag by using destructuring JS Method

        const { title, description, tag } = req.body;
        // If some error ouccure send bad request

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        })

        const saveNote = await note.save();

        res.json(saveNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error ")
    }
})

// Routes 3 : Update existing Note using:Put "/api/notes/updatenote"

// When we update some thing we use put request

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    
    const { title, description, tag } = req.body
    // Getting these thing from req.body


    try {

        // Create a New Note it change only those thing which will be change

        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // Find the Note to be updated and update it
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.send(404).send("Not Found !") }

        if (note.user.toString() != req.user.id)
            return res.send(401).send("Not Allowed")

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error ")
    }

})



// Routes 4 : delete existing Note using:Delete "/api/notes/Deletenote"

// When we Delete some thing we use Delete request

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    // Getting these thing from req.body


    try {

        // Find the Note to be Deleted
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.send(404).send("Not Found !") }

        // Allow Deletion if user own this Notes

        if (note.user.toString() != req.user.id)
            return res.send(401).send("Not Allowed")

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error ")
    }

})

module.exports = router;
