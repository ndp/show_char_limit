# Summary

jQuery plugin to display interactive character limit feedback about a text field or textarea.


### Features

Works on text inputs or text areas.

The caller provides the "status" element to display the feedback. If no element can be found,
a new one is created immediately after the text input.

The current status can be formatted as count down, count up, or some other format.

Optionally, for nicer visual styling, the plugin will add a class to any DOM other elements when the field is over the limit. This is convenient as it allows turning an element red, or displaying a hidden div with more detailed error message.

This plugin does nothing to enforce the character limit. This is intentional.

It uses a heuristic to find the status field: appends "_status" to the id of the
text element. For example, if the text field ID is <code>tweet</code>, the status field is <code>tweet_status</code>. You can provide your own "suffix" instead of status, or if you want,
just explicitly provide the element.

### Usage

<pre>$([selector]).show_char_limit([max_length], [options]);</pre>
<pre>$([selector]).showCharLimit([max_length], [options]);</pre>
<pre>$([selector]).showCharLimit([options]);</pre>

#### Options:

* <code>maxlength</code>. The maximum number of characters allowed in the input. May also be passed as the first parameter. 
  This value can (and will be) overriden by an attribute named <code>maxlength</code> on the input element.
* <code>status_element</code>: element to receive the status message. It can be a jQuery object, element or DOM id. Overrides <code>status_element_suffix</code>
* <code>status_element_suffix</code>: a string appended to the src element's id to identify the status element. For this markup: <code>&lt;input type="text" id="name"/&gt;&lt;span id="name_lim"&gt;20 chars&lt;/span&gt;</code>, pass <code>_lim</code>. Default value is <code>__status</code>. If the element is not found, a SPAN is created immediately after the input.
* <code>error_element</code>. An element (or set of elements) have CSS class <code>error</code> added when there are too many characters in the target element. Can be a jQuery object, element or DOM id.
* <code>error_class</code>. Alternate class set on error_element above. Defaults to <code>error</code>.
* <code>status_style</code>. Default is <code>text</code>, which displays a short phrase of "X characters left" or "X characters over". You may also pass <code>chars_typed</code>, which displays the number of characters the user has typed (see twitter). Or <code>chars_left</code>, which counts down to zero.
* <code>status_min</code>. Lower limit when status is shown. Useful if you don't want to warn the user until she gets close to the limit. Defaults to 0.


#### Events

* to manually trigger updating of the counter, <code>$(text element).trigger('showLimit');</code>
* listen for '<code>validationOk</code>' when validation passes (every keystroke), eg.
  <code>jQuery('input').show_char_limit(...).bind('validationOk', function() {})</code>
* listen for '<code>validationError</code>' when validation fails with too many characters (every keystroke), eg.
  <code>jQuery('input').show_char_limit(...).bind('validationError', function() {})</code>

### Demo

[Demo](http://www.ndpsoftware.com/show_char_limit.php)


### Tests

Open `jquery.show_char_limit.html` in a browser.


### History
* 1.3.1: introduced `status_min` attribute

## Legal

Copyright (c) 2005-2012 Andrew J. Peterson
[Apache License](https://github.com/ndp/show_char_limit/raw/master/LICENSE)

