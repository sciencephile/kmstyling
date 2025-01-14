/**
 * The custom Journal Sheet used for Kingmaker content.
 */
export class KingmakerJournalSheet extends JournalSheet {
  constructor(doc, options) {
    super(doc, options);
    this.options.classes.push(kingmaker.CSS_CLASS);
  }
}