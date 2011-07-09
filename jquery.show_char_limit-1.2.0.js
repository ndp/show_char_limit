/**
 * Display interactive character limit feedback for text field or text area.
 * see http://ndpsoftware.com/show_char_limit.php
 */
(function($) {

  function ensureElementHasId($this) {
    if ($this.attr('id') == '') {
      var id = "" + Math.floor(Math.random() * 9999999999);
      $this.attr('id', id);
    }
  }

  // Allows individual elements to override a provided default
  function calcMaxLength($this, defaultMaxLength) {
    var maxLen = $this.attr('maxlength');
    if (!maxLen || maxLen == "" || maxLen == -1 || maxLen > 500000) {
      maxLen = defaultMaxLength;
    }
    return maxLen;
  }


  function generateMessage(style, currLen, charsLeft) {
    var msg;
    if (style == 'chars_typed') {
      msg = "" + currLen;
    } else if (style == 'chars_left') {
      msg = "" + charsLeft;
    } else {
      var status = charsLeft >= 0 ? 'left' : 'over';
      var unit = (Math.abs(charsLeft) != 1 ? "characters" : "character");
      msg = "" + Math.abs(charsLeft) + " " + unit + " " + status;
    }
    return msg;
  }


  $.fn.showCharLimit = function(limitOrOptions, options) {

    if (!options) options = {};

    // if provided max_length, save it
    if (typeof limitOrOptions === 'number') {
      options['maxlength'] = limitOrOptions
    } else {
      options = limitOrOptions || {}
    }

    var o = $.extend({
      error_class: 'error',
      status_style: 'text',
      status_element_suffix: '__status'
    }, options);


    $(this).bind('showLimit', function() {

      var $this = $(this);

      var currLen = $this.val().length;

      var maxLen = calcMaxLength($this, o['maxlength']);
      var charsLeft = maxLen - currLen;

      var statusElem = o.status_element ? o.status_element : ("#" + $this.attr('id') + o.status_element_suffix);
      if ($(statusElem).size() == 0) {
        ensureElementHasId($this);
        statusElem = '#' + $this.attr('id') + o.status_element_suffix;
        $this.after('<span class="status" id="' + $this.attr('id') + o.status_element_suffix + '"></span>');
      }
      $(statusElem).html(generateMessage(o.status_style, currLen, charsLeft));

      if (o.error_element || o.error_element_suffix) {
        var e = o.error_element ? o.error_element : ("#" + $this.attr('id') + o.error_element_suffix);
        $(e).toggleClass(o.error_class, charsLeft < 0);
      }
      $this.trigger((charsLeft < 0) ? 'validationError' : 'validationOk');
    });

    return this.each(function() {
      $(this).trigger('showLimit');
      $(this).keyup(function() {
        $(this).trigger('showLimit');
      });
    });
  };

  $.fn.show_char_limit = $.fn.showCharLimit; // backward compatible


})(jQuery);


