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
    let sorted = json.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()));

    sorted.forEach(repo => {
      const name = repo.name;
      createAndAppend('option', select, { text: name });
    })
    const wraper = createAndAppend('div', root, { class: 'wraper' });
    const repoInfo = createAndAppend('div', wraper, { class: 'repoinfo' });
    const contribs = createAndAppend('div', wraper, { class: 'contribs' });

    select.addEventListener('change', evt => {
      const selectedRepo = evt.target.value;
      const repo = json.filter(r => r.name == selectedRepo)[0];
      getContributorInformation();
      repoInfo.innerHTML = '';
      contribs.innerHTML = '';
      const addInfo = (label, value) => {
        const container = createAndAppend('div', repoInfo, { class: 'container' });
        createAndAppend('span', container, { text: label });
        createAndAppend('span', container, { text: value });
      };
      addInfo('Name: ', repo.name);
      addInfo('Desciption: ', repo.description);
      addInfo('Number of forks: ', repo.forks);
      addInfo('Updated: ', repo.updated_at)

    })

  }
  catch (err) {
    const root = document.getElementById('root');
    createAndAppend('div', root, { text: err.message, class: 'alert-error' })
  }

  async function getContributorInformation(data) {
    try {
      const contribs = await fetch(data.contributors_url);
      const jsonData = await contribs.json();


      jsonData.forEach(contributor => {
        createAndAppend('div', contribs, { text: contributor.login, class: 'contributor' })
        createAndAppend('img', contribs, { src: contributor.avatar_url, height: 150, widtth: 150, id: 'img' })
        createAndAppend('div', contribs, { text: contributor.contributions })
      })
    } catch (err) {
      const root = document.getElementById('root');
      createAndAppend('div', contribs, { text: err.message, class: 'alert-error' })
    }
  }
}
const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => main(HYF_REPOS_URL);