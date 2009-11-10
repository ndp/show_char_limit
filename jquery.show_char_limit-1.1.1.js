/**
* Display interactive character limit feedback for text field or text area.
* see http://ndpsoftware.com/show_char_limit.php
*/
jQuery.fn.show_char_limit = function(limit_or_opts, opts) {

  if (!opts) opts = {};

  // if provided max_length, save it
  if (typeof limit_or_opts === 'number') {
  	opts['maxlength'] = limit_or_opts
  } else {
  	opts = limit_or_opts || {}
  }

  var o = jQuery.extend({
    error_class: 'error',
    status_style: 'text',
    status_element_suffix: '__status'
  }, opts);
  
  var show_limit = function(src) {

    src = jQuery(src);

    var chars_typed = src.val().length;

    var m = src.attr('maxlength');
    if (!m || m == "" || m == -1 || m > 500000) {
    	m = o['maxlength'];
    }
    var left = m - chars_typed;

    var msg;
    if (o.status_style == 'chars_typed') {
      msg = "" + chars_typed;
    } else if (o.status_style == 'chars_left') {
      msg = "" + left;
    } else {
       var status = left >= 0 ? 'left' : 'over';
       var unit = (Math.abs(left) != 1 ? "characters" : "character");
       msg = "" + Math.abs(left) + " " + unit + " " + status;
    }
    
    var e = o.status_element ? o.status_element : ("#" + src.attr('id') + o.status_element_suffix);
    if (jQuery(e).size() == 0) {
    	if (src.attr('id') == '') {
    	    var id = "" + Math.floor(Math.random() * 9999999999);
    		src.attr('id', id);
    		e = '#'+id + o.status_element_suffix;
    	}
    	src.after('<span class="status" id="'+src.attr('id') + o.status_element_suffix +'"></span>');
    }
    jQuery(e).html(msg);
    if (o.error_element || o.error_element_suffix) {
		var e = o.error_element ? o.error_element : ("#" + src.attr('id') + o.error_element_suffix);
		if (left < 0) {
		  jQuery(e).addClass(o.error_class);
		} else {
		  jQuery(e).removeClass(o.error_class);
		}
    }
  };
  
  return this.each(function() {
    show_limit(this);
    jQuery(this).keyup(function() {
      show_limit(this);
    });
  });
};
