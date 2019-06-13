//// round text

function roundText(el,settings){
  if(typeof el == "string" || !el){
      el = $((el || '') + '.roundText-prepare');
  }
  settings = $.extend({
    offsetX: 0,
    offsetY: 0,
    space: 10,
    start: 0,
    radius: 0,
  },settings || {})
  el.each(function(){
    var item = $(this),
      text = item.text().split(''),
      counter = 0,
      size = +item.data('radius') || settings.radius,
      offsetX = +item.data('offsetX') || settings.offsetX,
      offsetY = +item.data('offsetY') || settings.offsetY,
      deg = 2*Math.asin(((+item.data('space') || settings.space)/2)/size),
      n = 180/Math.PI,
      start = (+item.data('start') || settings.start)/n;

    item.removeClass('roundText-prepare').addClass('roundText').html('');
    for(var s of text){
      let a = start + deg*counter++,
        y = Math.sin(a)*size+offsetY,
        x = Math.cos(a)*size+offsetX;

        item.append($('<div>')
          .attr({
            class: 'roundText-item'
          })
          .css({
            top:-y,
            left:-x,
            transform:"rotate("+(a*n-90)+"deg)"
          }).text(s)
        );
    }
  })
}

/*
<div style="border: 1px solid red; margin: 100px; width: 100px;">
  <div class="roundText-prepare" data-radius="50" data-offset-x="5" data-offset-y="8" data-space="10" data-start="90">Some round text</div>
</div>
*/

///// dynamic-line
function dynamicLine(el){
  if(typeof el == "string" || !el){
      el = $((el || '') + '.dynamic-line');
  }

  var calculationRotateItem = function(){
    var item = $(this);
    var start = {
        x: +item.data('startX'),
        y: +item.data('startY'),
      },
      end = {
        x: +item.data('endX'),
        y: +item.data('endY'),
      },
      length = Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2)),
      ang = Math.atan2(end.y - start.y, end.x - start.x)/(Math.PI/180);
      item.css({
        top: start.y,
        left: start.x,
        width: length,
        transform: "rotate("+ang+"deg)",
      });
  },
  line = function(start, end){
    if(start) $(this).data('startX',start.x).data('startY',start.y);
    if(end) $(this).data('endX',end.x).data('endY',end.y);
    $(this).trigger("update");
  }
  el.each(function(){
    this.line = line.bind(this);
    $(this).on("update",calculationRotateItem).trigger("update");
  });
}

/*
<div class="dynamic-line" data-start-x="0" data-start-y="0" data-end-x="100" data-end-y="100" >
  <div class="puls"></div>
</div>
*/

///// roundBar
function roundBar(el){
  if(typeof el == "string" || !el){
      el = $((el || '') + '.round-bar .bar');

  }
  var updateBar = function(){
    var bar = $(this),
      value = +bar.data('value'),
      rightSide = bar.data('side') == 'right',
      maxValue = +bar.data('max') || 100,
      bottom = bar.parent().hasClass('bottom'),
      maxA = maxValue*1.8,
      a = value*(maxA/100);
      a = a<0 ? 0 : (a>maxA ? maxA : a);
      a += bottom ? 180 : 0;
      rightSide = bottom ? !rightSide : rightSide;
      if(rightSide) a = 45-a;
      else a += 45;
      bar.css('transform', 'rotate('+(a)+'deg)');
  }
  el.on("update",updateBar).each(updateBar);
}

/*
  <div class="round-bar"> //или class="round-bar bottom"
    <div class="bar" data-value="80" data-max="100" data-side="left"></div>
    <div class="bar line2" data-value="80" data-max="50" data-side="left" style="border-color: #f68d00;"></div>
    <div class="bar line2" data-value="20" data-max="50" data-side="right" style="border-color: #ff0000;"></div>
  </div>
*/

///// roundBarAxis
function roundAxis(el){
  if(typeof el == "string" || !el){
      el = $((el || '') + '.round-axis');

  }
  var updateAxis = function(){
    var axis = $(this),
      radius = +axis.data('radius') || axis.width(),
      maxAngle = +axis.data('max') || 360,
      count = axis.data('count') || 100,
      inside = !!axis.data('inside'),
      d = maxAngle / count,
      k = 180/Math.PI;
      for(let i = 0; i<count; i++){
        let item = $('<i>'),
          a = d * i,
          x = Math.cos(a/k) * radius,
          y = Math.sin(a/k) * radius,
          type =i%5 ? "small" : '';
        if(i%10 == 0) type = 'big';
        if(inside) a += 180;
        item.css({
          left: x,
          top: y,
          transform: 'rotate('+a+'deg)'
        }).attr('class', type);
        axis.append(item);
      }
  }
  el.on("update",updateAxis).each(updateAxis);
}

/*
<div class="round-axis" data-count="100" data-radius="100" data-max="360"></div> // data-inside="true" для линий во внутрь
*/