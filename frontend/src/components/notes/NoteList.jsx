import NoteCard from './NoteCard';

function NoteList({ notes, onDelete }) {
    if (notes.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
                <div
                    key={note.id}
                    className="animate-fade-in"
                >
                    <NoteCard
                        note={note}
                        onDelete={onDelete}
                    />
                </div>
            ))}
        </div>
    );
}

export default NoteList;