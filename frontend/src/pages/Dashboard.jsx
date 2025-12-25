import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import Layout from '../components/layout/layout';
import NoteList from '../components/notes/NoteList';
import SearchBar from '../components/notes/SearchBar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, FileText, Loader2 } from 'lucide-react';

function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { notes, loading, error, deleteNote } = useNotes();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter notes by search query
    const filteredNotes = notes.filter((note) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            note.title.toLowerCase().includes(searchLower) ||
            note.subject?.toLowerCase().includes(searchLower) ||
            note.note_text?.toLowerCase().includes(searchLower) ||
            note.cue_text?.toLowerCase().includes(searchLower) ||
            note.summary_text?.toLowerCase().includes(searchLower)
        );
    });


    return (
        <Layout>
            <div className="space-y-6">

                {/* Header section */}
                <div className=" flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
                        <p className="text-muted-foreground">
                            {loading ? "Loading..." : `${notes.length} note${notes.length > 1 ? 's' : ''} saved`}
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate('/notes/new')}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New Note
                    </Button>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Search bar */}
                {!loading && notes.length > 0 && (
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search notes..."
                    />
                )}

                {/* Loading state */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Loading notes...</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && notes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
                        <p className="text-muted-foreground mb-4 max-w-sm">Create your first note to get started</p>
                        <Button onClick={() => navigate('/notes/new')} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Note
                        </Button>
                    </div>
                )}

                {/*No search results */}
                {!loading && notes.length > 0 && filteredNotes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-muted-foreground py-4">No notes found for "{searchQuery}"</p>
                        <Button onClick={() => setSearchQuery('')}>
                            Clear Search
                        </Button>
                    </div>
                )}

                {/* Notes grid */}
                {!loading && filteredNotes.length > 0 && (
                    <NoteList
                        notes={filteredNotes}
                        onDelete={deleteNote}
                    />
                )}
            </div>
        </Layout>
    );
}

export default Dashboard;