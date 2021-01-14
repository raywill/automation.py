var fs = require("fs");
var data = '';
var ident = 0;
var tab = 4;

// 创建可读流
var readerStream = fs.createReadStream('input.txt');
// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs.createWriteStream('output.txt');

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
         writerStream.write(c);
         nextline();
         break;
       case '}':
       case ']':
         dec_ident();
         nextline();
         writerStream.write(c);
         break;
       case ',':
         writerStream.write(c);
         nextline();
         break;
       case ':':
         writerStream.write(": ");
         break;
      default:
         writerStream.write(c);
         break;
     }
   }

   writerStream.end();
});


writerStream.on('finish', function() {
    console.log("写入完成。");
});

writerStream.on('error', function(err){
   console.log(err.stack);
});


readerStream.on('error', function(err){
   console.log(err.stack);
});

