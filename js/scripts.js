/*-----------------------------------------------------------------------------------
    Portfolio scripts (based on the Personala template by his7am)
-----------------------------------------------------------------------------------*/

$(function () {
  "use strict";

  var wind = $(window);

  // scrollIt
  $.scrollIt({
    upKey: 38,
    downKey: 40,
    easing: "swing",
    scrollTime: 600,
    activeClass: "active",
    onPageChange: null,
    topOffset: -63
  });

  // navbar background after scrolling
  wind.on("scroll", function () {
    var navbar = $(".navbar");
    if (wind.scrollTop() > 100) {
      navbar.addClass("nav-scroll");
    } else {
      navbar.removeClass("nav-scroll");
    }
  });

  // section background images from data-background
  $(".bg-img, section").each(function () {
    if ($(this).attr("data-background")) {
      $(this).css("background-image", "url(" + $(this).data("background") + ")");
    }
  });

  // counters
  $(".numbers .count").countUp({ delay: 10, time: 1500 });

  // footer year
  $("#year").text(new Date().getFullYear());

  // theme toggle: dark by default, light as the alternative
  var $body = $("body");
  var $toggle = $("#themeToggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function syncToggle() {
    var dark = $body.hasClass("dark-theme");
    var label = dark ? "Switch to light mode" : "Switch to dark mode";
    $toggle.find("i").attr("class", dark ? "fas fa-sun" : "fas fa-moon");
    $toggle.attr("aria-label", label).attr("title", label);
    if (themeMeta) {
      themeMeta.setAttribute("content", dark ? "#131414" : "#ffffff");
    }
  }
  syncToggle();

  $toggle.on("click", function () {
    $body.toggleClass("dark-theme");
    try {
      localStorage.setItem("theme", $body.hasClass("dark-theme") ? "dark" : "light");
    } catch (e) {}
    syncToggle();
  });
});

// === window load === //
$(window).on("load", function () {
  "use strict";

  // preloader
  $(".loading").fadeOut(500);

  // parallax
  $(window).stellar();

  // contact form
  function showMessage(type, text) {
    var box =
      '<div class="alert alert-' + type + ' alert-dismissable">' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">&times;</button>' +
      text + "</div>";
    $("#contact-form").find(".messages").html(box);
  }

  $("#contact-form").validator();

  $("#contact-form").on("submit", function (e) {
    if (!e.isDefaultPrevented()) {
      $.ajax({
        type: "POST",
        url: "contact.php",
        data: $(this).serialize(),
        dataType: "json",
        success: function (data) {
          if (data && data.message) {
            showMessage(data.type, data.message);
            if (data.type === "success") {
              $("#contact-form")[0].reset();
            }
          }
        },
        error: function () {
          showMessage(
            "danger",
            "Sorry, the message could not be sent. Please email me directly at natnial99@gmail.com."
          );
        }
      });
      return false;
    }
  });
});
