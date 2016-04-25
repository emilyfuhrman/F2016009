window.onload = function(){

	return {

		w:window.innerWidth,
		h:window.innerHeight,

		slider:null,

		animate:false,
		animationInterval:null,
		animationSpeed:20000,

		//(same as onresize function)
		size:function(){
			var orig_w_w = 1436,
				orig_w_h = 782,

				w_w = window.innerWidth,
				w_h = window.innerHeight,

				nav_w = 250,
				nav_h = 200,
				nav_w_r = nav_w/orig_w_w,
				nav_h_r = nav_h/nav_w,

				logo_w = 150,
				logo_h = 87,
				logo_w_r = logo_w/orig_w_w,
				logo_h_r = logo_h/logo_w;

			//calculate new nav and logo widths
			var new_nav_w = nav_w_r*w_w,
				new_nav_h = nav_h_r*new_nav_w,

				new_logo_w = logo_w_r*w_w,
				new_logo_h = logo_h_r*new_logo_w;

			//scale nav and logo
			d3.select('#nav')
				.style('width',new_nav_w +'px')
				.style('height',new_nav_h +'px');
			d3.select('#logo')
				.style('width',new_logo_w +'px')
				.style('height',new_logo_h +'px');

			//vertically align SVG
			var svg = $('#ecosystem'),
				svg_diff = w_h -svg.height();

			svg.css('margin-top',(svg_diff/2) +'px');
		},
		getFile:function(){
			var self = this;

			self.svg = d3.select('#ecosystem')[0][0];

			//import external file
			d3.xml('images/ecosystem.svg','images/svg+xml',function(e,x){
				if(!e){
					self.svg.appendChild(x.documentElement);
					self.size();
					self.initNav();
					self.generate();
				}
			});
		},
		initNav:function(){
			var self = this;

			//create slider
			self.slider = $('#slider').slider({
				value:1,
				min:1,
				max:5,
				slide:function(event, ui){
					self.update(ui.value);
					self.manual = true;
					//$('#amount').val(ui.value);
				}
			});
			self.manual = true;

			//$('#amount').val(self.slider.slider('value'));
			$('#amount').val('Select phase:');

			//add click handler to 'animate' button
			d3.select('#animate')
				.on('click',function(){
					if(!self.animate){
						self.animate = true;
						self.playAnimation();
						d3.select(this).classed('active',true);
					} else{
						self.animate = false;
						self.pauseAnimation();
						d3.select(this).classed('active',false);
					}
				});
		},
		generate:function(){
			var self = this;

			//1 - g#center_1_
			//2 - g#tp_nonsoc, g#tp_nonsoc_labels
			//3 - g#tp_soc_existing, g#tp_soc_existing_labels
			//4 - g#tp_soc_prop, g#tp_soc_prop_labels
			//5 - g#paths_u

			self.update(self.slider.slider('value'));
		},
		update:function(_state){
			var self = this,
				s = _state || 1;

			if(s == 1){
				d3.selectAll('._1').classed('show',true);
				d3.selectAll('._2, ._3, ._4, ._5').classed('show',false);
			} else if(s == 2){
				d3.selectAll('._1, ._2').classed('show',true);
				d3.selectAll('._3, ._4, ._5').classed('show',false);
			} else if(s == 3){
				d3.selectAll('._1, ._2, ._3').classed('show',true);
				d3.selectAll('._4, ._5').classed('show',false);
			} else if(s == 4){
				d3.selectAll('._1, ._2, ._3, ._4').classed('show',true);
				d3.selectAll('._5').classed('show',false);
			} else if(s == 5){
				d3.selectAll('._1, ._2, ._3, ._4, ._5').classed('show',true);
			}
		},
		playAnimation:function(){
			var self = this;

			function animate(){
				var val_current = self.slider.slider('value'),
					val_new;

				//count up state of slider
				if(val_current === 5){
					if(!self.manual){
						val_new = null
					} else{
						val_new = 1;
					}
				} else{
					val_new = val_current +1;
				}

				//if counting up to a new value, update
				//if not, pause
				if(val_new){
					self.slider.slider('value',val_new);
					self.update(val_new);
					self.manual = false;
				} else{
					self.animate = false;
					self.pauseAnimation();
					d3.select('#animate').classed('active',false);
					self.manual = true;
				}
			}

			animate();
			self.animationInterval = setInterval(animate,self.animationSpeed);
		},
		pauseAnimation:function(){
			var self = this;
			clearInterval(self.animationInterval);
		}
	}
}().getFile();

window.onresize = function(){
	var orig_w_w = 1436,
		orig_w_h = 782,

		w_w = window.innerWidth,
		w_h = window.innerHeight,

		nav_w = 250,
		nav_h = 200,
		nav_w_r = nav_w/orig_w_w,
		nav_h_r = nav_h/nav_w,

		logo_w = 150,
		logo_h = 87,
		logo_w_r = logo_w/orig_w_w,
		logo_h_r = logo_h/logo_w;

	var new_nav_w = nav_w_r*w_w,
		new_nav_h = nav_h_r*new_nav_w,

		new_logo_w = logo_w_r*w_w,
		new_logo_h = logo_h_r*new_logo_w;

	d3.select('#nav')
		.style('width',new_nav_w +'px')
		.style('height',new_nav_h +'px');

	d3.select('#logo')
		.style('width',new_logo_w +'px')
		.style('height',new_logo_h +'px');

	//vertically align SVG
	var svg = $('#ecosystem'),
		svg_diff = w_h -svg.height();

	svg.css('margin-top',(svg_diff/2) +'px');
}