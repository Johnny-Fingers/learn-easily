import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/layout';
import CornellNote from '../components/notes/CornellNote';
import noteService from '../services/noteService';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';


function NoteEditor() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the note id from the URL
    const isEditMode = !!id; // If there is an id, it's edit mode

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        cue_text: '',
        note_text: '',
        summary_text: ''
    });

    const [loading, setLoading] = useState(false);
    const [fetchingNote, setFetchingNote] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch note if editing
    useEffect(() => {
        if (isEditMode) {
            fetchNote();
        }
    }, [id]);

    const fetchNote = async () => {
        setFetchingNote(true);
        setError('');
        try {
            const note = await noteService.getNote(id);
            setFormData({
                title: note.title || '',
                subject: note.subject || '',
                cue_text: note.cue_text || '',
                note_text: note.note_text || '',
                summary_text: note.summary_text || ''
            });
        } catch (err) {
            console.error("Error fetching note", err);
            setError(err.response?.data?.error || "Failed to load note");
        } finally {
            setFetchingNote(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.title.trim()) {
            setError("Title is required");
            return;
        }

        setLoading(true);

        try {
            if (isEditMode) {
                await noteService.updateNote(id, formData);
                toast.success("Note updated successfully!");
            } else {
                await noteService.createNote(formData);
                toast.success("Note created successfully!");
            }

            // Redirect to dashboard after a brief delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            console.error("Error saving note", err);
            toast.error(err.response?.data?.error || "Failed to save note");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingNote) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading note...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to notes
                    </Button>

                    <h1 className="text-2xl font-bold">
                        {isEditMode ? "Edit Note" : "Create New Note"}
                    </h1>
                </div>

                {/* Messages */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="border-green-500 text-green-700">
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Enter note title"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                type="text"
                                placeholder="e.g., Programming, Biology, Math..."
                                value={formData.subject}
                                onChange={(e) => handleChange("subject", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <CornellNote
                        cueText={formData.cue_text}
                        noteText={formData.note_text}
                        summaryText={formData.summary_text}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <div className="flex gap-4 justify-end pt-4 border-t">
                        <Button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {isEditMode ? "Update Note" : "Save Note"}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default NoteEditor;