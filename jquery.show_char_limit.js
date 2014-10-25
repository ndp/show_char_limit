/**
 * Display interactive character limit feedback for text field or text area.
 * see https://github.com/ndp/show_char_limit
 * License: apache 2.0
 */
(function ($) {

  function ensureAnId($e) {
    if ($e.attr('id') == '') {
      $e.attr('id', "" + Math.floor(Math.random() * 9999999999));
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


  function statusMessageFn(style) {

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

    if (style == 'chars_typed') {
      return charsTypedMsg
    } else if (style == 'chars_left') {
      return charsLeftMsg
    } else {
      return defaultMsg
    }
  }


  $.fn.showCharLimit = function (limitOrOptions, options) {

    // if provided max_length as unnamed argument, save it
    if (typeof limitOrOptions === 'number') {
      if (!options) options = {};
      options['maxlength'] = limitOrOptions
    } else {
      options = limitOrOptions || {}
    }

    options = $.extend({
      error_class: 'error',
      status_style: 'text',
      status_element_suffix: '__status',
      status_min: 0,
      newline_cost: 1,
      strip: true
    }, options);

    var statusMessage = statusMessageFn(options.status_style)


    $(this).bind('showLimit', function () {

      var $this = $(this);

      var val = $this.val();
      if (options.strip) {
        val = val.replace(/^\s+/, '')
        val = val.replace(/\s+$/, '')
      }
      var currLen = val.length
      if (options.newline_cost !== 1 && /[\n\r]/.test(val)) {
        currLen += (/[\n\r]/g.exec(val).length * (options.newline_cost - 1));
      }

      var maxLen = calcMaxLength($this, options['maxlength']);
      var charsLeft = maxLen - currLen;

      var statusElem = options.status_element ? options.status_element : ("#" + $this.attr('id') + options.status_element_suffix);
      if ($(statusElem).size() == 0) {
        ensureAnId($this);
        statusElem = '#' + $this.attr('id') + options.status_element_suffix;
        $this.after('<span class="status" id="' + $this.attr('id') + options.status_element_suffix + '"></span>');
      }
      if (currLen < options.status_min) {
        $(statusElem).html('');
      } else {
        $(statusElem).html(statusMessage(currLen, charsLeft));
      }

      if (options.error_element || options.error_element_suffix) {
        var e = options.error_element ? options.error_element : ("#" + $this.attr('id') + options.error_element_suffix);
        $(e).toggleClass(options.error_class, charsLeft < 0);
      }
      $this.trigger((charsLeft < 0) ? 'validationError' : 'validationOk');
    });

    return this.each(function () {
      $(this).
          trigger('showLimit').
          keyup(function () {
            $(this).trigger('showLimit');
          }).
          change(function () {
            $(this).trigger('showLimit');
          });
    });
  };

  $.fn.show_char_limit = $.fn.showCharLimit; // backward compatible

})(jQuery);


