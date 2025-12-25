import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ConfirmDialog from '@/components/ui/confirmDialog';

function NoteCard({ note, onDelete }) {
    const navigate = useNavigate();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);


    // Format date
    const formatDate = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (error) {
            return dateString;
        }
    };

    // Get preview text
    const getPreviewText = () => {
        const text = note.note_text || note.summary_text || "";
        return text.length > 100 ? text.substring(0, 100) + "..." : text;
    };

    // Handle delete
    const handleDelete = async (e) => {
        e.stopPropagation(); // This prevent card click
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await onDelete(note.id);
        } catch (error) {
            console.error("Error deleting note: ", error);
        }
        setShowDeleteDialog(false);
    };

    // Handle edit
    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/notes/${note.id}`);
    };

    return (
        <>
            <Card
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => navigate(`/notes/${note.id}`)}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                            <h3 className="font-semibold text-lg line-clamp-1">
                                {note.title}
                            </h3>
                            {note.subject && (
                                <Badge variant="secondary" className="text-xs">
                                    {note.subject}
                                </Badge>
                            )}
                        </div>
                        {/* Menu button */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button size="icon" className="h-8 w-8">
                                    <MoreVertical className="h4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDelete} className="cursor-pointer">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {formatDate(note.created_at)}
                    </p>
                </CardHeader>

                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {getPreviewText()}
                    </p>
                </CardContent>
            </Card>

            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={confirmDelete}
                title="Delete Note"
                description="Are you sure you want to delete this note?"
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </>
    );
}

export default NoteCard;