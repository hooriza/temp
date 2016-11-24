let dragging = null;

$(document).on('mousedown', 'button', (e) => {
  const $button = $(e.target);

  dragging = {
    $button: $button,
    x: parseFloat($button.css('left')),
    y: parseFloat($button.css('top')),
    pageX: e.pageX,
    pageY: e.pageY
  };
});

$(document).on('keydown', 'button', (e) => {
  const $button = $(e.target);
  const rem = $button.data('rem') || [ 0, 0 ];
  
  console.log(e.keyCode);

  dragging.$button.css({
    left: rem[0] + 'rem',
    top: rem[1]+ 'rem'
  }).data('rem', rem);
  
  save();  
});

$(document).on('mousemove', (e) => {
  if (!dragging) { return; }
  
  dragging.$button.css({
    left: dragging.x + e.pageX - dragging.pageX,
    top: dragging.y + e.pageY - dragging.pageY
  });
});

$(document).on('mouseup', (e) => {
  if (!dragging) { return; }
  
  const rem = [
    (dragging.x + e.pageX - dragging.pageX) / window.innerWidth / 0.075,
    (dragging.y + e.pageY - dragging.pageY) / window.innerWidth / 0.075
  ];
  
  dragging.$button.css({
    left: rem[0] + 'rem',
    top: rem[1]+ 'rem'
  }).data('rem', rem);
  
  dragging = null;
  
  save();
});

$(document).on('dblclick', 'button', (e) => {
  const $button = $(e.target);
  $button.toggleClass('rotate');
  
  save();
});

function load() {
  const $buttons = $('button');
  const data = JSON.parse(
    localStorage.getItem('button-rem') ||
    location.hash.replace(/^#/, '') || '[]'
  );
  $buttons.each((index, button) => {
    const $button = $(button);
    const rem = data[index] || [ 0, 0 ];
    $button.css({
      left: rem[0] + 'rem',
      top: rem[1]+ 'rem'
    }).data('rem', rem).toggleClass('rotate', rem[2]);
  });
}

function save() {
  const $buttons = $('button');
  const data = [];
  $buttons.each((index, button) => {
    const $button = $(button);
    data.push(($button.data('rem') || [ 0, 0 ]).concat([ $button.hasClass('rotate') ]));
  });
  
  localStorage.setItem('button-rem', JSON.stringify(data));
  location.hash = JSON.stringify(data);
}

load();
