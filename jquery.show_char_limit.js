/**
 * Display interactive character limit feedback for text field or text area.
 * see https://github.com/ndp/show_char_limit
 * License: apache 2.0
 */
(function($) {

  function ensureElementHasId($this) {
    if ($this.attr('id') == '') {
      $this.attr('id', "" + Math.floor(Math.random() * 9999999999));
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


  function charsTypedMsg(currLen, charsLeft) {
    return "" + currLen;
  }
  function charsLeftMsg(currLen, charsLeft) {
    return "" + charsLeft;
  }

  function defaultMsg(currLen, charsLeft) {
    var status = charsLeft >= 0 ? 'left' : 'over';
    var unit = (Math.abs(charsLeft) != 1 ? "characters" : "character");
    return "" + Math.abs(charsLeft) + " " + unit + " " + status;
  }

  function statusMessageFn(style) {
    if (style == 'chars_typed') {
      return charsTypedMsg
    } else if (style == 'chars_left') {
      return charsLeftMsg
    } else {
      return defaultMsg
    }
  }


  $.fn.showCharLimit = function(limitOrOptions, options) {

    // if provided max_length as unnamed argument, save it
    if (typeof limitOrOptions === 'number') {
      if (!options) options = {};
      options['maxlength'] = limitOrOptions
    } else {
      options = limitOrOptions || {}
    }

    var o = $.extend({
      error_class: 'error',
      status_style: 'text',
      status_element_suffix: '__status',
      status_min: 0
    }, options);

    var statusMessage = statusMessageFn(o.status_style)

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
      if (currLen < o.status_min) {
        $(statusElem).html('');
      } else {
        $(statusElem).html(statusMessage(currLen, charsLeft));
      }

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


