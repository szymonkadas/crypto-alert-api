export default class MessageTemplate {
  constructor(public subject: string, public mainBody: string) {}

  getText() {
    return `${this.subject}
${this.mainBody}`;
  }

  getHtml() {
    return `<h3>${this.subject}</h3>
<p>${this.mainBody}</p>`;
  }

  formatToMessageConfig() {
    return {
      subject: this.subject,
      text: this.getText(),
      html: this.getHtml(),
    };
  }
}
