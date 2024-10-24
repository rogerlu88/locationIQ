const APP = {
    TOKEN: 'pk.ab790c685912792ce49b455565a4c127',
    SEARCHURL: `https://us1.locationiq.com/v1/search.php?format=json&`,
    REVERSEURL: `https://us1.locationiq.com/v1/reverse.php?format=json&`,
    MAPURL: `https://maps.locationiq.com/v3/staticmap?`,
    data: null,
    init: () => {
      document
        .getElementById('btnSearch')
        .addEventListener('click', APP.doSearch);
      document
        .getElementById('btnReverse')
        .addEventListener('click', APP.doReverse);
      document.getElementById('btnMap').addEventListener('click', APP.getMap);
    },
    doSearch: (ev) => {
      ev.preventDefault();
      //use forward geocoding
      let q = document.getElementById('keyword').value.trim();
      if (!q) return false;
      let url = `${APP.SEARCHURL}key=${APP.TOKEN}&q=${q}`;
      //call the API and do a forward geocoding search
      //save the results in a global location
      fetch(url)
        .then((resp) => {
          if (!resp.ok) throw new Error(resp.statusText);
          return resp.json();
        })
        .then((data) => {
          APP.data = data[0];
          APP.showSearchResults();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    showSearchResults: () => {
      //display the results of the search
      console.log(APP.data);
      let section = document.querySelector('.results');
      let pre = section.querySelector('pre');
      if (!pre) {
        pre = document.createElement('pre');
        section.append(pre);
      }
      //just dump the data response into the <pre> element
      //just the first result from the array
      pre.textContent = JSON.stringify(APP.data, null, 2);
    },
    doReverse: (ev) => {
      ev.preventDefault();
      let q = document.getElementById('keyword').value.trim();
      //validation
      if (!q) return false; //exit if empty
      if (q.indexOf(',') < 0) return false; //exit if no comma
      let parts = q.split(','); //make array with 2 parts
      if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return false;
      //exit if not number lat or lon, not two values
      //build url
      let url = `${APP.REVERSEURL}key=${APP.TOKEN}&lat=${parts[0]}&lon=${parts[1]}`;
      //do a reverse geocoding call
      //save the results in a global location
      fetch(url)
        .then((resp) => {
          if (!resp.ok) throw new Error(resp.statusText);
          return resp.json();
        })
        .then((data) => {
          console.log(data);
          APP.data = data; //no [0]
          APP.showSearchResults();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getMap: (ev) => {
      ev.preventDefault();
      if (!APP.data) return false; //make sure there is data
      let lon = APP.data.lon; //get the longitude from the last retrieved
      let lat = APP.data.lat; //get the longitude from the last retrieved
      //build the URL with center, zoom, size, format
      let url = `${APP.MAPURL}key=${APP.TOKEN}&center=${lat},${lon}&zoom=9&size=400x600&format=png`;
      //display the static map
      APP.showMap(url);
    },
    showMap: (url) => {
      let section = document.querySelector('.map');
      let img = section.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        section.append(img);
      }
      img.alt = APP.data.display_name; // get the display_name from the data
      // put some ref into an attribute
      img.setAttribute('data-place-id', APP.data.place_id);
      // set the src with the url param
      img.src = url;
    },
  };
  
  document.addEventListener('DOMContentLoaded', APP.init);