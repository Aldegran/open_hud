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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function hudInit(widgets, gridSettings) {
	return new hudClass(widgets, gridSettings);
}
const texts = {
	lorem: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam neque ante, iaculis sed neque varius, sagittis cursus odio. Duis tellus odio, accumsan eget magna non, rhoncus mattis enim. Donec eu ex sit amet enim consectetur suscipit quis non metus. Aenean at nunc erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer eu tristique quam. Nam dapibus mattis nibh nec gravida. Etiam id volutpat urna. <br><br> Suspendisse potenti. Etiam a ullamcorper nulla. Proin malesuada ligula nisl, suscipit faucibus lectus egestas eget. Fusce eget eros non nunc porttitor tempus ut quis enim. Nulla sed nibh vitae leo mollis iaculis in quis augue. Maecenas velit felis, pellentesque at rutrum nec, accumsan at mi. Aenean sed accumsan purus, ut viverra libero. Mauris dignissim nisl lectus. Pellentesque sit amet augue neque. Phasellus facilisis non justo sed scelerisque. <br><br> Nulla non pellentesque est. Pellentesque id magna et felis consectetur eleifend. Donec non turpis imperdiet, porttitor massa sit amet, aliquam elit. Nulla a lacus tempus, pulvinar lectus scelerisque, ornare ligula. Proin nisi sapien, placerat sit amet hendrerit nec, fringilla id erat. Nullam non congue neque, et maximus urna. Suspendisse semper commodo mi, et facilisis erat pharetra et. Nulla facilisi. Morbi ut egestas lorem. Maecenas dictum dictum ante id tristique. Fusce at sapien turpis. <br><br> Aliquam suscipit eros quis bibendum fermentum. Donec sed purus in libero congue pulvinar. Duis in placerat erat. Curabitur arcu orci, scelerisque eu turpis sit amet, rutrum cursus purus. Vestibulum aliquam nisi est, in convallis lacus fringilla ac. Proin pulvinar efficitur augue, non elementum magna commodo ut. Maecenas aliquet interdum ex. In in lectus erat. Aenean suscipit urna nec molestie congue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. <br><br> Sed aliquet est ut magna semper, nec mollis est pulvinar. Nulla facilisi. Phasellus interdum arcu dui, hendrerit suscipit turpis dignissim et. Aliquam tempor varius gravida. Suspendisse rhoncus libero tellus, id sodales urna blandit at. Praesent elementum, enim ut elementum malesuada, erat turpis vestibulum libero, et lacinia elit diam quis nisl. Aenean egestas sodales viverra. Proin bibendum diam nec arcu pharetra, vitae porta neque mollis. Vestibulum facilisis, neque in fringilla rutrum, sapien metus vulputate quam, varius aliquam nisi urna in nulla. Sed ut metus vitae dui convallis eleifend at nec nisl. Nunc metus ligula, dignissim malesuada aliquam a, efficitur vel nisi. Quisque vel ex leo. Pellentesque dapibus egestas ex, quis finibus tellus convallis feugiat. Nulla vestibulum lectus ut hendrerit dapibus.",
	sumbols: ("qwertyuiopasdfghjklzxcvbnm").split(''),
	strings: []
}
texts.strings = texts.lorem.split(' ').filter(a => a!="<br><br>" && a.length > 2).map(a => a.replace('.','').replace(',','').toLowerCase());
const rand = function(max) {
	return Math.round(Math.random() * max);
}
const randSumbol = function() {
	return texts.sumbols[rand(texts.sumbols.length-1)];
}
const randString = function() {
	return texts.strings[rand(texts.strings.length-1)];
}
class hudClass {
	constructor(widgets, gridSettings){
		this.gridSettings = Object.assign({
			gridWidth:9, 
			gridHeight:14, 
			usePopup: true,
			useCell: true,
			grid: 86,
			css: false,
			resize: {
                vertical: 'center',
                horisontal: 'center'
            }
		}, gridSettings);
		this.grid = this.gridSettings.grid;
		if(this.gridSettings.css){
			$("head").append($("<link>").attr({
				href: "../src/css/"+(this.gridSettings.css === true ? 'huds' : this.gridSettings.css)+".css",
				rel: "stylesheet",
				type: "text/css"
			}))
		}
		this.widgets = widgets;
		this.gridContainer = $(gridSettings.container || 'body')
		this.gridContainer.resize(()=>this.resize())
		this.gridContainer.css({
			display:'flex',
			position:'relative'
		});
		const el = $('<div>').attr('class',"grid");
		if(this.gridSettings.usePopup){
			const popup = $('<div>').attr('class', 'editable-popup').html("<div><b></b><span><input/></span></div>")
			this.gridContainer.append($('<div>').attr('class', 'editable-cover').click((event)=>{
				if($(event.target).hasClass('editable-cover')) this.editableClose();
			}).append(popup));
		}
		if(this.gridSettings.useCell){
			for(let y = 0; y < this.gridSettings.gridHeight; y++) {
				for(let x = 0; x < this.gridSettings.gridWidth; x++) {
					el.append($("<div>").addClass('cell').data('x',x).data('y',y));
				}
			}
		}
		this.gridContainer.append(el);
		this.generate();
		this.resize();
	}

	generate(){
		this.widgets.map(widget => this.draw(widget));
	}

	draw(widget, container){
		const content = container || this.gridContainer.find('.grid');
		const w = typeof widget.content === "string" ? this[widget.content](widget) : widget.content(widget);
		w.css({
			top: widget.y*this.grid,
			left: widget.x*this.grid,
			width: (widget.w || 1)*this.grid-6,
			height: (widget.h || 1)*this.grid-6
		})
		w.data('widget', widget);
		content.append(w);
		if(widget.after) widget.after(w);
		widget.container = w;
		return widget;
	}

	remove(widget){
		const list = this.widgets.concat([]);
		list.forEach((item, index) => {
			if(item.x === widget.x && item.y === widget.y){
				item.container.remove();
				this.widgets.splice(index,1);
			}
		})
	}

	clear(){
		this.widgets.forEach(item =>item.container.remove());
		this.widgets = [];
	}

	resize(){
		if(this.gridSettings.gridWidth){
			const containers = this.gridContainer.find('.grid, .content');
			const width = window.screen.width;
			const height = window.screen.height;
			const contentWidth = this.grid * this.gridSettings.gridWidth;
			const contentHeight = this.grid * this.gridSettings.gridHeight;
			const css = {
				width: contentWidth,
				height: contentHeight,
			}
			this.gridContainer.css(css);
			if(this.gridSettings.resize.vertical == 'center'){
				css.top = height  > contentHeight ? (height - contentHeight) / 2 : 0
			} else if(this.gridSettings.resize.vertical == 'top'){
				css.top = 0;
			} else if(this.gridSettings.resize.vertical == 'bottom'){
				css.bottom = 0;
			}

			if(this.gridSettings.resize.horisontal == 'center'){
				css.left = width  > contentWidth ? (width - contentWidth) / 2 : 0
			} else if(this.gridSettings.resize.horisontal == 'left'){
				css.left = 0;
			} else if(this.gridSettings.resize.horisontal == 'right'){
				css.right = 0;
			}

			containers.css(css);
		}
	}

	editable(el, widget){
		if(!this.gridSettings.usePopup) return;
		this.gridContainer.find(".editable-cover").addClass('open');
		this.gridContainer.find('.grid, .content').addClass('blur');
		const popup = $(".editable-popup");
		let type = widget.params.type || 'number';
		if(type === 'num') type = 'number';
		popup.addClass('open');
		popup.find('b').text(widget.params.name);
		popup.find('input')
			.attr('type', type)
			.val(widget.params.value)
			.focus()
			.keypress((e)=>{
				if(e.key === 'Enter'){
					const value = e.target.value;
					widget.params.value = value;
					el.find('span.editable').text(value);
					widget.params.editCallback && widget.params.editCallback(value);
					this.editableClose();
				} else if(e.key === 'Escape'){
					this.editableClose();
				}
			});
	}

	editableClose(){
		this.gridContainer.find(".editable-popup, .editable-cover").removeClass('open');
		this.gridContainer.find('.grid, .content').removeClass('blur');
	}

	text(widget){
		let d = texts[widget.params.text] || widget.params.text ;
		if(widget.params.count){
			for(let i = 0; i<widget.params.count-1; i++) d+="<br><br>"+d;
		}
		return $("<div class='textList'><div class="+(widget.params.addClass || '')+">"+d+"</div></div>");
	}

	list(widget){
		const el = $("<div class='list "+(widget.params.addClass || '')+"'></div>"); 
		const elIn = $("<div></div>"); 
		const count = 100;
		for(let i = 0; i < count; i++) {
			const e = $("<div>");
			if(rand(100)>90){
				e.append("<span class='fail'>[ FAIL ]</span>");
				e.append($("<span class='text fail'>").html(randString() + ' ' + randString() + ' ' + randString()));
				
			} else {
				e.append("<span class='ok'>[ OK ]</span>");
				e.append($("<span class='text'>").html(randString() + ' ' + randString() + ' ' + randString()));
			}
			
			
			elIn.append(e);
		}
		return el.append(elIn);
	}

	bar(widget){
		const el = $("<div class='bars "+(widget.params.addClass || '')+"'></div>"); 
		if(widget.params.data === 'random'){
			let data = [];
			for(let i = 0; i < widget.params.count; i++) data.push(rand(100));
			widget.params.data = data;
		}
		widget.params.data.map(bar => {
			const b = $("<div>");
			b.css({
				width: (widget.w * this.grid) / widget.params.data.length,
				height: bar+'%'
			})
			el.append(b);
			if(widget.update){
				setTimeout(()=>this[widget.update.callback](b, widget), rand(widget.update.time))
			}
		})
		return el;
	}
	barUpdate(el, widget){
		el.height(rand(100)+'%');
		setTimeout(()=>this.barUpdate(el, widget), widget.update.time/2+rand(widget.update.time));
	}

	roundBar(widget){
		const el = $("<div class='roundBar'>");
		const rb = $("<div class='round-bar top'></div>");
		const rb2 = $("<div class='round-bar bottom'></div>");
		const ra = $("<div class='round-axis' data-count='100' data-radius='"+((widget.w * this.grid/2)*0.9)+"' data-max='360'></div>");
		const ra2 = $("<div class='round-axis inside' data-inside='true' data-count='100' data-radius='"+((widget.w * this.grid/2)*0.73)+"' data-max='360'></div>");
		rb2.append("<div class='bar' data-id='1' data-value='0' data-max='100' data-side='right' style='border-color: var(--c-second);'></div>");
		rb.append("<div class='bar' data-id='1' data-value='0' data-max='100' data-side='left' style='border-color: var(--c-second);'></div>");
		rb2.append("<div class='bar line2' data-id='2' data-value='0' data-max='100' data-side='right' style='border-color: var(--c-negative);'></div>");
		rb.append("<div class='bar line2' data-id='2' data-value='0' data-max='100' data-side='left' style='border-color: var(--c-negative);'></div>"); 
		el.append(rb);
		el.append(rb2);
		el.append(ra);
		el.append(ra2);
		el.append("<div class='centerElement'><div></div></div>");
		roundBar(el.find('.bar'));
		roundAxis(el.find('.round-axis'));
		el.find('.bar').trigger('update');
		ra.trigger('update');
		if(widget.update){
			setTimeout(()=>this[widget.update.callback](el, widget), 10)
		}

		['topLeftText','topRightText','downLeftText','downRightText'].map(l => {
			if(widget.params[l]){
				const d = widget.params[l] === true ? randString()+"<br>"+randString() : widget.params[l];
				el.append($("<div class='text "+l+"'>" + d + "</div>"));
			}
		})
		return el;
	}
	roundBarUpdate(el, widget){
		el.find('.round-bar.top .bar').each(function() {
			const count = rand(200);
			const dataId = $(this).data('id');
			const v1 = count > 100 ? 100 : count;
			const v2 = count > 100 ? count - 100 : 0;
			$(this).data('value', v1).trigger('update');
			el.find('.round-bar.bottom .bar[data-id='+dataId+']').data('value', v2).trigger('update');
		});
		el.find('.centerElement div').html(rand(9999));
		setTimeout(()=>this.roundBarUpdate(el, widget), rand(widget.update.time))
	}
	values1(widget){
		const el = $("<div class='values1 "+(widget.params.addClass || '')+"'></div>"); 
		const count = widget.h * 4;
		for(let i = 0; i < count; i++) {
			const e = $("<div>");
			e.append("<b>"+randSumbol()+randSumbol()+randSumbol()+"</b>");
			const v = $("<span>").html(widget.params.value || rand(widget.params.max));
			e.append(v);
			if(widget.update){
				setTimeout(()=>this[widget.update.callback](v, widget), rand(widget.update.time))
			}
			el.append(e);
		}
		return el;
	}
	values2(widget){
		const editable = widget.params.editable || false;
		const el = $("<div class='values2 "+(editable ? 'editable ' : '')+(widget.params.addClass || '')+"'></div>"); 
		const e = $("<div>");
		const d = widget.params.name === true ? randSumbol()+randSumbol()+randSumbol() : widget.params.name;
		e.append("<b>"+d+"</b>");
		const type = widget.params.type || 'num';
		const v = $("<span>");
		if(widget.params.value) {
			v.html(widget.params.value);
		} else {
			v.html(type === 'num' ? rand(widget.params.max || 100) : randString());
		}
		if(editable && this.gridSettings.usePopup){
			v.addClass('editable');
			el.click(()=>this.editable(el, widget))
		}
		e.append(v);
		if(widget.update){
			if(typeof(widget.update.callback) === 'string'){
				setTimeout(()=>this[widget.update.callback](v, widget), rand(widget.update.time));
			} else if(widget.update.callback) widget.update.callback(el, widget);
		}
		el.append(e);
		return el;
	}

	valueUpdate(el, widget){
		let d;
		if(window['Android'] !== undefined && widget.params.acum){
			d = Android.batteryStatus();
		} else {
			d = rand(widget.params.max);
		}
		el.html(d);
		setTimeout(()=>this.valueUpdate(el, widget), rand(widget.update.time));
	}

	map(widget){
		const el = $("<div class='map "+(widget.params.addClass || '')+"'></div>"); 
		const e = $("<img src='../src/world.svg'/>");
		if(widget.update){
			setTimeout(()=>this[widget.update.callback](e, widget), 5000)
		}
		el.append(e);
		el.append($("<div class='xAxis'></div>"));
		el.append($("<div class='yAxis'></div>"));
		el.append($("<div class='axisCenter'></div>"));
		return el;
	}

	mapUpdate(el, widget){
		el.css({
			top:-rand(1000),
			left:-rand(1000),
		});
		setTimeout(()=>this.mapUpdate(el, widget), 15000);
	}


	liner(widget){
		const el = $("<div class='liner "+(widget.params.addClass || '')+"'></div>");
		const e = $("<div>");
		['top','left','down','right'].map(l => {
			if(widget.params[l]){
				e.append($("<div class='line "+l+" "+widget.params[l]+"'></div>"))
			}
			if(widget.params[l+'Side']){
				e.append($("<div class='side "+l+"Side "+widget.params[l+'Side']+"'><div></div></div>"))
			}
		})
		if(widget.params.center){
			let d = '';
			if(widget.params.centerText) {
				d = widget.params.centerText === true ? randString()+" "+randString()+" "+randString()+" "+randString() : widget.params.centerText;
			}
			e.append($("<div class='center "+widget.params.center+"'><div>"+d+"</div></div>"))
		}
		['topLeftText','topRightText','downLeftText','downRightText'].map(l => {
			if(widget.params[l]){
				const d = widget.params[l] === true ? randString()+"<br>"+randString() : widget.params[l];
				e.append($("<div class='text "+l+"'>" + d + "</div>"));
			}
		})
		el.append(e);
		return el;
	}

	button(widget){
		const el = $("<div class='button "+(widget.params.addClass || '')+"'></div>"); 
		if(widget.params.trigger){
			el.click(function(){
				const el = $(this);
				el.toggleClass('active');
				setTimeout(()=>widget.params.callback && widget.params.callback(el.hasClass('active')));
			});
		}else{
			el.click(function(){
				$(this).addClass('active');
				setTimeout(()=>$(this).removeClass('active'),20);
				widget.params.callback && widget.params.callback();
			});
		}
		const d = widget.params.text ? (widget.params.text === true ? randSumbol()+randSumbol()+randSumbol() : widget.params.text) : "";
		el.append($("<div>"+d+"</div>"));
		if(widget.params.blink){
			el.append($("<div class='blink "+widget.params.blink+"'></div>"));
		}
		return el;
	}
}
