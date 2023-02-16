import { Email } from './Email'

export class Campaign {
  constructor(
    public Emails: Array<Email>=[],
  ) {
  }

  hasReceivedDate (this: Campaign):boolean {
    if (this.Emails && this.Emails.length <= 0) { return false; }
    
    const result = this.Emails[0].receivedDate !== undefined
    console.log(`hasReceivedDate: ${result} (${this.Emails[0].receivedDate})`)
    return result;
  }

  tryGetFirstEmailDate (this: Campaign): [boolean,Date?] {
    if (this.hasReceivedDate()) {
      return [true, this.Emails[0].getReceivedDate()];
    }
    return [false, undefined]
  };

  tryGetLastEmailDate (this: Campaign):[boolean,Date?] {
    if (this.hasReceivedDate()) {
      return [true,this.Emails[this.Emails.length-1].getReceivedDate()];
    }
    return [false, undefined]
  };

  getTotalCampaignDays (this: Campaign):number {
    if (this.tryGetFirstEmailDate()[0] && this.tryGetLastEmailDate()[0]) {
      let difference = this.tryGetLastEmailDate()[1].getTime() - this.tryGetFirstEmailDate()[1].getTime();
      return Math.round(difference / (1000 * 3600 * 24));
    } else {
      return 0;
    }
  };
}
