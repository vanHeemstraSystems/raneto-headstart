/* Based on https://github.com/PeterBeard/periodic-videos/blob/master/main.js */

function load_elements() {
  console.log("Loading elements for periodic table ...."); // For testing only
  const CURRENT_RELATIVE_PATH_WITHOUT_TRAILING_SLASH = window.location.pathname.replace(/\/$/, "");
  var DATA_DIR = 'data';
  var CATEGORIES = CURRENT_RELATIVE_PATH_WITHOUT_TRAILING_SLASH.replace(/(^\/EN|\/ES)/gi, "");

  var link = CATEGORIES;
  if( link.charAt( 0 ) === '/' ) {
    link = link.slice( 1 );
  }
  var links = [];
  var link_array = link.split('/');
  var path = "";
  for (var i of link_array) {
    path = path + '/' + i;    
    links.push(path);
  }
  console.log("links = ", links); // For testing only

  var title = "";
  var titles = [];
  var title_array = link_array;
  for (var i of title_array) {
    title = i.replace(/-/g, " ").replace(/\//g, " / ");
    titles.push(title);
  }
  console.log("titles = ", titles); // For testing only

  set_titles_and_links(titles, links);
  var LINKS_FILE = DATA_DIR.concat(CATEGORIES, '/', 'links.json');
  console.log("Links file = ", LINKS_FILE); // For testing only
  var ELEMENTS_FILE = DATA_DIR.concat(CATEGORIES, '/', 'elements.json');
  console.log("Elements file = ", ELEMENTS_FILE); // For testing only

  var links = [];
  var elements = [];

  return new Promise(function(resolve, reject) {
    $.getJSON(LINKS_FILE, function(data) {
      links = data;
      console.log("Links = ", links); // For testing only
    }).then(function() {
      $.getJSON(ELEMENTS_FILE, function(data) {
          elements = data;
          console.log("Elements = ", elements); // For testing only
      }).then(function() {
        $.each(elements, function(k, v) {
          var cell = $('#' + v.symbol.toLowerCase());
          cell.mouseover(function() {
            show_element_details(k, v);
          });
         cell.mouseout(function() {
           hide_element_details(k, v);
          });     
          cell.click(function() {
            open_link(links[k]);
          });
        });
      }).done(function() {
        update_elements(elements);
     });
    }).done(function() {
      resolve(true) 
    }).fail(function() { 
      var periodic_tables = $('#periodic-table');
      console.log("Collapsing periodic tables: ", periodic_tables); // For testing only
     Object.entries(periodic_tables).forEach(periodic_table => {
        const [key, value] = periodic_table;
        if( value instanceof HTMLTableElement) { 
          console.log("Collapsing periodic table: key = ", key, ", value = ", value); // For testing only 
          value.style.visibility = "collapse";
        }
      });
      resolve(false)
    });
  });
}

function update_elements(elements) {
  console.log("Updating elements for periodic table: elements = ", elements); // For testing only  
  // More here
  $.each(elements, function(k, v) {
    console.log(v);
    // var cell = $('#' + v.symbol.toLowerCase());
    var cell = $('#' + v.number);
    cell.empty();
    cell.append($('<span class="atomic-number">' + v.number + '</span>'));
    cell.append($('<span class="symbol">' + v.symbol + '</span>'));
    // cell.append($('<span class="mass">' + Math.round(v.atomic_mass*100)/100 + '</span>'));
    cell.append($('<span class="name">' + v.name + '</span>'));
    if(v.color) {
      cell.addClass(v.color);
    }
    if(v.category) {
      cell.addClass(v.category.replace(/ /g, '-'));
    }
  });  
}

function show_element_details(name, details) {
  console.log("Show element details for periodic table: name = ", name, ", details = ", details); // For testing only  
  var d_elem = $('#periodic-table-details');
  d_elem.empty();
  var title = $('<h1></h1>').appendTo(d_elem);
  title.append(details.number + ' // ' + name + ' // ' + details.symbol);
  // More here  
}  

function hide_element_details(name, details) {
  console.log("Hide element details for periodic table: name = ", name, ", details = ", details); // For testing only  
  var d_elem = $('#periodic-table-details');
  d_elem.empty(); 
}

function open_link(link_id) {
  console.log("Open link for periodic table: link_id = ", link_id); // For testing only
  if(!link_id) {
    return;
  }
  const CURRENT_RELATIVE_PATH_WITHOUT_TRAILING_SLASH = window.location.pathname.replace(/\/$/, "");
  const NEW_RELATIVE_PATH = CURRENT_RELATIVE_PATH_WITHOUT_TRAILING_SLASH.concat('/', link_id);
  window.open(NEW_RELATIVE_PATH, "_self");
}  

function set_titles_and_links(titles, links) {
  if(!titles) {
    return;
  }
  var d_breadcrumbs = $('#breadcrumbs');
  d_breadcrumbs.empty();
  var breadcrumbs = "";
  breadcrumbs = $('<nav id="breadcrumbs-nav" class="breadcrumbs"></nav>').appendTo(d_breadcrumbs);
  var d_breadcrumbs_nav = $('#breadcrumbs-nav');
  d_breadcrumbs_nav.empty();
  var breadcrumbs_nav = $('<a href="/" class="breadcrumbs__item">Home</a>').appendTo(d_breadcrumbs_nav);
  var capitalizedTitle = "";
  console.log("Set title for periodic table: titles = ", titles); // For testing only
  if(titles[0].trim()=="") {
    hide_breadcrumbs();
    return;
  }
  for (let t = 0; t < titles.length; t++) {
    titles[t] = titles[t].trim();
    console.log("Set title for periodic table: titles[t] = ", titles[t]); // For testing only
    titles[t].toLowerCase();
    const words = titles[t].split(" ");
    for (let i = 0; i < words.length; i++) {
      console.log("Word for periodic table: title[t] = ", words[i]); // For testing only
      if(words[i].trim()=="/") {
        continue;
      } else {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }
    }
    capitalizedTitle = words.join(" ");
    console.log("Capitalized title for periodic table: capitalizedTitle = ", capitalizedTitle); // For testing only
    // Based on https://codepen.io/dp_lewis/pen/MWYgbOY
    var is_active="";

    console.log("t = ", t, " and titles.length = ", titles.length); // For testing only

    if(t+1 == titles.length) {
      is_active=" is-active";
    }
    var locale = window.rn_base_url;

    if( locale.charAt( 0 ) === '/' ) {
      locale = locale.slice(1).split('/')[0];
    }
    locale = locale.split('/')[0];
    console.log("locale = ", locale); // For testing only

    breadcrumbs_nav = $('<a href="/'+ locale + '' + links[t] +'" class="breadcrumbs__item'+ is_active +'">'+ capitalizedTitle +'</a>').appendTo(d_breadcrumbs_nav);
  }
}

function hide_breadcrumbs() {
  var breadcrumbs = $('#breadcrumbs');
  console.log("Hiding breadcrumbs: ", breadcrumbs); // For testing only
  Object.entries(breadcrumbs).forEach(breadcrumb => {
    const [key, value] = breadcrumb;
    if( value instanceof HTMLDivElement) { 
      console.log("Hiding breadcrumb: key = ", key, ", value = ", value); // For testing only 
      value.style.display = "none";
    }
  });  
}

$(document).ready(function() {
  load_elements();
});
