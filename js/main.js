(function () {
	var choosed = JSON.parse(localStorage.getItem('choosed') || '{}') || {}
	var speed = function () {
		return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)]
	}
	var getKey = function (item) {
		return item.name + ' - ' + item.phone
	}
	var createHTML = function () {
		var html = ['<ul>']
		// member = member.slice(0, 120)
		// 从 localstorage 中取数据
        var localMembers = JSON.parse(window.localStorage['members'] || '{}');

        console.log('localMembers.length ', localMembers.length);
        if (localMembers.length > 0) {
        	member = localMembers;
		}

		member.forEach(function (item, index) {
			item.index = index
			var key = getKey(item)
			var color = choosed[key] ? 'yellow' : 'white'
			html.push('<li><a href="#" style="color: ' + color + ';">' + item.name + '</a></li>')
		})
		html.push('</ul>')
		return html.join('')
	}
	var lottery = function (count) {
		var list = canvas.getElementsByTagName('a')
		var color = 'yellow'
		var ret = member
				.filter(function (m, index) { // 去掉已经中奖的
					m.index = index
					return !choosed[getKey(m)]
				})
				.map(function (m) { // 给每个人加个权重
					return Object.assign({
						score: Math.random()
					}, m)
				})
				.sort(function (a, b) { // 按照从小到大的顺序排列
					return a.score - b.score
				})
				.slice(0, count) // 取前count个
				.map(function (m) {
					choosed[getKey(m)] = 1
					list[m.index].style.color = color
					return m.name + ' - ' + m.phone
				})
		localStorage.setItem('choosed', JSON.stringify(choosed))
		return ret
	}
	var canvas = document.createElement('canvas')
	canvas.id = 'myCanvas'
	canvas.width = document.body.offsetWidth
	canvas.height = document.body.offsetHeight - 10
	document.getElementById('main').appendChild(canvas)
	new Vue({
		el: '#operateBox',
		data: {
			selected: 1,
			running: false,
			btns: [
				5, 4, 3, 2, 1
			]
		},
		mounted() {
			canvas.innerHTML = createHTML()
			console.log(screenWidth, 'screenWidth');
			TagCanvas.Start('myCanvas', '', {
				textColour: null,
				initial: speed(),
				dragControl: 1,
				textHeight: screenWidth / DESIGN_WIDTH * 18 // 设置字体的大小
			})
		},
		methods: {
			reset: function () {
				if (confirm('确定要重置么？所有之前的抽奖历史将被清除！')) {
					localStorage.clear()
					location.reload(true)
				}
			},
			onClick: function (num) {
				$('#result').css('display', 'none')
				$('#main').removeClass('mask')
				this.selected = num
			},
			toggle: function () {
				if (this.running) {
					TagCanvas.SetSpeed('myCanvas', speed())
					var ret = lottery(this.selected)
					if (ret.length === 0) {
						$('#result').css('display', 'block')
						$('#pannelContent').html('<p>已抽完</p>')
						$('#main').addClass('mask')
						return
					}
					$('#result').css('display', 'block')
					$('#pannelContent').html('<p>' + ret.join('</p><p>') + '</p>')
					TagCanvas.Reload('myCanvas')
					// setTimeout(function () {
					// 	localStorage.setItem(new Date().toString(), JSON.stringify(ret))
					// 	$('#main').addClass('mask')
					// }, 300)
					$('#main').addClass('mask')
				} else {
					$('#result').css('display', 'none')
					$('#main').removeClass('mask')
					TagCanvas.SetSpeed('myCanvas', [5, 1])
				}
				this.running = !this.running
			},
			closeResultPannel: function () {
				$('#result').css('display', 'none')
				$('#main').removeClass('mask')
			}
		}
	})
})()