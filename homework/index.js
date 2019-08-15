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
    fetchJSON(url, (err, repositories) => {
      const root = document.getElementById('root');
      console.log(err, repositories)
      if (err) {
        //createAndAppend('div', root, { text: err.message, class: 'alert-error' });
        const div = document.createElement('div')
        div.textContent = err.message
        div.setAttribute('class', 'alert-error')
        //div.classList = "alert-error"
        root.appendChild(div)
        return;
      }
      //createAndAppend('pre', root, { text: JSON.stringify(repositories, null, 2) });
      const repoList = createAndAppend('div', root, { class: "repo-list" });
      const select = createAndAppend('select', repoList, { text: 'choose the repo' })
      repositories.forEach(repo => {
        //console.log(repo.name)
        createAndAppend('option', select, { text: repo.name })
        select.addEventListener('change', () => {
          console.log("clicked", repo.name)
          createAndAppend('div', root, { text: "here" })
        })
      })
    });
  }

  //get contributors


  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=30';
  window.onload = () => main(HYF_REPOS_URL);
}

/*fetch('https://api.github.com/orgs/HackYourFuture/repos?per_page=100')
  .then(result => {
    console.log(result);
    return result.json();
  })
  .then(data => {
    //console.log(data);
    const angular = data[0];
    console.log(angular);
  })
  .catch(error => console.log(error));*/