var fs = require("fs");
//var ts = require("timestamp");
var data = '';
var ident = 0;
var tab = 4;
var cur_line = "";
var begin = false; // 标记开始记录值
var outFile = "output.json"

var isIntNum = function (val) {
    var regPos = /^\d+$/; // 非负整数
    var regNeg = /^\-[1-9][0-9]*$/; // 负整数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}

var dateFormat = function (timestamp, formats) {
    // formats格式包括
    // 1. Y-m-d
    // 2. Y-m-d H:i:s
    // 3. Y年m月d日
    // 4. Y年m月d日 H时i分
    formats = formats || 'Y-m-d';

    var zero = function (value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    };

    var rest = timestamp % 1000000;
    var timestamp = parseInt(timestamp / 1000);
    var myDate = new Date(timestamp);

    var year = myDate.getFullYear();

    var month = zero(myDate.getMonth() + 1);
    var day = zero(myDate.getDate());

    var hour = zero(myDate.getHours());
    var minite = zero(myDate.getMinutes());
    var second = zero(myDate.getSeconds());

    return formats.replace(/Y|m|d|H|i|s/ig, function (matches) {
        return ({
            Y: year,
            m: month,
            d: day,
            H: hour,
            i: minite,
            s: second
        })[matches];
    }) + '.' + rest;
};



// 创建可读流
var readerStream = fs.createReadStream('input.txt');
// 创建一个可以写入的流，写入到文件 outFile 中
var writerStream = fs.createWriteStream(outFile);

// 使用 utf8 编码写入数据
writerStream.write(data,'UTF8');

readerStream.on('data', function(chunk) {
   data += chunk;
});

function nextline()
{
  writerStream.write("\n");
  for (var i = 0; i < ident * tab; ++i) {
    writerStream.write(" ");
  }
}

function on_finish_line()
{
  if (cur_line.substring(0, 3) == '161') {
    cur_line = dateFormat(cur_line, 'Y-m-d H:i:s');
    writerStream.write(" (" + cur_line + ")");
  } else if (isIntNum(cur_line) && cur_line.length > 10) {
    writerStream.write(" (0x" + parseInt(cur_line).toString(16) + ")");
  }
}

function begin_emit(c)
{
  begin = true;
  cur_line = "";
  writerStream.write(c);
}

function finish_emit(c)
{
  on_finish_line();
  cur_line = "";
  begin = false;
  writerStream.write(c);
}

function emit(c)
{
  if (begin)
    cur_line += c;
  writerStream.write(c);
}

function inc_ident()
{
  ident++;
}
function dec_ident()
{
  if (ident > 0) ident--;
}

readerStream.on('end',function(){
   console.log(data);
   for (var i = 0; i < data.length; i++) {
     var c = data[i];
     switch (c) {
       case ' ':
         break;
       case '{':
       case '[':
         inc_ident();
         emit(c);
         nextline();
         break;
       case '}':
       case ']':
         dec_ident();
         nextline();
         emit(c);
         break;
       case ',':
         finish_emit(c);
         nextline();
         break;
       case '\n':
         break;
       case ':':
       case '=':
         begin_emit(c + " ");
         break;
      default:
         emit(c);
         break;
     }
   }

   writerStream.end();
});


writerStream.on('finish', function() {
    console.log("写入完成。");
    var spawn = require('child_process').spawn;
    spawn('open', [outFile]);
});

writerStream.on('error', function(err){
   console.log(err.stack);
});


readerStream.on('error', function(err){
   console.log(err.stack);
});

