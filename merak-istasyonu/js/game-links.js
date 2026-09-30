/* Public, allowlisted deep links from the Bilişim Kâşifi homepage. */
(function () {
  'use strict';
  var back = document.createElement('a');
  back.href = 'https://bilisimkasifi.blogspot.com/';
  back.textContent = '← Bilişim Kâşifi derslerine dön';
  back.className = 'text-button';
  document.querySelector('footer').append(back);
  var id = new URLSearchParams(location.search).get('oyun');
  if (!id) return;
  // Do not interpolate query-string input into selectors or HTML.
  var button = Array.from(document.querySelectorAll('#gameGrid [data-game]')).find(function (item) {
    return item.dataset.game === id;
  });
  if (button) button.click();
})();
