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
      strip: true,
      deprecated_events: true
    }, options);

    var statusMessage = statusMessageFn(options.status_style)


    $(this).bind('check.show-char-limit', function () {

      var $this = $(this);

      var val = $this.val();
      if (options.strip) {
        val = val.replace(/^\s+/, '')
        val = val.replace(/\s+$/, '')
      }
      var currLen = val.length
      if (options.newline_cost > 1)
				currLen += (val.match(/^/mg).length - 1) * (options.newline_cost - 1);

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
      $this.trigger((charsLeft < 0) ? 'error.show-char-limit' : 'ok.show-char-limit');
    });

    return this.each(function () {
      if (options.deprecated_events) {
        $(this).bind('showLimit ok.show-char-limit error.show-char-limit', function(e) {
          if (e.type == 'showLimit') {
            $(this).trigger('check.show-char-limit')
          } else if (e.type == 'ok') {
            $(this).trigger('validationOk')
          } else if (e.type == 'error') {
            $(this).trigger('validationError')
          }
        })
      }

      $(this).
          trigger('check.show-char-limit').
          keyup(function () {
            $(this).trigger('check.show-char-limit');
          }).
          change(function () {
            $(this).trigger('check.show-char-limit');
          });
    });
  };

  $.fn.show_char_limit = $.fn.showCharLimit; // backward compatible

})(jQuery);


