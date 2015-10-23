# chgcharset

批量更改文件编码集的工具。

可以将gbk编码文件批量改成utf8方式的，支持bom等，也可以反向转换。

通过[iconv-lite](https://github.com/ashtuchkin/iconv-lite)来做编码转换，所以只要iconv-lite支持的编码变换都能支持。

通过[glob](https://github.com/isaacs/node-glob)来做文件通配符遍历，所以glob支持的通配符都能支持。

nodejs命令行参数处理使用了[yargs](https://github.com/bcoe/yargs)。

理论上是跨平台的，nodejs支持的平台都能运行。

> 注意：源编码集如果设置得不对，可能造成错误的编码转换，本工具会做一定的源编码校验，但不保证一定正确。

安装&使用
---
```
npm install chgcharset -g
chgcharset **/*.lua -i gbk -o utf8 --bom
```

