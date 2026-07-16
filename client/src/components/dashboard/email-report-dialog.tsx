"use client";

import { useState } from "react";
import { Mail, Loader2, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendReport } from "@/services/email";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface EmailReportDialogProps {
  analysisId: string;
}

export function EmailReportDialog({ analysisId }: EmailReportDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    setSending(true);
    try {
      await sendReport(analysisId, email);
      setSent(true);
      toast.success("Report sent!");
    } catch {
      toast.error("Failed to send report");
    }
    setSending(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setSent(false); } }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" />
          Email Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{sent ? "Report Sent!" : "Email Report"}</DialogTitle>
        </DialogHeader>
        {sent ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-medium">Analysis report sent to {email}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <Button onClick={handleSend} disabled={sending} className="w-full">
              {sending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Send Report</>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
