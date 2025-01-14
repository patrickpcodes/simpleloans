import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Email } from "@/types/Email";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: Email) => void;
  defaultToEmail: string;
  defaultSubject: string;
  defaultBody: string;
}

export function EmailModal({
  isOpen,
  onClose,
  onSend,
  defaultToEmail,
  defaultSubject,
  defaultBody,
}: EmailModalProps) {
  const [toEmail, setToEmail] = useState(defaultToEmail);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);

  const handleSend = () => {
    onSend({
      toEmails: [toEmail],
      subject,
      text: body,
      html: body, // You might want to convert this to HTML
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Payment Reminder</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="email">To Email</label>
            <Input
              id="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="subject">Subject</label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="body">Message</label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="h-32"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend}>Send Email</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
