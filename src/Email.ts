export class Email {
  constructor(
    public from?: string,
    public subject?: string,
    public renderedImageUrl?: string,
    public company?: string,
    public receivedDate?: string
  ) {}

  hasReceivedDate (this:Email):boolean {
    return this.receivedDate !== undefined;
  }
  getReceivedDate (this: Email):Date {
    if (this.receivedDate) {
      return new Date(this.receivedDate);
    }
    throw 'Date is undefined'
  };
}