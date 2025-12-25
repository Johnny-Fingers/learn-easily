import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function CornellNote({ cueText, noteText, summaryText, onChange, disabled = false }) {
    return (
        <div className="space-y-4">
            {/* Two columns layout */}
            <div className="grid gap-44 md:grid-cols-[1fr_2fr]">
                {/* Left column / Cues/Questions */}
                <div className="space-y-2">
                    <Label htmlFor="cue-text" className="text-base font-semibold">Cues / Questions</Label>
                    <Textarea
                        id="cue-text"
                        placeholder="Write key questions here..."
                        value={cueText}
                        onChange={(e) => onChange("cue_text", e.target.value)}
                        className="min-h-[400px] resize-none"
                        disabled={disabled}
                    />
                    <p className="text-xs text-muted-foreground">
                        Key questions, terms, or cues for recall
                    </p>
                </div>

                {/* Right column - Notes */}
                <div className="space-y-2">
                    <Label htmlFor="note-text" className="text-base font-semibold">Notes</Label>
                    <Textarea
                        id="note-text"
                        placeholder="Take detailed notes during your study session"
                        value={noteText}
                        onChange={(e) => onChange("note_text", e.target.value)}
                        className="min-h-[400px] resize-none"
                        disabled={disabled}
                    />
                    <p className="text-xs text-muted-foreground">
                        Detailed notes for each cue
                    </p>
                </div>
            </div>
            {/* Bottom section - Summary */}
            <div className="space-y-2">
                <Label htmlFor="summary-text" className="text-base font-semibold">Summary</Label>
                <Textarea
                    id="summary-text"
                    placeholder="Write a summary of the key concepts and main ideas in your own words"
                    value={summaryText}
                    onChange={(e) => onChange("summary_text", e.target.value)}
                    className="min-h-[150px] resize-none"
                    disabled={disabled}
                />
                <p className="text-xs text-muted-foreground">
                    Summarize the key concepts and main ideas
                </p>
            </div>
        </div>
    );
}

export default CornellNote;