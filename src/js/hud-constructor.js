function init(widgets) {
	window.master = new masterClass(widgets);
}
const grid = 86;
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
class masterClass {
	constructor(widgets){
		this.widgets = widgets;
		this.generate();
	}

	generate(){
		const el = $('#grid');
		const content = $('#content');
		for(let i = 0; i < 9*14; i++) el.append("<div>");
		this.widgets.map(widget => {
			const w = typeof widget.content === "string" ? this[widget.content](widget) : widget.content(widget);
			w.css({
				top: widget.y*grid,
				left: widget.x*grid,
				width: (widget.w || 1)*grid-6,
				height: (widget.h || 1)*grid-6
			})
			content.append(w);
			if(widget.after) widget.after(w);
		})
	}

	text(widget){
		let d = texts[widget.params.text];
		if(widget.params.count){
			for(let i = 0; i<widget.params.count-1; i++) d+="<br><br>"+d;
		}
		return $("<div class='textList'><div class="+widget.params.addClass+">"+d+"</div></div>");
	}

	list(widget){
		const el = $("<div class='list "+widget.params.addClass+"'></div>"); 
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
		const el = $("<div class='bars "+widget.params.addClass+"'></div>"); 
		if(widget.params.data === 'random'){
			let data = [];
			for(let i = 0; i < widget.params.count; i++) data.push(rand(100));
			widget.params.data = data;
		}
		widget.params.data.map(bar => {
			const b = $("<div>");
			b.css({
				width: (widget.w * grid) / widget.params.data.length,
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
		const rb = $("<div class='round-bar'></div>");
		const rb2 = $("<div class='round-bar bottom'></div>");
		const ra = $("<div class='round-axis' data-count='100' data-radius='"+((widget.w * grid/2)*0.9)+"' data-max='360'></div>");
		const ra2 = $("<div class='round-axis inside' data-inside='true' data-count='100' data-radius='"+((widget.w * grid/2)*0.73)+"' data-max='360'></div>");
		rb2.append("<div class='bar' data-value='0' data-max='100' data-side='left' style='border-color: var(--c-second);'></div>");
		rb.append("<div class='bar' data-value='0' data-max='100' data-side='left' style='border-color: var(--c-second);'></div>");
		rb2.append("<div class='bar line2' data-value='0' data-max='100' data-side='right' style='border-color: var(--c-negative);'></div>");
		rb.append("<div class='bar line2' data-value='0' data-max='100' data-side='right' style='border-color: var(--c-negative);'></div>"); 
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
		el.find('.bar').each(function() {
			$(this).data('value', rand(100)).trigger('update')
		});
		el.find('.centerElement div').html(rand(9999));
		setTimeout(()=>this.roundBarUpdate(el, widget), rand(widget.update.time))
	}
	values1(widget){
		const el = $("<div class='values1 "+widget.params.addClass+"'></div>"); 
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
		const el = $("<div class='values2 "+widget.params.addClass+"'></div>"); 
		const e = $("<div>");
		const d = widget.params.name === true ? randSumbol()+randSumbol()+randSumbol() : widget.params.name;
		e.append("<b>"+d+"</b>");
		const v = $("<span>").html(rand(widget.params.max));
		e.append(v);
		if(widget.update){
			setTimeout(()=>this[widget.update.callback](v, widget), rand(widget.update.time))
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
		const el = $("<div class='map "+widget.params.addClass+"'></div>"); 
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
		const el = $("<div class='liner "+widget.params.addClass+"'></div>");
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
			if(widget.params.center.indexOf('text') > -1) {
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
		const el = $("<div class='button "+widget.params.addClass+"'></div>"); 
		if(widget.params.trigger){
			el.click(function(){
				$(this).toggleClass('active');
			});
		}else{
			el.click(function(){
				$(this).addClass('active');
				setTimeout(()=>$(this).removeClass('active'),20);
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
