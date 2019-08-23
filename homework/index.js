'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
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
  //get repos
  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        //createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
        const header = createAndAppend('header', root, { class: 'header' });
        const h1 = createAndAppend('h1', header, { text: 'FooCoding Repos', class: 'h1' });
        const select = createAndAppend('select', header, { class: 'select' });
        createAndAppend('option', select, { text: 'Choose your favorite repo' });
        data.forEach(repo => {
          const name = repo.name;
          createAndAppend('option', select, { text: name });
        });
        const container = createAndAppend('div', root, { class: 'container' });
        const repoInfo = createAndAppend('div', container, { class: 'left-div' });
        const contribs = createAndAppend('div', container, { class: 'right-div' });
        select.onchange = evt => {
          const selectedRepo = evt.target.value;
          const repo = data.filter(r => r.name == selectedRepo)[0];
          console.log(repo);
          repoInfo.innerHTML = '';
          contribs.innerHTML = '';



          const addInfo = (label, value) => {
            const repoContainer = createAndAppend('div', repoInfo);
            createAndAppend('span', repoContainer, { text: label });
            createAndAppend('span', repoContainer, { text: value });
          };
          addInfo('Name: ', repo.name);
          addInfo('Desciption: ', repo.description);
          addInfo('Number of forks: ', repo.forks);
          addInfo('Updated: ', repo.updated_at);

          const contribsUrl = repo.contributors_url;
          fetchJSON(contribsUrl, (err, contributors) => {
            if (err) {
              createAndAppend('div', root, { text: err.message, class: 'alert-error' });
            } else {
              contributors.forEach(contributor => {
                const eachContrib = createAndAppend('div', contribs, { class: 'eachcontrib' })
                const contribNames = createAndAppend('a', eachContrib, { text: contributor.login, class: 'contributor' })
                contribNames.href = contributor.html_url;

                createAndAppend('span', eachContrib, { text: contributor.contributions, class: 'contributions' })
                createAndAppend('img', eachContrib, { src: contributor.avatar_url, height: 100, width: 100, id: 'img' })
              })

            };
          });
        };
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}