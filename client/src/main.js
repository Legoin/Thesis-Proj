import $ from 'jquery';

function waterMelon() {
  $('.provider-nav .categories ul li').click(function () {
    var type = $(this).data('type');
    $(this).addClass('active').siblings().removeClass('active');
    $(type).show().siblings().hide();
  });

  $('.gallery-img').hover(function () {
    $(this).children('.img-overlay').toggle(300);
  });

  $('.gallery > div .img-overlay').click(function () {
    $(this).parent().siblings().show();
    $('.img-popup').css({
      position: 'fixed',
    });
  });
  $('.img-popup svg').click(function () {
    $('.img-popup').hide();
  });
}

export default waterMelon;
