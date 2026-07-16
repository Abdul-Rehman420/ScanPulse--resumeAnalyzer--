"use client";

import { useState } from "react";
import { Share2, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createShareLink } from "@/services/share";
import { toast } from "sonner";

interface ShareDialogProps {
  analysisId: string;
}

export function ShareDialog({ analysisId }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState("7");
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      const days = expiresInDays ? parseInt(expiresInDays) : undefined;
      const result = await createShareLink(analysisId, days);
      setUrl(result.url);
      toast.success("Share link created!");
    } catch {
      toast.error("Failed to create share link");
    }
    setLoading(false);
  }

  async function handleCopy() {
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Analysis</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!url ? (
            <>
              <div className="space-y-2">
                <Label>Link Expiry</Label>
                <Select value={expiresInDays} onValueChange={setExpiresInDays}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} disabled={loading} className="w-full">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Share Link"}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input value={url} readOnly className="flex-1" />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with this link can view your analysis results.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
