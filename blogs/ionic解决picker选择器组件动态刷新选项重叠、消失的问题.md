---
date: 2024-04-02
tags:
  - ionic
categories:
  - 前端
image: https://ghcdn.pages.dev/pic/202404132207985.webp
---

# ionic 解决 picker 选择器组件动态刷新选项重叠、消失的问题

## 本地环境

```dart
Ionic:
   Ionic CLI                     : 6.17.1
   Ionic Framework               : @ionic/angular 5.9.2
   @angular-devkit/build-angular : 12.0.0
   @angular-devkit/schematics    : 12.0.5
   @angular/cli                  : 12.0.5
   @ionic/angular-toolkit        : 4.0.0
```

## 问题说明

多列选择的时候，动态刷新其他列，出现选项全挤在一行的情况，滑动后恢复正常。 属于官方未解决的 bug： [https://github.com/ionic-team/ionic-framework/issues/17664](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fionic-team%2Fionic-framework%2Fissues%2F17664)

## 解决方案

每列的选项数量固定为可能性的最大值，实际选项不足的时候填补空白选项，并设置 disabled 属性。这样空选项不会显示出来。

```csharp
if (newOptions.length < max) {
    for (let j = newOptions.length - 1; j < max; j++) {
        const disabledOption: PickerColumnOption = {
            text: '',
            value: -1,
            disabled: true, // 空白选项不显示
            transform: '', // 解决切换选项后，有时选项不会显示的问题
        }
        newOptions.push(disabledOption)
    }
}
```

触发刷新还需要保证列 PickerColumn 的 prevSelected ！= selectedIndex，比如新建列前者不设置，后者设为 0.
