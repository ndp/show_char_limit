Screw.Unit(function() {

  var validationOkCalled, validationErrorCalled;
  var validationOk = function() {
    validationOkCalled = true;
  }
  var validationError = function() {
    validationErrorCalled = true;
  }


  before(function() {
    var $f = $('#fixtures');
    if ($f.attr('original')) {
      $f.html($f.attr('original'));
    } else {
      $f.attr('original', $f.html());
    }
    validationOkCalled = false;
    validationErrorCalled = false;
  });

  describe("text areas", function() {
    before(function() {
      jQuery('#textarea_example textarea').show_char_limit(140);
    });
    it("creates span for character limit", function() {
      expect($('#textarea_example span.status')).to(have_length, 1);
    });
    it("should show characters left", function() {
      expect($('#textarea_example span.status').text()).to(equal, "140 characters left");
    });
    describe('typing a character', function() {
      before(function() {
        $('#textarea_example textarea').val('abc');
        $('#textarea_example textarea').trigger('keyup');
      });
      it("should show characters left", function() {
        expect($('#textarea_example span.status').text()).to(equal, "137 characters left");
      });
    });
    describe('manually triggering update', function() {
      before(function() {
        $('#textarea_example textarea').val('abc');
        $('#textarea_example textarea').trigger('showLimit');
      });
      it("should show characters left", function() {
        expect($('#textarea_example span.status').text()).to(equal, "137 characters left");
      });
    });
  });

  describe('text inputs', function() {

    describe("with defaults", function() {
      before(function() {
        jQuery('#example1 input').show_char_limit();
      });
      it("creates span for character limit", function() {
        expect($('#example1 span.status')).to(have_length, 1);
      });
      it("should show characters left", function() {
        expect($('#example1 span.status').text()).to(equal, "12 characters left");
      });
      describe('typing a character', function() {
        before(function() {
          $('#example1 input').val('abc');
          $('#example1 input').trigger('keyup');
        });
        it("should show characters left", function() {
          expect($('#example1 span.status').text()).to(equal, "17 characters left");
        });
      });
      describe('manually triggering update', function() {
        before(function() {
          $('#example1 input').val('abc');
          $('#example1 input').trigger('showLimit');
        });
        it("should show characters left", function() {
          expect($('#example1 span.status').text()).to(equal, "17 characters left");
        });
      });
    });
    describe("with existing status area", function() {
      before(function() {
        jQuery('#example2 input').show_char_limit({status_element:'#example2 .count'});
      });
      it("should show characters left", function() {
        expect($('#example2 .count').text()).to(equal, "5 characters left");
      });
    });

    describe("setting status_min size", function() {
      it("should not show characters left", function() {
        jQuery('#example2 input').val('12345').show_char_limit({status_element:'#example2 .count', status_min: 10});
        expect($('#example2 .count').text()).to(equal, "");
      });
      it("should not show characters left", function() {
        jQuery('#example2 input').val('123456789A').show_char_limit({status_element:'#example2 .count', status_min: 10});
        expect($('#example2 .count').text()).to(equal, "10 characters left");
      });
    });

    describe("status style 'chars_typed'", function() {
      before(function() {
        jQuery('#example2 input').show_char_limit({status_element:'#example2 .count', status_style: 'chars_typed'});
      });
      it("should show characters only characters typed", function() {
        expect($('#example2 .count').text()).to(equal, "15");
      });
    });
    describe("status style 'chars_left'", function() {
      before(function() {
        jQuery('#example2 input').show_char_limit({status_element:'#example2 .count', status_style: 'chars_left'});
      });
      it("should show characters left", function() {
        expect($('#example2 .count').text()).to(equal, "5");
      });
    });
    describe("passing in maxlength in options", function() {
      before(function() {
        jQuery('#example2 input').show_char_limit({status_element:'#example2 .count', maxlength: 30, status_style: 'chars_left'});
      });
      it("should be ignored in the presence of 'maxlength' attribute", function() {
        expect($('#example2 .count').text()).to(equal, "5");
      });
    });
    describe("passing in maxlength in options", function() {
      before(function() {
        jQuery('#example3 input').show_char_limit({status_element:'#example3 .count', maxlength: 30, status_style: 'chars_left'});
      });
      it("should show characters left", function() {
        expect($('#example3 .count').text()).to(equal, "15");
      });
    });
    describe("passing in maxlength as first param", function() {
      before(function() {
        jQuery('#example3 input').show_char_limit(30, {status_element:'#example3 .count', status_style: 'chars_left'});
      });
      it("should show characters left", function() {
        expect($('#example3 .count').text()).to(equal, "15");
      });
    });

    describe("one character left", function() {

      before(function() {
        jQuery('#example3 input').show_char_limit(16, {status_element:'#example3 .count'})
                .bind('validationOk', validationOk)
                .bind('validationError', validationError)
                .keyup();
      });
      it("should be singular", function() {
        expect($('#example3 .count').text()).to(equal, "1 character left");
      });
      it("should have no error class", function() {
        expect($('#example3').hasClass('error')).to(equal, false);
        expect($('#example3 input').hasClass('error')).to(equal, false);
      });
      it('should trigger validationOk event', function() {
        expect(validationOkCalled).to(equal, true);
        expect(validationErrorCalled).to(equal, false);
      });
    });
    describe("exact length", function() {
      before(function() {
        jQuery('#example3 input').show_char_limit(15, {status_element:'#example3 .count'})
                .bind('validationOk', validationOk)
                .bind('validationError', validationError)
                .keyup();
      });
      it("should show characters left", function() {
        expect($('#example3 .count').text()).to(equal, "0 characters left");
      });
      it("should have no error class", function() {
        expect($('#example3').hasClass('error')).to(equal, false);
        expect($('#example3 input').hasClass('error')).to(equal, false);
      });
      it('should trigger validationOk event', function() {
        expect(validationOkCalled).to(equal, true);
        expect(validationErrorCalled).to(equal, false);
      });
    });
    describe("one too many character", function() {
      before(function() {
        jQuery('#example3 input').show_char_limit(14, {status_element:'#example3 .count', error_element:'#example3'})
                .bind('validationOk', validationOk)
                .bind('validationError', validationError)
                .keyup();
      });
      it("should show plural", function() {
        expect($('#example3 .count').text()).to(equal, "1 character over");
      });
      it("should add an error class", function() {
        expect($('#example3').hasClass('error')).to(equal, true);
        expect($('#example3 input').hasClass('error')).to(equal, false);
      });
      it('should trigger validationError event', function() {
        expect(validationOkCalled).to(equal, false);
        expect(validationErrorCalled).to(equal, true);
      });
    });
    describe("two too many characters", function() {
      before(function() {
        jQuery('#example3 input').show_char_limit(13, {status_element:'#example3 .count', error_element:'#example3'})
                .bind('validationOk', validationOk)
                .bind('validationError', validationError)
                .keyup();
      });
      it("should show plural", function() {
        expect($('#example3 .count').text()).to(equal, "2 characters over");
      });
      it("should add an error class", function() {
        expect($('#example3').hasClass('error')).to(equal, true);
        expect($('#example3 input').hasClass('error')).to(equal, false);
      });
      it('should trigger validationError event', function() {
        expect(validationOkCalled).to(equal, false);
        expect(validationErrorCalled).to(equal, true);
      });
    });
  });

});
