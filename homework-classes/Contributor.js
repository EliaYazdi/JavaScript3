'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} container The container element in which to render the contributor.
   */
  render(container) {
    // TODO: replace the next line with your code.
    Util.createAndAppend('img', container, { src: this.contributor.avatar_url, height: 100, width: 100, class: 'img' });
    Util.createAndAppend('p', container, { text: this.contributor.login, class: 'contribsname' });
  }
}
