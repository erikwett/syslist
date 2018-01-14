define(["qlik"],
	function (qlik) {
		//very basic styling
		var style = ".qv-object-syslist .container, .qv-object-syslist .panel {height: 100%;width: 50%;overflow: auto;} " +
			".qv-object-syslist .header {font-weight: bold;} " +
			".qv-object-syslist ul {list-style: none;} " +
			".qv-object-syslist li {display:inline-block;margin:3px;padding:4px;border:1px solid #ddd;}" +
			".qv-object-syslist .panel {position: absolute;top: 0;right:0;white-space: pre-wrap;padding: 3px;user-select: text;background-color: #eee;border-left: 2px solid #aaa;} ";
		var element = document.createElement('style');
		element.innerHTML = style;
		document.head.appendChild(element);

		function createHeader(txt, cnt) {
			var h = document.createElement('div');
			h.className = 'header';
			h.innerHTML = txt + '(' + cnt + ')';
			return h;
		}

		function createList(items) {
			var ul = document.createElement('ul');
			items.forEach(function (i) {
				var li = document.createElement('li');
				li.innerHTML = i.qName ? i.qName : i.qMeta.title;
				li.dataset.prop = JSON.stringify(i, null, 4);
				ul.appendChild(li);
			});
			return ul;
		}
		return {
			initialProperties: {
				moneyFormat: {
					qStringExpression: '=MoneyFormat'
				},
				qMeasureListDef: {
					qType: "measure",
					qData: {
						qMeasure: "/qMeasure"
					}
				},
				qDimensionListDef: {
					qType: "dimension",
					qData: {
						qDim: "/qDim",
						qDimInfos: "/qDimInfos"
					}
				},
				qVariableListDef: {
					qType: "variable",
					qShowReserved: true,
					qShowConfig: true
				},
				qFieldListDef: {
					qShowSystem: true,
					qShowHidden: true,
					qShowSemantic: true,
					qShowSrcTables: true,
					qShowDerivedFields: true,
					qShowImplicit: true
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function ($element, layout) {
				var el = $element[0];
				//clear contents
				el.innerHTML = '';
				//set up basic structure
				var container = document.createElement('div'),
					panel = document.createElement('div');
				container.className = 'container';
				panel.className = 'panel';
				el.appendChild(container);
				el.appendChild(panel);
				//show the variable
				container.innerHTML = '<span class="header">MoneyFormat:</span>' + layout.moneyFormat;
				//build the lists
				for (var prop in layout) {
					if (layout[prop].qItems) {
						container.appendChild(createHeader(prop, layout[prop].qItems.length));
						container.appendChild(createList(layout[prop].qItems));
					}
				}
				//set up click event
				$element.find('[data-prop]').on('click', function (ev) {
					panel.innerHTML = this.dataset.prop;
				});
				return qlik.Promise.resolve();
			},
			resize: function () {
				// don't need to repaint on resize
			}
		};

	});