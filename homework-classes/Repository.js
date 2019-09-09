'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} container The container element in which to render the repository.
   */
  render(container) {
    App.clearContainer(container);
    Util.createAndAppend('h3', container, { text: 'Repository Information:' });
    Util.createAndAppend('p', container, { text: 'Name: ' + this.name() });
    Util.createAndAppend('p', container, { text: 'Forks: ' + this.repository.forks });
    Util.createAndAppend('p', container, { text: 'Created on: ' + this.repository.created_at });
    Util.createAndAppend('p', container, { text: 'Description: ' + this.repository.description });
  }
  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.repository.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repository.name;
  }
}
