export default {
  addClass(el, className) {
    if (typeof el === 'string') el = document.querySelectorAll(el);
    const els = (el instanceof NodeList) ? [].slice.call(el) : [el];

    els.forEach(e => {
      if (this.hasClass(e, className)) { return; }

      if (e.classList) {
        e.classList.add(className);
      } else {
        e.className += ' ' + className;
      }
    });
  },

  removeClass(el, className) {
    if (typeof el === 'string') el = document.querySelectorAll(el);
    const els = (el instanceof NodeList) ? [].slice.call(el) : [el];

    els.forEach(e => {
      if (this.hasClass(e, className)) {
        if (e.classList) {
          e.classList.remove(className);
        } else {
          e.className = e.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
      }
    });
  },

  hasClass(el, className) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (el.classList) {
      return el.classList.contains(className);
    }
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  },

  getOffset(el) {
    const html = el.ownerDocument.documentElement;
    let box = { top: 0, left: 0 };

    if ( typeof el.getBoundingClientRect !== 'undefined' ) {
      box = el.getBoundingClientRect();
    }

    return {
      top: box.top + window.pageYOffset - html.clientTop,
      left: box.left + window.pageXOffset - html.clientLeft
    };
  },

  getPageSize() {
    let xScroll, yScroll;

    if (window.innerHeight && window.scrollMaxY) {
      xScroll = window.innerWidth + window.scrollMaxX;
      yScroll = window.innerHeight + window.scrollMaxY;
    } else {
      if (document.body.scrollHeight > document.body.offsetHeight) { 
        xScroll = document.body.scrollWidth;
        yScroll = document.body.scrollHeight;
      } else { 
        xScroll = document.body.offsetWidth;
        yScroll = document.body.offsetHeight;
      }
    }

    let windowWidth, windowHeight;

    if (self.innerHeight) { 
      if (document.documentElement.clientWidth) {
        windowWidth = document.documentElement.clientWidth;
      } else {
        windowWidth = self.innerWidth;
      }
      windowHeight = self.innerHeight;
    } else {
      if (document.documentElement && document.documentElement.clientHeight) {
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
      } else {
        if (document.body) {
          windowWidth = document.body.clientWidth;
          windowHeight = document.body.clientHeight;
        }
      }
    }

    let pageHeight, pageWidth;

    if (yScroll < windowHeight) {
      pageHeight = windowHeight;
    } else {
      pageHeight = yScroll;
    }
   
    if (xScroll < windowWidth) {
      pageWidth = xScroll;
    } else {
      pageWidth = windowWidth;
    }

    return {
      pageWidth: pageWidth,
      pageHeight: pageHeight,
      windowWidth: windowWidth,
      windowHeight: windowHeight
    };
  }
};
