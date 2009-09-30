(function($, pageSlider) {
  $[pageSlider] = {
    defaults: { 
      containerSelector: '#maincontent'
    },
    canAnimate: !($.browser.msie && ($.browser.version < 7)),
    canAnimateBrowserHeight: $.browser.safari
  };
  
  $.fn[pageSlider] = function(options) {
    // Abort if there are no pages
    if (this.length < 1) {
      return this;
    }

    options       = $.extend({}, $[pageSlider].defaults, options);
    var container = $(options.containerSelector),
        blocks    = this,
        firstrun  = true;
    
    // Initialize the offsets once everything has settled
    $(window).load(function() {
      var offsetTop = 0;
      blocks.each(function() {
        $(this).data('offsetTop', offsetTop);
        offsetTop += $(this).height();
      });
      
      $.historyInit(function(anchor_name) {
        var page      = blocks.filter('[title=' + anchor_name + ']'),
            offsetTop = page.data('offsetTop');

        // Event allowing other items to change with the block (for example, highlight the next page in the nav)
        $(document).trigger('changingPage', [anchor_name]);

        if (!firstrun && $[pageSlider].canAnimate) {
          if ($[pageSlider].canAnimateBrowserHeight) {
            container.stop().animate({ 
              scrollTop: offsetTop,
              height:    page.height()
            });
          } else {
            container.css({ height: page.height() })
                     .stop().animate({ scrollTop: offsetTop });
          }
        } else {
          container.css({ height: page.height() }).scrollTop(offsetTop);
        }

        firstrun = false;
      });

      if (firstrun) {
        $.historyLoad(blocks.eq(0).attr('title'));
      }

      $("a[href^=#]").click(function(){
        var hash = $(this).attr('href').replace(/^.*#/, '');
        $.historyLoad(hash);
        return false;
      });
    });
    
    return this;
  };
})(jQuery, "pageSlider");