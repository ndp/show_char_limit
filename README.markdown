# Summary

Display interactive feedback about a text field or text area with character limit.

## Description

The caller provides the "status" element to display the feedback. So that it can support instrumenting multiple fields at once, it can calculate the status field from the target field's ID, such as "#tweet" => "#tweet_status".

The current status can be formatted as count down, count up, or some other format.

Optionally it can add a class to any DOM elements when the field is over the limit. This is convenient as it allows turning an element red, or displaying a hidden div with more detailed error message.

This does nothing to enforce the limit. This is intentional.

## Usage

<pre>$([selector]).show_char_limit([max_length], [options]);</pre>

### Options:

* <code>maxlength</code>. The maximum number of characters allowed in the input. May also be passed as the first parameter. Overriden by an attribute named maxlength on the input element.
* <code>status_element</code>: element to receive the status message. It can be a jQuery object, element or DOM id. Overrides status_element_suffix
* <code>status_element_suffix</code>: string appended to the src element's id to find the status element. Required if instrumenting multiple elements at once. For this markup: "<input type="text" id="name"/><span id="name_lim">20 chars</span>", pass "_lim". Default value is '__status'. If the element is not found, a SPAN is created immediately after the input.
* <code>error_element</code>. An element (or set of elements) have CSS class "error" added when there are too many characters in the target element. Can be a jQuery object, element or DOM id.
* <code>error_class</code>. Alternate class set on error_element above. Defaults to "error"
* <code>status_style</code>. Default is 'text', which displays a short phrase of "X characters left" or "X characters over". You may also pass 'chars_typed', which displays the number of characters the user has typed (see twitter). Or 'chars_left', which counts down to zero.


### Events

* to manually trigger updating of the counter, $(text element).trigger('showLimit');

## Demo

http://www.ndpsoftware.com/show_char_limit.php