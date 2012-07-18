(function() {
  var Block, CELL, CELL_BK, CELL_KEEP, Map, el, id, map, r, sc;

  el = document.getElementById('mainsvg');

  sc = document.getElementById('score');

  r = Raphael(el, 1500, 1500);

  CELL = 20;

  CELL_BK = 'gray';

  CELL_KEEP = 'blue';

  Map = (function() {

    Map.prototype.x = 0;

    Map.prototype.y = 0;

    Map.prototype.arr = [];

    Map.prototype.arrWk = [];

    Map.prototype.currentBlock = null;

    Map.prototype.pt = 0;

    function Map(x, y, width, height) {
      var i;
      this.x = x;
      this.y = y;
      for (i = 0; 0 <= height ? i < height : i > height; 0 <= height ? i++ : i--) {
        this.arr[i] = this.createRow(width);
      }
    }

    Map.prototype.createRow = function(width) {
      var arr, j;
      if (width == null) width = 10;
      arr = [];
      for (j = 0; 0 <= width ? j < width : j > width; 0 <= width ? j++ : j--) {
        arr[j] = CELL_BK;
      }
      return arr;
    };

    Map.prototype.putBlock = function(block) {
      var arr, cell, x, y, _base, _i, _len, _results;
      this.currentBlock = block;
      this.arrWk = [];
      arr = block.current();
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        cell = arr[_i];
        x = cell[0] + block.x;
        y = cell[1] + block.y;
        (_base = this.arrWk)[y] || (_base[y] = []);
        _results.push(this.arrWk[y][x] = block.color);
      }
      return _results;
    };

    Map.prototype.keepBlock = function(block) {
      var arr, cell, x, y, _base, _i, _len, _results;
      this.currentBlock = null;
      this.arrWk = [];
      arr = block.current();
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        cell = arr[_i];
        x = cell[0] + block.x;
        y = cell[1] + block.y;
        (_base = this.arr)[y] || (_base[y] = []);
        _results.push(this.arr[y][x] = CELL_KEEP);
      }
      return _results;
    };

    Map.prototype.checkBlock = function(block) {
      var arr, cell, x, y, _i, _len;
      arr = block.current();
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        cell = arr[_i];
        x = cell[0] + block.x;
        y = cell[1] + block.y;
        if (!this.arr[y]) return false;
        if (this.arr[y][x] !== CELL_BK) return false;
      }
      return true;
    };

    Map.prototype.checkRows = function() {
      var cell, completeRows, flg, i, j, row, _i, _len, _len2, _len3, _ref, _results;
      completeRows = [];
      _ref = this.arr;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        row = _ref[i];
        flg = true;
        for (j = 0, _len2 = row.length; j < _len2; j++) {
          cell = row[j];
          if (this.arr[i][j] === CELL_BK) flg = false;
        }
        if (flg === true) completeRows.push(i);
      }
      _results = [];
      for (_i = 0, _len3 = completeRows.length; _i < _len3; _i++) {
        i = completeRows[_i];
        this.arr.splice(i, 1);
        row = this.createRow();
        console.log(row);
        this.arr.unshift(row);
        _results.push(this.pt += 1);
      }
      return _results;
    };

    Map.prototype.render = function() {
      var cell, fillCell, i, j, row, _len, _ref, _results;
      this.checkRows();
      sc.innerText = this.pt;
      _ref = this.arr;
      _results = [];
      for (i = 0, _len = _ref.length; i < _len; i++) {
        row = _ref[i];
        _results.push((function() {
          var _len2, _results2;
          _results2 = [];
          for (j = 0, _len2 = row.length; j < _len2; j++) {
            cell = row[j];
            if (this.arrWk[i] && this.arrWk[i][j]) {
              fillCell = this.arrWk[i][j];
            } else {
              fillCell = cell;
            }
            _results2.push(r.rect(this.x + CELL * j, this.y + CELL * i, CELL, CELL).attr({
              fill: fillCell,
              stroke: '#888888'
            }));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    return Map;

  })();

  Block = (function() {

    Block.prototype.conf = [[[[0, 0], [0, 1], [1, 0], [1, 1]]], [[[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [1, 0], [2, 0], [3, 0]]]];

    Block.prototype.x = 4;

    Block.prototype.y = 0;

    Block.prototype.xOrg = 0;

    Block.prototype.yOrg = 0;

    Block.prototype.arr = [];

    Block.prototype.rotate = 0;

    Block.prototype.rotateOrg = 0;

    Block.prototype.color = "#f00";

    function Block() {
      var idx;
      idx = Math.floor(Math.random() * this.conf.length);
      this.arr = this.conf[idx];
    }

    Block.prototype.current = function() {
      var idx;
      idx = this.rotate % this.arr.length;
      return this.arr[idx];
    };

    Block.prototype.move = function(x, y) {
      this.keepOrg();
      this.x += x;
      this.y += y;
      return this;
    };

    Block.prototype.turn = function() {
      this.keepOrg();
      this.rotate += 1;
      return this;
    };

    Block.prototype.keepOrg = function() {
      this.rotateOrg = this.rotate;
      this.xOrg = this.x;
      return this.yOrg = this.y;
    };

    Block.prototype.rollback = function() {
      this.rotate = this.rotateOrg;
      this.x = this.xOrg;
      this.y = this.yOrg;
      return this;
    };

    return Block;

  })();

  map = new Map(0, 0, 10, 20);

  id = setInterval(function() {
    var block;
    if (map.currentBlock === null) {
      block = new Block();
      if (!map.checkBlock(block)) {
        sc.innerText = map.pt + ' (You dead)';
        clearInterval(id);
        return false;
      } else {
        map.putBlock(block);
      }
    } else {
      block = map.currentBlock.move(0, 1);
      if (map.checkBlock(block)) {
        map.putBlock(block);
      } else {
        block = map.currentBlock.move(0, -1);
        map.keepBlock(block);
      }
    }
    return map.render();
  }, 100);

  map.render();

  window.document.onkeydown = function(e) {
    var block, org, x, y;
    x = y = 0;
    org = map.currentBlock;
    if (e.keyCode === 32) {
      block = map.currentBlock.turn();
    } else {
      if (e.keyCode === 37) x = -1;
      if (e.keyCode === 39) x = 1;
      if (e.keyCode === 40) y = 1;
      if (map.currentBlock) block = map.currentBlock.move(x, y);
    }
    if (block) {
      if (map.checkBlock(block)) {
        map.putBlock(block);
      } else {
        block = map.currentBlock.rollback();
        if (e.keyCode === 40) map.keepBlock(block);
      }
      return map.render();
    }
  };

}).call(this);
