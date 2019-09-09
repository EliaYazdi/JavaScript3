'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.mainContainer = null;
    this.initialize(url);
  }

  /**
   * Initialization
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */
  async initialize(url) {
    this.setupDOMElement()

    // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      this.addRepoNamesToSelect();

      // TODO: add your own code here
    } catch (error) {
      this.renderError(error);
    }
  }

  addRepoNamesToSelect() {
    const selectEl = document.getElementById('repo-select')
    for (const repo of this.repos) {
      Util.createAndAppend('option', selectEl, { text: repo.name() })
    }
    selectEl.addEventListener('change', event => {
      const selectedRepoName = event.target.value;
      const selectedRepo = this.repos.filter(repo => repo.name() === selectedRepoName)[0]
      selectedRepo.render(document.getElementById('repo-info'));
      this.fetchContributorsAndRender(selectedRepo)
    });

  }
  setupDOMElement() {
    const root = document.getElementById('root');
    Util.createAndAppend('select', root, { id: 'repo-select' })
    Util.createAndAppend('div', root, { id: 'repo-info' })
    Util.createAndAppend('div', root, { id: 'repo-contributors' })
  }
  /**
   * Removes all child elements from a container element
   * @param {*} container Container element to clear
   */
  static clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {object} repo The selected repository object
   */
  async fetchContributorsAndRender(repo) {
    try {

      const contributors = await repo.fetchContributors();

      const container = document.getElementById('repo-contributors');
      App.clearContainer(container);



      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(container));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the page.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    console.error(error); // TODO: replace with your own code
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => new App(HYF_REPOS_URL);
