import api from './api';

const noteService = {
    // CREATE NOTE
    createNote: async (noteData) => {
        const response = await api.post('/notes/new', noteData);
        return response.data;
    },

    // GET ALL USER NOTES
    getUserNotes: async () => {
        const response = await api.get('/notes');
        return response.data;
    },

    // GET A SINGLE NOTE
    getNote: async (id) => {
        const response = await api.get(`/notes/${id}`);
        return response.data;
    },

    // UPDATE NOTE
    updateNote: async (id, noteData) => {
        const response = await api.put(`/notes/${id}`, noteData);
        return response.data;
    },

    // DELETE NOTE
    deleteNote: async (id) => {
        const response = await api.delete(`/notes/${id}`);
        return response.data;
    }
};

export default noteService;