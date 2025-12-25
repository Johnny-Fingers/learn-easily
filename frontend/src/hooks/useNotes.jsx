import { useState, useEffect } from "react";
import noteService from "@/services/noteService";

export const useNotes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all notes
    const fetchNotes = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await noteService.getUserNotes();
            setNotes(data.notes || []);
        } catch (err) {
            console.error("Error fetching notes:", err);
            setError(err.response?.data?.error || "Failed to load notes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Create new note
    const createNote = async (noteData) => {
        try {
            const result = await noteService.createNote(noteData);
            await fetchNotes(); // This refresh the list
            return result;
        } catch (err) {
            throw err;
        }
    };

    // Delete note
    const deleteNote = async (id) => {
        try {
            await noteService.deleteNote(id);
            setNotes(notes.filter(note => note.id !== id));
        } catch (err) {
            throw err;
        }
    };

    return {
        notes,
        loading,
        error,
        fetchNotes,
        createNote,
        deleteNote
    };
};