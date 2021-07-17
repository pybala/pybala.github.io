---
title: "Customizing Google Translator"
date: "2014-07-03"
canonical: "https://balakumar.net.in/customizing-google-translator/"
categories: 
  - "js"
tags: 
  - "google-translator"
  - "javascript"
  - "translator"
---

To use Google Translator, add your website to [https://translate.google.com/manager/website/add](https://translate.google.com/manager/website/add)

You will get a script to embed in your page, that adds Google Translator toolbar and the Language dropdown to your page.

## Customizing the Language dropdown and the Google Translator

```html
<!-----------------------------------
*** Add the below code under HEAD ***
------------------------------------>
<meta name="google-translate-customization" content="<place your key here>">
<script type="text/javascript">
function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: 'en',
            includedLanguages: 'de,en,es,fr,ja,nl,pt,zh-CN',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        },
        'artitleTranslate'
    );

    googObj.translator.init();
}
</script>
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
```

```html
<!-----------------------------------
*** Custom Language Dropdown Box ***
------------------------------------>
<div id="artitleTranslate"> </div><!-- Google Translate Div -->

<!-- Custom Language dropdown -->
<select id="customTranslate">
    <option value="English">English</option>
    <option value="French">Fran&#231;ais</option>
    <option value="Dutch">Nederlands</option>                
    <option value="Chinese (Simplified)">&#31616;&#20307;&#20013;&#25991;</option>               
    <option value="German">Deutsch</option>
    <option value="Japanese">&#26085;&#26412;&#35486;</option>
    <option value="Portuguese">Portugu&#234;s</option>
    <option value="Spanish">Espa&#241;ol</option>
</select>

<!-- Styles -->
<style type="text/css">
#artitleTranslate, #customTranslate, .goog-te-banner-frame {
 display: none;
}
</style>
```

Add the below javascript to customize all the elements of Google Translator

```js
var googObj = googObj || {};

(function($) {
  googObj.translator = {
      langCode: {
          'en': 'English',
          'fr': 'French',
          'nl': 'Dutch',
          'de': 'German',
          'zh-CN': 'Chinese (Simplified)',
          'ja': 'Japanese',
          'pt': 'Portuguese',
          'es': 'Spanish'
      },
      
      initDropdown: function() {
          $('#customTranslate').change(function() {
              $(this).blur();
              var lang = $(this).val();
              var $frame = $('iframe.goog-te-menu-frame:first');
              if (!$frame.size()) {
                  return false;
              }

              $( $frame.contents().find('.goog-te-menu2-item span.text') ).each(function( index ) {
                  if ($(this).text() == lang) {
                      if (lang == 'English') {
                          googObj.translator.showOriginalText();
                          return false;
                      }
                      
                      $(this).click();

                      return false;
                  }
              });
              return false;
          });
      },
      
      showOriginalText: function() {
          var googBar = $('iframe.goog-te-banner-frame:first');
          $( googBar.contents().find('.goog-te-button button') ).each(function( index ) {
              if ( $(this).text() == 'Show original' ) {
                  $(this).trigger('click');

                  if ($('#customTranslate').val() != 'English') {
                      $('#customTranslate').val('English');
                  }
                  return false;
              }
          });
      },
      
      setLangDropdown: function() {
          var cookieVal = this.getCookieValue();
          if (cookieVal) {
              $('#customTranslate').val( this.langCode\[cookieVal\] );
          }
      },
      
      getCookieValue: function() {
          var transCookie = getCookie('googtrans');
          if ( transCookie ) {
              transCookie = transCookie.split('/');
              transCookie = transCookie\[2\];
              return transCookie;
          }
          
          return false;
      },
      
      init: function() {
          if (document.getElementById('customTranslate')) {
              $('#customTranslate').show();
              this.initDropdown();
              this.setLangDropdown();
          }
      }
  }
})(jQuery);

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i=0; i < ca.length; i++) {
        var c = ca\[i\];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if ( c.indexOf(nameEQ) == 0 ) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
}
```
