# Ecode
Javascript易语言代码框

## 3.5
1、修复如果真流程线不一致
2、修复部分注释代码内容被高亮
3、添加且&或，真&假
4、修复命令高亮的bug

## 3.4 (3.0的流程线部分推倒重做了)
1. 修复若干bug
2. 改进流程线

## 3.0
1. 此版本为重写版本, 与上一个版本不通用(废弃), 推荐用此版本
2. 添加流程线小箭头
3. 重写转换后的html结构, 便于自定义样式. 进行外部js修改简单
4. 无需像上版本需要特定格式的id名
5. 支持全局转换. 指定元素单个转换以及自定义目标元素数组转换
6. 容错性提高, 支持程序集代码 dll代码等多个部分同时存在的情况, 建议还是分开放置
7. 优化操作部分
8. 提高兼容性

### 兼容性说明
1. 支持 Chrome
2. 支持 Firefox
3. 支持 Safari
4. 支持 IE 8+

### 使用说明
1. 引入ecode.css & ecode.js(可以自行下载，也可以直接从本站引用)
2. 创建Ecode对象
3. 使用对象的tran方法
PS: 使用方法请参考本页面代码, 此版本为UTF-8版本, 如需其他编码格式请自行转码
