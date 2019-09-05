'use strict';


function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.keys(options).forEach(key => {
    const value = options[key];
    if (key === 'text') {
      elem.textContent = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}



async function main(url) {


  try {
    const response = await fetch(url);
    const json = await response.json();
    const root = document.getElementById('root');
    const select = createAndAppend('select', root, { class: 'select' });
    createAndAppend('option', select, { text: 'Choose your favorite repo' });
    let sorted = json.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);

    sorted.forEach(repo => {
      const name = repo.name;

      createAndAppend('option', select, { text: name });
    })


    select.addEventListener('change', evt => {
      const selectedRepo = evt.target.value;
      const repo = json.filter(r => r.name == selectedRepo)[0];
      getContributorInformation(repo);
      repoData();

      function repoData() {
        repoInfo.innerHTML = 'Repository Information:';

        const addInfo = (label, value) => {
          const container = createAndAppend('div', repoInfo, { class: 'container' });
          createAndAppend('span', container, { text: label });
          createAndAppend('span', container, { text: value });
        };
        addInfo('Name: ', repo.name);
        addInfo('Desciption: ', repo.description);
        addInfo('Number of forks: ', repo.forks);
        addInfo('Updated: ', repo.updated_at)
        const contributorsUrl = "https://api.github.com/repos/HackYourFuture/AngularJS/contributors";
      }
    })


  }
  catch (err) {
    const root = document.getElementById('root');
    createAndAppend('div', root, { text: err.message, class: 'alert-error' })
  }

  const wraper = createAndAppend('div', root, { class: 'wraper' });
  const repoInfo = createAndAppend('div', wraper, { class: 'repoinfo' });
  let contribs = createAndAppend('div', wraper, { class: 'contribs' });
  contribs.innerHTML = 'Contributors';

  async function getContributorInformation(data) {

    try {

      const contribsUrl = await fetch(data.contributors_url);
      const contribsJson = await contribsUrl.json();
      contribsJson.forEach(contributor => {

        createAndAppend('div', contribs, { text: contributor.login, class: 'contributor' })
        createAndAppend('img', contribs, { src: contributor.avatar_url, height: 150, widtth: 150, id: 'img' })
        createAndAppend('div', contribs, { text: contributor.contributions })
      })
    } catch (err) {
      createAndAppend('div', contribs, { text: err.message, class: 'alert-error' })
    }
  }
}
const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);