export type Email = {
  subject: string;
  toEmails: string[];
  text: string;
  html: string | undefined;
};
