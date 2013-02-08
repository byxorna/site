$(function(){
  $('[rel=tooltip]').tooltip();
  $('body').on('click','.date',function(evt){
    // swap dates with data-alt-date on click
    var ctx = $(this);
    var old = ctx.text();
    var data = ctx.data('alt-date');
    if(data){
      ctx.text(data);
      ctx.data('alt-date',old);
    }
  });
});
