'use strict';

{
  function fetchJson(url) {
    return new Promise((resolve, reject) => {
      const xhr = newXMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
          resolve(xhr.response)
        } else {
          reject(Error('Network request failed'));
        }
      };
      xhr.send();
    });
  }


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

  function getContributorInformation(contribsUrl, contribs) {
    fetch(contribsUrl)
      .then(data => data.json())
      .then((jsonData) => {
        jsonData.forEach(contributor => {
          createAndAppend('div', contribs, { text: contributor.login, class: 'contributor' })
          createAndAppend('img', contribs, { src: contributor.avatar_url, height: 100, widtth: 100, id: 'img' })
          createAndAppend('div', contribs, { text: contributor.contributions })
        })
      })
      .catch((err) => {
        const root = document.getElementById('root');
        createAndAppend('div', contribs, { text: err.message, class: 'alert-error' })
      })

  }

  function main(url) {
    fetch(url)
      .then(data => data.json())
      .then(json => {
        const root = document.getElementById('root');
        const select = createAndAppend('select', root, { class: 'select' });
        createAndAppend('option', select, { text: 'Choose your favorite repo' });
        json.forEach(repo => {
          const name = repo.name;
          createAndAppend('option', select, { text: name });
        })
        const repoInfo = createAndAppend('div', root);
        const contribs = createAndAppend('div', root);
        select.addEventListener('change', evt => {
          const selectedRepo = evt.target.value;
          const repo = json.filter(r => r.name == selectedRepo)[0];
          repoInfo.innerHTML = '';
          contribs.innerHTML = '';
          const addInfo = (label, value) => {
            const container = createAndAppend('div', repoInfo);
            createAndAppend('span', container, { text: label });
            createAndAppend('span', container, { text: value });
          };
          addInfo('Name: ', repo.name);
          addInfo('Desciption: ', repo.description);
          addInfo('Number of forks: ', repo.forks);
          addInfo('Updated: ', repo.updated_at)
          const contribsUrl = repo.contributors_url;
          getContributorInformation(contribsUrl, contribs)

        })

      })
      .catch((err) => {
        const root = document.getElementById('root');
        createAndAppend('div', root, { text: err.message, class: 'alert-error' })
      })

  }
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}